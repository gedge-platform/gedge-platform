import utils
import Yolo_define as yDefine
import os
import uuid
import time
import shutil

upload_folder = os.environ['MOUNT_PATH']
mongo, log = utils.initialize()

def postprocessing_thread():
    while True:
        result = mongo.find_item_one({ "Status": "INFERENCING_COMPLETE"}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        if not result:
            time.sleep(5)
            continue

        mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'Status': yDefine.LIFE_CYCLE_POSTPROCESSING}},
                              yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
        utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)


        if result['Iterate'] > 0:
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

        emptydir_prefix = '/app/htdocs'
        image_file_path = os.path.join(result['Path'], 'preprocess_output.zip')
        txt_file_path = os.path.join(result['Path'], 'inference_output.zip')

        if not os.path.isfile(image_file_path):
            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Status': yDefine.LIFE_CYCLE_ENQUEUE}}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            log.logger.error(' | ' + result['Uuid'] + ' There is no preprocess_output.zip file.')
            continue

        if not os.path.isfile(txt_file_path):
            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Status': yDefine.LIFE_CYCLE_PREPROCESSING_COMPLETE}}, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            log.logger.error(' | ' + result['Uuid'] + ' There is no inference_output.zip file.')
            continue

        utils.make_directory(emptydir_prefix + '/images')
        utils.make_directory(emptydir_prefix + '/txts')
        shutil.unpack_archive(image_file_path, emptydir_prefix + '/images', 'zip')
        shutil.unpack_archive(txt_file_path, emptydir_prefix + '/txts', 'zip')

        log.logger.info('\n\n | ' + result['Uuid'] + ' Result folder made.')

        file_count = len(os.listdir(emptydir_prefix + "/images"))

        command = "./postprocessing " + emptydir_prefix + " postprocess " + str(file_count)
        # print(os.system(command))
        log.logger.info(' | ' + result['Uuid'] + ' Postprocessing. . . . ')

        start, end, sec, postprocess_result = utils.performance_estimation(command)

        if postprocess_result == 0:
            log.logger.info(' | ' + result['Uuid'] + ' Postprocessing succeed, Performance time : ' + str(sec))

            utils.delete_all_files(emptydir_prefix + '/images')
            utils.delete_all_files(emptydir_prefix + '/txts')
            nfs_avi_name = 'postprocess_output.mp4'
            nfs_avi_path = os.path.join(result['Path'], nfs_avi_name)
            shutil.move(emptydir_prefix + '/postprocess_output.mp4', nfs_avi_path)
            #static_avi_path = os.path.join('/app/static/' + nfs_avi_name)
            #shutil.copy(nfs_avi_path, static_avi_path)

            mongo.update_item_one({'Uuid': result['Uuid']}, {"$set": {'Status':yDefine.LIFE_CYCLE_FINISHED}},yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            log.logger.info(' | ' + result['Uuid'] + ' DB Updated.')
            #mongo.insert_item_one(result, yDefine.DB_NAME2, yDefine.YOLO_COLLECTION_NAME2)
            #mongo.delete_item_one(result, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

            #mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'Start_Time': start.strftime('%Y-%m-%d %H:%M:%S')}},yDefine.DB_NAME2, yDefine.YOLO_COLLECTION_NAME2)
            #mongo.update_item_one({"Uuid": result['Uuid']}, {"$set": {'End_Time': end.strftime('%Y-%m-%d %H:%M:%S')}},yDefine.DB_NAME2, yDefine.YOLO_COLLECTION_NAME2)
            #mongo.update_item_one({"Uuid": result['Uuid']}, {'$set': {'Iterate': 0}},yDefine.DB_NAME2, yDefine.YOLO_COLLECTION_NAME2)
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)

            #log.logger.info(' | ' + result['Uuid'] + ' Fin_DB Updated.')
            #utils.db_logging(mongo, log, yDefine.DB_NAME2, yDefine.YOLO_COLLECTION_NAME2)

        else:
            utils.delete_all_files(emptydir_prefix + '/txts')
            utils.delete_all_files(emptydir_prefix + '/images')

            if result['Iterate'] >= yDefine.FAIL_COUNT:
                mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Status': yDefine.LIFE_CYCLE_EXIT}},
                                      yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
                log.logger.ERROR(' | ' + result['Uuid'] + ' The trial exceeded max iteration. Process stopped.')
                break

            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set":{'Iterate': result['Iterate']+1}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            mongo.update_item_one({"Uuid": result["Uuid"]}, {"$set": {"Status": yDefine.LIFE_CYCLE_INFERENCING_COMPLETE}},
                                  yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)
            utils.db_logging(mongo, log, yDefine.DB_NAME, yDefine.YOLO_COLLECTION_NAME)


if __name__ == '__main__':
    postprocessing_thread()

