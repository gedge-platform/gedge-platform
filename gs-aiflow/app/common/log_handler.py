import os
import datetime
import re
from logging.handlers import BaseRotatingHandler


class DailyRotatingFileHandler(BaseRotatingHandler):
    def __init__(self, basefilename, interval=1, backupCount=0, encoding=None, delay=False):
        basefilename = os.fspath(basefilename)
        basefilename = os.path.abspath(basefilename)
        filename, ext = os.path.splitext(basefilename)
        super().__init__(basefilename, 'a', encoding, delay)

        self.interval = 60 * 60 * 24  # one day
        self.interval = self.interval * interval  # multiply by units requested
        self.backupCount = backupCount

        self.suffix = '%Y%m%d'
        dirname, f_name = os.path.split(filename)
        self.extMatch = f"^{f_name}.\\d{{8}}{ext}$"
        self.extMatch = re.compile(self.extMatch, re.ASCII)

        self.last_rollover_date = (datetime.datetime.now()-datetime.timedelta(days=1)).date()

    def _get_filename(self):

        filename, ext = os.path.splitext(self.baseFilename)
        return f'{filename}.{datetime.datetime.now().strftime("%Y%m%d")}{ext}'

    def _open(self):
        """
        Open the current base file with the (original) mode and encoding.
        Return the resulting stream.
        """
        return open(self._get_filename(), self.mode, encoding=self.encoding)

    def getFilesToDelete(self):
        """
        Determine the files to delete when rolling over.

        More specific than the earlier method, which just used glob.glob().
        """
        dirName, baseName = os.path.split(self.baseFilename)
        fileNames = os.listdir(dirName)
        result = []
        current_file = self._get_filename()
        already_created = True if os.path.exists(current_file) else False
        for fileName in fileNames:
            if self.extMatch.match(fileName):
                result.append(os.path.join(dirName, fileName))
        if len(result) < self.backupCount:
            result = []
        else:
            reserve = 0 if already_created else 1
            result.sort()
            result = result[:len(result) - self.backupCount + reserve]
        return result

    def shouldRollover(self, record):
        """
        Determine if rollover should occur.

        record is not used, as we are just comparing times, but it is needed so
        the method signatures are the same
        """
        t = datetime.datetime.now()
        if t.date() != self.last_rollover_date:
            return 1
        return 0

    def doRollover(self):
        """
        do a rollover; in this case, a date/time stamp is appended to the filename
        when the rollover happens.  However, you want the file to be named for the
        start of the interval, not the current time.  If there is a backup count,
        then we have to get a list of matching filenames, sort them and remove
        the one with the oldest suffix.
        """
        if self.stream:
            self.stream.close()
            self.stream = None
        # get the time that this sequence started at and make it a TimeTuple
        if self.backupCount > 0:
            for s in self.getFilesToDelete():
                os.remove(s)
        if not self.delay:
            self.stream = self._open()

        self.last_rollover_date = datetime.datetime.now().date()
