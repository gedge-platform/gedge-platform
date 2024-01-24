import utils
import Yolo_define as yDefine
import os
import uuid
import time
import shutil

upload_folder = os.environ['MOUNT_PATH']
mongo, log = utils.initialize()

def inference_thread():
    while True:
        result = mongo.find_item_one({"Status": yDefine.LIFE_CYCLE_PREPROCESSING_COMPLETE}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        if not result:
            time.sleep(5)
            continue


        mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'Status': yDefine.LIFE_CYCLE_INFERENCING}}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

        if result['Iterate'] > 0:
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

        
        emptydir_prefix = '/app/htdocs'
        image_file_path = os.path.join(result['Path'], 'preprocess_output.zip')

        if not os.path.isfile(image_file_path):
            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Status': yDefine.LIFE_CYCLE_ENQUEUE}}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            log.logger.error(' | ' + result['Uuid'] + ' There is no preprocess_output.zip file.')
            continue

        utils.make_directory(emptydir_prefix + '/_images')
        utils.make_directory(emptydir_prefix + '/_txts')
        shutil.unpack_archive(image_file_path, emptydir_prefix + '/_images', 'zip')
        
        log.logger.info('\n\n | ' + result['Uuid'] + ' Result folder made.')

        file_count = len(os.listdir(emptydir_prefix + "/_images"))

        command = "./darknet detector test ./coco/coco.data ./coco/yolov4_custom.cfg ./coco/yolov4.weights " + emptydir_prefix + "/ " + str(file_count)
        log.logger.info(' | ' + result['Uuid'] + ' Inferencing. . . .')

        start, end, sec, inference_result = utils.performance_estimation(command)


        if inference_result == 0 or inference_result == 2:

            shutil.make_archive('./inference_output', 'zip', emptydir_prefix+'/_txts')
            nfs_zip_path = os.path.join(result['Path'], 'inference_output.zip')
            shutil.move('./inference_output.zip', nfs_zip_path)
            utils.delete_all_files(emptydir_prefix + '/_images')
            utils.delete_all_files(emptydir_prefix + '/_txts')

            log.logger.info(' | ' + result['Uuid'] + ' Inferencing succeed, Performance time : ' + str(sec))
            mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'Start_Time': start.strftime('%Y-%m-%d %H:%M:%S')}},yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

            mongo.update_item_one({"Uuid" :result['Uuid']}, {"$set": {'Status': yDefine.LIFE_CYCLE_INFERENCING_COMPLETE}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'End_Time': end.strftime('%Y-%m-%d %H:%M:%S')}},
                         yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result['Uuid']}, {'$set': {'Iterate': 0}}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            log.logger.info(' | ' + result['Uuid'] + ' DB Updated.')

        else:
            utils.delete_all_files(emptydir_prefix + '/_txts')

            log.logger.info('\n\n | ' + result['Uuid'] + ' files was removed.')

            if result['Iterate'] >= yDefine.FAIL_COUNT:
                mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Status': yDefine.LIFE_CYCLE_EXIT}},
                                      yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
                log.logger.error(' | ' + result['Uuid'] + ' The trial exceeded max iteration. Process stopped.')
                continue

            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Iterate': result['Iterate']+1}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set": {"Status": yDefine.LIFE_CYCLE_PREPROCESSING_COMPLETE}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)



if __name__ == '__main__':
    inference_thread()
