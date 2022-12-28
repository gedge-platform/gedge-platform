class Trainer:
    def __init__(self, agent, envpath):
        self.agent = agent
        self.envpath = envpath

        print("Device: ", self.agent.device())

    def step(self):
        self.env


