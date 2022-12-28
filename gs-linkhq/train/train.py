import os
from datetime import datetime

import torch
import numpy as np

import matplotlib.pyplot as plt

from agent.ppo import PPO

from env.vedge import VGEdge
from env.util import Generator


def train():
    ###################################### initialize environment hyperparameters ######################################
    env_name = "vedge"

    max_ep_len = 60 * 60

    max_episodes = 200

    print_freq = 1
    log_freq = 1

    action_std = 0.6
    action_std_decay_rate = 0.05
    min_action_std = 0.1
    action_std_decay_freq = max_ep_len * 9999
    ####################################################################################################################

    ############################################### PPO hyperparameters ################################################
    update_episodes = 4
    K_epochs = 80

    eps_clip = 0.2
    gamma = 0.99

    lr_actor = 0.0003
    lr_critic = 0.001

    random_seed = 0
    #####################################################

    print("training environment name : " + env_name)

    env = VGEdge('config.yaml', max_t=max_ep_len)

    # state space dimension
    state_dim = env.get_len_state()

    # action space dimension
    action_dim = env.get_len_action()

    ##################################################### logging ######################################################

    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    log_dir = os.path.join(log_dir, env_name)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    run_num = 0
    current_num_files = next(os.walk(log_dir))[2]
    run_num = len(current_num_files)

    log_f_name = os.path.join(log_dir, 'PPO_' + env_name + "_log_" + str(run_num) + ".csv")

    print("logging at : " + log_f_name)
    ####################################################################################################################

    ################################################## checkpointing ###################################################
    run_num_pretrained = 0

    directory = "weights"
    if not os.path.exists(directory):
        os.makedirs(directory)

    directory = directory + '/' + env_name + '/'
    if not os.path.exists(directory):
        os.makedirs(directory)

    checkpoint_path = directory + "{}.pth".format(env_name)
    print("save checkpoint path : " + checkpoint_path)
    ####################################################################################################################

    ############################################ print PPO hyperparameters #############################################
    print("-----------------------------------------------------------------------------------------------------------")
    print("max episodes : ", max_episodes)
    print("max timesteps per episode : ", max_ep_len)
    print("log frequency : " + str(log_freq) + " episodes")
    print("printing average reward over episodes in last : " + str(print_freq) + " episodes")
    print("-----------------------------------------------------------------------------------------------------------")
    print("state space dimension : ", state_dim)
    print("action space dimension : ", action_dim)
    print("-----------------------------------------------------------------------------------------------------------")
    print("Initializing a continuous action space policy")
    print("-----------------------------------------------------------------------------------------------------------")
    print("starting std of action distribution : ", action_std)
    print("decay rate of std of action distribution : ", action_std_decay_rate)
    print("minimum std of action distribution : ", min_action_std)
    print("decay frequency of std of action distribution : " + str(action_std_decay_freq) + " timesteps")
    print("-----------------------------------------------------------------------------------------------------------")
    print("PPO update frequency : " + str(update_episodes) + " episodes")
    print("PPO K epochs : ", K_epochs)
    print("PPO epsilon clip : ", eps_clip)
    print("discount factor (gamma) : ", gamma)
    print("-----------------------------------------------------------------------------------------------------------")
    print("optimizer learning rate actor : ", lr_actor)
    print("optimizer learning rate critic : ", lr_critic)
    if random_seed:
        print("-------------------------------------------------------------------------------------------------------")
        print("setting random seed to ", random_seed)
        torch.manual_seed(random_seed)
        env.seed(random_seed)
        np.random.seed(random_seed)
    ####################################################################################################################

    print("===========================================================================================================")

    ##################################################### training #####################################################

    ppo_agent = PPO(state_dim, action_dim, lr_actor, lr_critic, gamma, K_epochs, eps_clip, action_std)

    start_time = datetime.now().replace(microsecond=0)
    print("Started training at (GMT) : ", start_time)

    print("===========================================================================================================")

    log_f = open(log_f_name, "w+")
    log_f.write('episode,timestep,reward\n')

    print_running_reward = []
    log_running_reward = []

    time_step = 0
    i_episode = 1

    plot_reward = []

    def to_ratio(x):
        if sum(x) == 0:
            return [1/len(x)] * len(x)
        return x/sum(x)

    while i_episode <= max_episodes:
        done = False
        state = env.reset()
        current_ep_reward = 0
        current_ep_reward_list = []
        generators = []
        for i in range(action_dim - 1):
            generators.append(Generator(action_dim - 1))

        while not done:
            for i in range(len(generators)):
                gen = generators[i]
                for j in range(gen.request()):
                    task = gen.task()
                    task = [i+1] + task

                    state[0:len(task)] = task

                    action = ppo_agent.select_action(state)
                    action_ratio = to_ratio(action)
                    state, reward = env.act(task, action_ratio)

                    ppo_agent.buffer.rewards.append(reward)
                    ppo_agent.buffer.is_terminals.append(done)

                    current_ep_reward += reward
                    current_ep_reward_list.append(reward)

            state, done = env.step()
            time_step += 1

            if time_step % action_std_decay_freq == 0:
                ppo_agent.decay_action_std(action_std_decay_rate, min_action_std)

        print_running_reward += current_ep_reward_list
        log_running_reward += current_ep_reward_list
        plot_reward.append(np.mean(current_ep_reward_list))

        if i_episode % log_freq == 0:
            log_avg_reward = np.mean(log_running_reward)

            log_f.write('{},{}\n'.format(i_episode, log_avg_reward))
            log_f.flush()

            log_running_reward = []

        if i_episode % print_freq == 0:
            print_avg_reward = np.mean(print_running_reward)

            print('Ep {}. \tmean reward: {},  \tlast action: {}'.format(i_episode, print_avg_reward, action_ratio))

            print_running_reward = []

        if i_episode % update_episodes == 0:
            ppo_agent.update()

        i_episode += 1

    plt.plot(plot_reward)
    plt.xlabel("Episode")
    plt.ylabel("Avg. Epsiodic Reward")
    plt.savefig('plot_{}.png'.format(env_name))

    log_f.close()

    print("===========================================================================================================")
    end_time = datetime.now().replace(microsecond=0)
    print("Started training at (GMT) : ", start_time)
    print("Finished training at (GMT) : ", end_time)
    print("Total training time  : ", end_time - start_time)
    print("===========================================================================================================")

    print("-----------------------------------------------------------------------------------------------------------")
    print("saving model at : " + checkpoint_path)
    ppo_agent.save(checkpoint_path)
    print("model saved")
    print("Elapsed Time  : ", datetime.now().replace(microsecond=0) - start_time)
    print("-----------------------------------------------------------------------------------------------------------")


if __name__ == '__main__':
    train()
