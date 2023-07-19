from resources import Edge
from util import get_conf

import numpy as np


class VEdge:
    def __init__(self, conf_path="../config.yaml"):
        self.edges = []
        self.space = []
        self.episode = 0
        self.t = 0
        self.reward = 0
        self.rewards = []
        self.conf = get_conf(conf_path)
        for edge in self.conf['edges']:
            self.edges.append(Edge(edge['name'], edge['cpu'], edge['memory'], edge['gpu']))

    def reset(self):
        self.rewards.append(self.reward)
        self.episode += 1
        self.reward = 0
        for edge in self.edges:
            edge.reset()

        self.space = self.state()

        return np.array(self.space).astype(np.float32)

    # def act(self, task, action):
    #     if action not in range(len(self.edges)):
    #         raise ValueError("Received invalid action={} which is not part of the action space".format(action))

    #     self.edges[action].assign(task)

    # def step(self, task, action):
    #     if task:
    #         self.act(task, action)

    #     for edge in self.edges:
    #         edge.update(1)

    #     reward = 0
    #     done = False

    #     self.t += 1

    #     return self.state(), reward, done

    def state(self):
        self.space = []
        for edge in self.edges:
            self.space.append(edge.state())
        return self.space

    def render(self):
        print(self.t)
        for edge in self.edges:
            print(edge.name, edge.state())
        print()

    def get_conf(self):
        return self.conf

    def get_len_state(self):
        len_state = 0
        for edge in self.edges:
            len_state += edge.get_queue()
        return len_state

    def get_num_actions(self):
        return len(self.edges)

if __name__ == '__main__':
    ve = VEdge()
    ve.state