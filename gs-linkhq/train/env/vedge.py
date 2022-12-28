from env.resources import Edge
from env.util import get_conf, Generator

import numpy as np


class VGEdge:
    def __init__(self, conf_path="../config.yaml", max_t=60 * 60 * 24):
        self.edges = []
        self.space = []
        self.episode = 0
        self.t = 0
        self.max_t = max_t
        self.cloud_flops = 200.0
        self.cloud_bw = 100.0
        self.edge_bw = 10000.0
        self.conf = get_conf(conf_path)
        for edge in self.conf['edges']:
            self.edges.append(Edge(edge['name'], edge['frequency']))

    def reset(self):
        self.episode += 1
        self.t = 0
        for edge in self.edges:
            edge.reset()

        self.space = self.state()

        return np.array(self.space).astype(np.float32)

    def act(self, task, action):
        delays = []
        for i in range(len(action)):
            if i == 0:
                if action[i] > 0:
                    dt = (task[1] + action[i] * task[2]) / self.cloud_bw
                else:
                    dt = 0
                dq = 0
                dc = task[3] * action[i] / self.cloud_flops

                delay = max([dt, dq]) + dc
                delays.append(delay)

            elif i == task[0]:

                if action[i] > 0:
                    dt = 0
                    dq = self.edges[i - 1].q_delay
                else:
                    dt = 0
                    dq = 0

                dc = task[3] * action[i] / self.edges[i-1].flops

                delay = max([dt, dq]) + dc
                delays.append(delay)

                self.edges[i - 1].assign(delay)

            else:
                if action[i] > 0:
                    dt = (task[1] + action[i] * task[2]) / self.edge_bw
                    dq = self.edges[i-1].q_delay
                else:
                    dt = 0
                    dq = 0

                dc = task[3] * action[i] / self.edges[i-1].flops

                delay = max([dt, dq]) + dc
                delays.append(delay)

                self.edges[i-1].assign(delay)

        dt = 0
        dq = self.edges[task[0]-1].q_delay
        dc = task[3] / self.edges[task[0]-1].flops

        greedy = max([dt, dq]) + dc
        # print('greedy:', greedy)

        #reward = -1.0 * max(delays) / task[2]
        #print(delays, max(delays))
        reward = greedy - max(delays)

        return self.state(), reward

    def step(self):
        for edge in self.edges:
            edge.update()

        self.t += 1

        done = self.t > self.max_t

        return self.state(), done

    def state(self):
        self.space = [0] * 4
        for edge in self.edges:
            self.space += edge.state()
        return np.array(self.space).astype(np.float32)

    def render(self):
        print('ep{}, t:{}'.format(self.episode, self.t))
        for edge in self.edges:
            print('{}: {}'.format(edge.name, edge.state()))
        print()

    def get_conf(self):
        return self.conf

    def get_len_state(self):
        return 4 + len(self.edges)

    def get_len_action(self):
        return len(self.edges) + 1
