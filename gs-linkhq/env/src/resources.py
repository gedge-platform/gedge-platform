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


class Edge:
    def __init__(self, name: str, cpu_frequency: float = 1.0):
        self.name = name
        self.cpu = CPU(cpu_frequency)
        self.task_list = []

    def get_cpu_frequency(self):
        return self.cpu.get_frequency()

    def get_queue(self):
        return self.cpu.get_queue()

    def reset(self):
        self.cpu.reset()

    def state(self):
        ret = {}
        ret['name'] = self.name
        ret['frequency'] = self.get_cpu_frequency()
        ret['queue'] = self.get_queue()

        return ret

    def assign(self, task):
        return self.cpu.assign(task)

    def update(self, dt):
        return self.cpu.update(dt)


class Task:
    def __init__(self, task_id, size, cycle):
        self.task_id = task_id
        self.size = size
        self.cycle = cycle

    def step(self, freq):
        self.cycle -= freq
