import numpy as np
from queue import Queue
from numpy.random import poisson
import logging

junho_logger = logging.getLogger('Junho')

class Task:
    def __init__(self, req_edge, cpu, memory, disk, gpu, deadline, ttl):
        self.id = None
        self.req_edge = req_edge
        self.resources = {'cpu': cpu,
                          'memory': memory,
                          'disk': disk,
                          'gpu': gpu
                         }
        self.deadline = deadline
        self.ttl = ttl

    def __str__(self) -> str:
        return 'req_edge: {}, cpu: {}, memory: {}, disk: {}, gpu: {}, deadline: {}, ttl: {}'.format(self.req_edge, self.cpu, self.memory, self.disk, self.gpu, self.deadline, self.ttl)


class Generator:
    def __init__(self, num_edges: int, lam: float):
        self.num_edges = num_edges

        self.q = Queue()

        self.rng = np.random.default_rng()
        self.lam = lam

    def poisson(self):
        return self.rng.poisson(self.lam)

    def gen(self):
        req_edge = np.random.randint(0, self.num_edges)
        cpu = np.random.binomial(5, 0.1)
        memory = np.random.binomial(20, 0.5)
        disk = np.random.binomial(20, 0.5)
        gpu = np.random.binomial(1, 0.01)
        deadline = np.random.binomial(1, 0.7)
        ttl = np.random.binomial(10, 0.5) * 60
        if ttl <= 0:
            ttl = 60

        task = Task(req_edge, cpu, memory, disk, gpu, deadline, ttl)
        self.q.put(task)

    def get(self):
        if self.q.empty():
            return None
        return self.q.get()

    def step(self):
        for _ in range(self.poisson()):
            self.gen()
