import Yolo_define as yDefine
from Yolo_mongo import DBHandler
from Yolo_log import CustomLog
import os
import datetime


def make_directory(path):
    if not os.path.isdir(path):
        os.makedirs(path)


def delete_all_files(path):
    if os.path.exists(path):
        for file in os.scandir(path):
            os.remove(file.path)


def create_log(log_filename):
    filename = log_filename
    log = CustomLog(filename[:-4], filename, 'a')
    return log


def create_mongo():
    mongo = DBHandler()
    return mongo


def initialize():
    mongo = create_mongo()
    log = create_log(os.environ['LOG_FILE'])
    return mongo, log


def performance_estimation(command):
    start = datetime.datetime.now()
    result = os.system(command)
    end = datetime.datetime.now()
    sec = (end - start)
    return start, end, str(sec), result


def db_logging(mongo, log, db_name, col_name):
    cur_db_file_list = mongo.find_item(None, db_name, col_name)
    log.logger.info('\n\n | ' + "=== Current DB status ===")
    for i in cur_db_file_list:
        log.logger.info(' | ' + str(i))


