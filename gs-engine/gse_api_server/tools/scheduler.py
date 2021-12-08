# _*_ coding:utf-8 _*_

from apscheduler.jobstores.base import JobLookupError
from apscheduler.schedulers.background import BackgroundScheduler

class Scheduler:
    def __init__(self):
        self.sched = BackgroundScheduler()
        self.sched.start()
        self.job_id = ''

    def __del__(self):
        self.shutdown()

    def shutdown(self):
        self.sched.shutdown()

    def add_schdule(self, job, trigger, job_id, args=None, seconds=None, minutes=None, hours=None, day=None,
                    day_of_week=None):
        if trigger == 'interval':
            self.sched.add_job(job, trigger=trigger, id=job_id, args=args, seconds=int(seconds))
        elif trigger == 'cron':
            self.sched.add_job(job, type, id=job_id, args=args,
                               second=seconds, minute=minutes, hour=hours, day=day, day_of_week=day_of_week)
            self.sched.get_job().modify()
