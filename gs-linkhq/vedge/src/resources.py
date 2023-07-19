class Task:
    def __init__(self, id, req_edge, cpu, memory, gpu, deadline):
        self.id = id
        self.req_edge = req_edge
        self.resources = {'cpu': cpu,
                          'memory': memory,
                          'gpu': gpu,
                         }
        self.deadline = deadline


class Resource:
    def __init__(self, total):
        self.total = total
        self.reset()

    def state(self):
        return self.available
    
    def assign(self, req):
        if self.available < req:
            return False

        self.available = round(self.available - req, 8)

        return True
    
    def free(self, req):
        self.available = round(self.available + req, 8)
        
        return True

    def reset(self):
        self.available = self.total

    # def update(self, dt):
    #     # FIXME[X] Change update function
    #     for i in range(len(self.q)):
    #         new_ts = self.q[i] - dt

    #         if new_ts <= 0:
    #             new_ts = 0

    #         self.q[i] = new_ts


class Edge:
    def __init__(self, name, num_cpu, memory_size, num_gpu):
        self.name = name
        self.resources = {'cpu': Resource(num_cpu),
                          'memory': Resource(memory_size),
                          'gpu': Resource(num_gpu),
                         }
        self.task_list = []

    def reset(self):
        for r in self.resources.values():
            r.reset()
        self.task_list = []
        return self.state

    def state(self):
        ret = {}
        ret['name'] = self.name
        for k, v in self.resources.items():
            ret[k] = v.state()

        return ret

    def assign(self, task: Task):
        for k, v in task.resources.items():
            if self.resources[k].state() < v:
                return False
        
        for k, v in task.resources.items():
            self.resources[k].assign(v)
        
        return True


if __name__ == '__main__':
    e = Edge('name', 2, 2, 2, 2)
    print(e.state())
    print(e.assign(Task(1, 1, 2,3,2,2)))
    print(e.state())
    print(e.assign(Task(1, 1, 2,0,2,2)))
    print(e.state())
    e.reset()
    print(e.state())
