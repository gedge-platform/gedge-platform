from . import static_value

from logging.handlers import RotatingFileHandler
import logging, inspect, os

class LogManager:
    def __init__(self):
        logger = logging.getLogger("api-server")
        logger.setLevel(logging.DEBUG)

        handler = RotatingFileHandler(
            static_value.LOG_FILE, maxBytes = 5 * 1024 * 1024, backupCount=5
        )

        handler.setFormatter(
            logging.Formatter(
                "[%(asctime)s][%(levelname)s] %(message)s"
            )
        )

        logger.addHandler(handler)
        self.logger = logger

    def debug(self, contents):
        frame = inspect.currentframe()
        frame_info = inspect.getframeinfo(frame.f_back)
        file_name = frame_info.filename
        file_path = os.path.abspath(file_name)
        index = file_name.find('api-server')
        line_number = frame_info.lineno
        self.logger.debug(
            'File \"' + str(file_path + '\", line '+ str(line_number))+
            ', in ' + str(frame_info.function)+' \debug : ' + str(contents)
        )
    
    def error(self, contents):
        frame = inspect.currentframe()
        frame_info = inspect.getframeinfo(frame.f_back)
        file_name = frame_info.filename
        file_path = os.path.abspath(file_name)
        index = file_name.find('api-server')
        line_number = frame_info.lineno
        self.logger.error(
            'File \"' + str(file_path + '\", line '+ str(line_number))+
            ', in ' + str(frame_info.function)+' \error : ' + str(contents)
        )