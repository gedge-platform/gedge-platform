import numpy as np
from queue import Queue
from numpy.random import poisson
import logging

junho_logger = logging.getLogger('Junho')

class Task:
    def __init__(self, size, cycle):
        self.size = size
        self.cycle = cycle


class Generator:
    def __init__(self, lam: float):
        self.q = Queue()

        self.rng = np.random.default_rng()
        self.lam = lam

        junho_logger.info("Generator lambda: %f", self.lam)

    def poisson(self):
        return self.rng.poisson(self.lam)

    def gen(self):
        # TODO Generate task size and required cycle
        self.q.put(Task(10, 5))

    def get(self):
        if self.empty():
            return None
        return self.q.get()

    def empty(self):
        return self.q.empty()

    def step(self):
        for i in range(self.poisson()):
            self.gen()


if __name__ == '__main__':
    gen = Generator(1.0)
