import logging
import datetime

class CustomLog :
    def __init__(self, name, file_name, mode):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        self.File_handler = logging.FileHandler(file_name, mode=mode)
        self.formatter = logging.Formatter(
            "%(asctime)s:%(levelname)s [%(filename)s:%(lineno)d-%(funcName)s] %(message)s")
        self.File_handler.setFormatter(self.formatter)
        self.logger.addHandler(self.File_handler)
