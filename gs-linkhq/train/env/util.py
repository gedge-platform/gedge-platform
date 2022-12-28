import yaml
import numpy as np


def get_conf(path):
    with open(path) as f:
        conf = yaml.load(f, Loader=yaml.FullLoader)

    return conf


class Generator:
    def __init__(self, num_edges):
        self.rng = np.random.default_rng()
        self.lam = np.random.rand()
        self.num_edges = num_edges

    def request(self):
        return self.rng.poisson(self.lam)

    def overhead(self):
        #return 1000
        return np.random.randint(1000, 10000)

    def data(self):
        #return 1000
        return np.random.randint(1000, 10000)

    def cycle(self):
        #return 100
        return np.random.randint(10000, 100000)

    def task(self):
        return [self.overhead(), self.data(), self.cycle()]


