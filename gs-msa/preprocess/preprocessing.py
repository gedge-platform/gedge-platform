"""
Yolov4 Microservice Preprocess
"""

from flask import *
from threading import Thread
import utils
import Yolo_define as yDefine
import os
import uuid
import numpy as np
import time
import shutil

count = 1

app = Flask(__name__, template_folder='./templates', static_folder='static')
shutil.move('/app/icon.png', '/app/static/icon.png')
shutil.move('/app/mainPic.png', '/app/static/mainPic.png')

upload_folder = os.environ['MOUNT_PATH']
app.config['UPLOAD_FOLDER'] = upload_folder
mongo, log = utils.initialize()

# mongo.delete_item_many({}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

@app.route('/')
def upload():
    return render_template("file_upload_form.html")

@app.route('/clean_db')
def delete_mongo():
    mongo.delete_item_many({}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
    return render_template("clean_db.html")

@app.route('/insert_request', methods=['POST'])
def uploaded():
    if request.method == 'POST':
        file = request.files['FileUpload']
        sys_uuid = str(uuid.uuid1())
        file_save_path = os.path.join(upload_folder, sys_uuid + '_' + file.filename[:-4])
        utils.make_directory(file_save_path)
        file.save(os.path.join(file_save_path, sys_uuid + '_' + file.filename))

        tempfile = {
            'Number': count,
            'Name': file.filename,
            'Uuid': sys_uuid,
            'Path': file_save_path,
            'Type': file.filename[-3:],
            'Status': "ENQUEUE",
            'Start_Time': np.nan,
            'End_Time': np.nan,
            'Iterate': 0
        }

        mongo.insert_item_one(tempfile, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        return render_template("insert_request.html", name=file.filename)


@app.route('/work_list')
def work_list_mongo():
    results_wl = mongo.find_item({}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
    return render_template('work_list.html', work_list = results_wl)


@app.route('/fin_list')
def fin_list_mongo():
    results_fl = mongo.find_item({"Status": "FIN"}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
    temp_list = []
    for i in results_fl:
        mp4_name = '/postprocess_output.mp4'
        temp_list.append(i['Uuid'] + '_' + i['Name'][:-4] + mp4_name)

    return render_template('fin_list.html', path_list= temp_list)



def preprocess_thread():
    while True:
        result = mongo.find_item_one({ "Status": "ENQUEUE"}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        if not result:
            time.sleep(5)
            continue

        mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'Status': yDefine.LIFE_CYCLE_PREPROCESSING}},
                              yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

        if result['Iterate'] > 0:
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

        emptydir_prefix = "/app/htdocs"
        file_path = result['Path'] + "/" + result['Uuid'] + '_' + result['Name']

        # result_file_path = os.path.join(result['Path'], result['Uuid'] + '_' + result['Name'][:-4])
        # utils.make_directory(result_file_path)
        log.logger.info('\n\n | ' + result['Uuid'] + ' Result folder made.')

        log.logger.info(' | ' + result['Uuid'] + ' Preprocessing. . . .')
        command = "./preprocessing " + file_path + ' ' + emptydir_prefix

        start, end, sec, preprocessing_result = utils.performance_estimation(command)

        if preprocessing_result == 0:
            log.logger.info(
                ' | ' + result['Uuid'] + ' Preprocessing succeed, Performance time : ' + str(sec))

            shutil.make_archive('./preprocess_output', 'zip', emptydir_prefix)
            nfs_zip_path = os.path.join(result['Path'], 'preprocess_output.zip')
            shutil.move('./preprocess_output.zip', nfs_zip_path)
            utils.delete_all_files(emptydir_prefix)

            mongo.update_item_one({"Uuid": result['Uuid']},
                                  {"$set": {'Status': yDefine.LIFE_CYCLE_PREPROCESSING_COMPLETE}}, yDefine.DB_NAME,
                                  yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']},
                                  {"$set": {"Start_Time": start.strftime('%Y-%m-%d %H:%M:%S')}}, yDefine.DB_NAME,
                                  yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'End_Time': end.strftime('%Y-%m-%d %H:%M:%S')}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']}, {'$set': {'Itereate': 0}}, yDefine.DB_NAME,
                                  yDefine.YOLO_COLLECTION_NAME)
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

            # shutil.unpack_archive(nfs_zip_path, result_file_path, 'zip')
            # os.remove(nfs_zip_path)

            log.logger.info(' | ' + result['Uuid'] + ' DB Updated.')

        else:
            log.logger.warning('\n\n | ' + ' Preprocessing Failed.')
            utils.delete_all_files(emptydir_prefix)

            log.logger.info(' | ' + result['Uuid'] + 'Files was removed.')

            if result['Iterate'] >= yDefine.FAIL_COUNT:
                mongo.update_item_one({"Uuid": result['Uuid']}, {"$set":{'Status': yDefine.LIFE_CYCLE_EXIT}},
                                      yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
                log.logger.error(' | ' + result['Uuid'] + 'The trial exceeded max iteration. Process stopped.')
                continue

            mongo.update_item_one({"Uuid": result['Uuid']}, {"$set":{'Iterate': result['Iterate']+1}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {"Status": yDefine.LIFE_CYCLE_ENQUEUE}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)


if __name__ == '__main__':
    th1 = Thread(target=preprocess_thread)
    th1.start()
    app.run(host='0.0.0.0', port=5000, threaded=True)
