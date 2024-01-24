import math
import random
import logging

import numpy as np
from collections import namedtuple, deque

import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import time
import os


junho_logger = logging.getLogger('Junho')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

Transition = namedtuple(
    'Transition', ('state', 'action', 'next_state', 'reward'))


class ReplayMemory:
    def __init__(self, capacity):
        self.memory = deque([], maxlen=capacity)

    def push(self, state, action, state_next, reward):
        self.memory.append(Transition(state, action, state_next, reward))

    def sample(self, batch_size):
        return random.sample(self.memory, batch_size)

    def __len__(self):
        return len(self.memory)


class Network(nn.Module):
    def __init__(self, n_observations, n_actions):
        super(Network, self).__init__()
        self.fc1 = nn.Linear(n_observations, 128)
        self.fc2 = nn.Linear(128, 256)
        self.fc3 = nn.Linear(256, 256)
        self.fc4 = nn.Linear(256, 128)
        self.fc5 = nn.Linear(128, n_actions)
    
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = F.relu(self.fc4(x))
        return self.fc5(x)


class DQN:
    def __init__(self, n_observations, n_actions,
                 mem_capacity=100000, batch_size=1000, gamma=0.99,
                 eps_start=0.9, eps_end=0.00001, eps_decay=20000, tau=0.005, lr=0.0001, weight=None):
        
        self.n_observations = n_observations
        self.n_actions = n_actions
        self.mem_capacity = mem_capacity
        self.batch_size = batch_size
        self.gamma = gamma
        self.eps_start = eps_start
        self.eps_end = eps_end
        self.eps_decay = eps_decay
        self.tau = tau
        self.lr = lr
        self.steps_done = 0

        self.policy_net = Network(n_observations, n_actions).to(device)
        if weight:
            self.policy_net.load_state_dict(torch.load(weight))
        self.target_net = Network(n_observations, n_actions).to(device)
        self.target_net.load_state_dict(self.policy_net.state_dict())

        self.optimizer = optim.AdamW(self.policy_net.parameters(), lr=self.lr, amsgrad=True)
        self.memory = ReplayMemory(self.mem_capacity)

    def select_action(self, state):
        state = torch.unsqueeze(torch.tensor(state, dtype=torch.float32, device=device), 0)
        with torch.no_grad():
            #junho_logger.critical(self.policy_net(state))
            return self.policy_net(state).max(1)[1].view(1, 1)

    def optimize_model(self):
        try:
            if len(self.memory) < self.batch_size:
                # junho_logger.info('Not enough data. Skipping update\n')
                return True

            transitions = self.memory.sample(self.batch_size)
            batch = Transition(*zip(*transitions))

            non_final_mask = torch.tensor(tuple(map(lambda s: s is not None, batch.next_state)),
                                        device=device, dtype=torch.bool)
            non_final_next_states = torch.cat([s for s in batch.next_state if s is not None])

            state_batch = torch.cat(batch.state)
            action_batch = torch.cat(batch.action)
            reward_batch = torch.cat(batch.reward).squeeze()

            state_action_values = self.policy_net(state_batch).gather(1, action_batch)
            next_state_values = torch.zeros(self.batch_size, device=device)

            with torch.no_grad():
                next_state_values[non_final_mask] = self.target_net(non_final_next_states).max(1)[0].detach()

            expected_state_action_values = reward_batch + (self.gamma * next_state_values)

            criterion = nn.SmoothL1Loss()
            loss = criterion(state_action_values, expected_state_action_values.unsqueeze(1))
            self.optimizer.zero_grad()
            loss.backward()

            torch.nn.utils.clip_grad_value_(self.policy_net.parameters(), 100)
            self.optimizer.step()
            target_net_state_dict = self.target_net.state_dict()
            policy_net_state_dict = self.policy_net.state_dict()
            for key in policy_net_state_dict:
                target_net_state_dict[key] = policy_net_state_dict[key]*self.tau + target_net_state_dict[key]*(1-self.tau)
            self.target_net.load_state_dict(target_net_state_dict)


            return True

        except Exception as e:
            junho_logger.critical("optimize")
            junho_logger.critical(e)

            return False


    def memorize(self, state, action, next_state, reward):
        try:
            state = torch.unsqueeze(torch.tensor(state, dtype=torch.float32, device=device), 0)
            action = torch.unsqueeze(torch.tensor([action], dtype=torch.int64, device=device), 0)
            next_state = torch.unsqueeze(torch.tensor(next_state, dtype=torch.float32, device=device), 0)
            reward = torch.unsqueeze(torch.tensor([reward], dtype=torch.float32, device=device), 0)

            self.memory.push(state, action, next_state, reward)
        
        except Exception as e:
            junho_logger.critical("memorize")
            junho_logger.critical(e)

    def save_weight(self, file_path):
        torch.save(self.target_net.state_dict(), file_path)
    

if __name__ == '__main__':
    dqn = DQN(3, 10)
    for _ in range(10):
        action = dqn.get_action(torch.tensor([[1., 1., 1.]], device=device))
        junho_logger.debug(action.item())
