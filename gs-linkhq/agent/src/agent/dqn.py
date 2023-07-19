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


logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')

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
        self.fc2 = nn.Linear(128, 128)
        self.fc3 = nn.Linear(128, n_actions)
    
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return self.fc3(x)


class DQN:
    def __init__(self, n_observations, n_actions,
                 mem_capacity=10000, batch_size=100, gamma=0.99,
                 eps_start=0.9, eps_end=0.05, eps_decay=1000, tau=0.005, lr=0.0001):
        
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
        self.target_net = Network(n_observations, n_actions).to(device)
        self.target_net.load_state_dict(self.policy_net.state_dict())

        self.optimizer = optim.AdamW(self.policy_net.parameters(), lr=self.lr, amsgrad=True)
        self.memory = ReplayMemory(self.mem_capacity)

    def select_action(self, state):
        sample = random.random()
        eps_thresdhold = self.eps_end + (self.eps_start - self.eps_end) \
            * math.exp(-1. * self.steps_done / self.eps_decay)
        self.steps_done += 1

        state = torch.unsqueeze(torch.tensor(state, dtype=torch.float32, device=device), 0)

        if sample > eps_thresdhold:
            with torch.no_grad():
                return self.policy_net(state).max(1)[1].view(1, 1)
        else:
            return torch.tensor([[torch.randint(self.n_actions, (1,))]], device=device, dtype=torch.long)

    def optimize_model(self):
        if len(self.memory) < self.batch_size:
            return

        transitions = self.memory.sample(self.batch_size)

        batch = Transition(*zip(*transitions))

        non_final_mask = torch.tensor(tuple(map(lambda s: s is not None, batch.next_state)),
                                      device=device, dtype=torch.bool)
        non_final_next_states = torch.cat([s for s in batch.next_state if s is not None])

        state_batch = torch.cat(batch.state)
        action_batch = torch.cat(batch.action)
        reward_batch = torch.cat(batch.reward)

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


    def memorize(self, state, action, state_next, reward):
        state = torch.unsqueeze(torch.tensor(state, dtype=torch.float32, device=device), 0)
        # action = 
        self.memory.push(state, action, state_next, reward)

    def reset(self): #TODO: need check
        self.step = 0
        self.episode += 1
    

if __name__ == '__main__':
    dqn = DQN(3, 10)
    for _ in range(10):
        action = dqn.get_action(torch.tensor([[1., 1., 1.]], device=device))
        junho_logger.debug(action.item())
