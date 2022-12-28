'''
class CPU:
    def __init__(self, frequency):
        self.q = []
        self.frequency = frequency
        self.reset()

    def get_queue(self):
        return self.q

    def state(self):
        self.q.sort()
        result = []
        result = result + self.q

        return result

    def get_frequency(self):
        return self.frequency

    def assign(self, task):  # FIXME: list index out of range
        self.q.sort()
        if len(self.q) <= 0:
            self.q.append(0)

        if self.q[0] <= 0:
            self.q[0] = task[1] / self.frequency
        else:
            self.q[0] = self.q[0] + (task[1] / self.frequency)

        return self.q[0]

    def reset(self):
        self.q = []

    def update(self, dt):
        for i in range(len(self.q)):
            new_ts = self.q[i] - dt

            if new_ts <= 0:
                new_ts = 0

            self.q[i] = new_ts
'''


class Edge:
    def __init__(self, name: str, flops: float = 1.0):
        self.name = name
        self.flops = flops
        self.q_delay = 0

    def reset(self):
        self.q_delay = 0

    def state(self):
        return [self.q_delay]

    def assign(self, delay):
        self.q_delay = delay

    def update(self):
        self.q_delay -= 1
        if self.q_delay < 0:
            self.q_delay = 0

