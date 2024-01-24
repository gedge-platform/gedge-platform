import flask_api.global_def
from flask_api.database import get_db_connection
from flask_api.filesystem_impl import pathJoin
import os

def getRuntimePathAndImage(runtime, model):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    c = cursor.execute(
        f'select path, image_name, cuda_path, cudnn_path, nccl_path from TB_RUNTIME INNER JOIN TB_CUDA ON TB_CUDA.cudnn_version = TB_RUNTIME.cudnn_version and TB_CUDA.cuda_version = TB_RUNTIME.cuda_version where runtime_name = "{runtime}" and model = "{model}"')
    rows = cursor.fetchall()
    if rows is not None:
        if len(rows) != 0:
            return rows[0]['path'], rows[0]['image_name'], rows[0]['cuda_path'], rows[0]['cudnn_path'], rows[0]['nccl_path']
    return None, None, None, None, None


def getTensorRTPath(runtime, tensorRT):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    c = cursor.execute(
        f'select tensorrt_path from TB_TENSORRT where runtime_name = "{runtime}" and tensorrt_name = "{tensorRT}"')
    rows = cursor.fetchall()
    if rows is not None:
        if len(rows) != 0:
            return rows[0]['tensorrt_path']

def getBasicYaml(userLoginID, userName, projectName, projectID, nodeID, runtime, model, tensorRT, framework, inputPath, outputPath):
    runtimePath, imageName, cudaPath, cudnnPath, ncclPath = getRuntimePathAndImage(runtime, model)
    tensorRTPath = getTensorRTPath(runtime, tensorRT)

    if runtimePath is None or imageName is None or cudnnPath is None or cudaPath is None or tensorRTPath is None:
        return None

    data = {'apiVersion': 'v1', 'kind': 'Pod',
            'metadata': {'name': nodeID, 'labels': {'app': 'nfs-test'}},
            'spec': {'restartPolicy': 'Never', 'containers': [
                {'name': 'ubuntu', 'image': imageName, 'imagePullPolicy': 'IfNotPresent',
                 'command': ['/bin/bash', '-c'], 'args': [
                    'source /root/path.sh; PATH=' + pathJoin('/opt/conda/envs/' , runtimePath , '/bin') + ':' +
                    pathJoin('/root/volume/cuda/', cudaPath ,'/bin') + ':$PATH; env; mkdir -p /root/user/logs; cd /root/scripts; '],
                 'env': [{'name': 'LD_LIBRARY_PATH',
                          'value': pathJoin('/root/volume/cuda/', cudaPath , '/lib64') + ':' +
                                   pathJoin('/root/volume/cudnn/', cudnnPath, '/lib64') + ':' +
                                   pathJoin('/root/volume/cuda/', cudaPath, '/lib') + ':' +
                                   pathJoin('/root/volume/cudnn/', cudnnPath, '/lib') + ':' +
                                   pathJoin('/root/volume/tensorrt/', tensorRTPath, '/lib') +
                                   ((':' + pathJoin('/root/volume/nccl/', ncclPath, '/lib')) if ncclPath is not None else '') }],
                 'resources': {'limits': {'cpu': '4', 'memory': '60G', 'nvidia.com/gpu': '1'}}, 'volumeMounts': [
                    {'mountPath': pathJoin('/root/volume/cuda/', cudaPath), 'name': 'nfs-volume-total',
                     'subPath': pathJoin('cuda/', cudaPath),
                     'readOnly': True}, {'mountPath': pathJoin('/root/volume/cudnn/', cudnnPath), 'name': 'nfs-volume-total',
                                         'subPath': pathJoin('cudnn/', cudnnPath), 'readOnly': True},
                    {'mountPath': pathJoin('/opt/conda/envs/', runtimePath), 'name': 'nfs-volume-total',
                     'subPath': pathJoin('envs/', runtimePath),
                     'readOnly': True},
                    {'mountPath': pathJoin('/root/volume/tensorrt/', tensorRTPath), 'name': 'nfs-volume-total',
                     'subPath': pathJoin('tensorrt/', tensorRTPath), 'readOnly': True},
                    {'mountPath': '/root/volume/dataset', 'name': 'nfs-volume-total',
                     'subPath': 'dataset',
                     'readOnly': True},
                    {'mountPath': '/root/user', 'name': 'nfs-volume-total',
                     'subPath': pathJoin('user/', userLoginID, projectName)}]}],
                     'volumes': [
                         {'name': 'nfs-volume-total', 'persistentVolumeClaim': {'claimName': getBasicPVCName(userLoginID, projectName)}}]}}

    #add nccl
    if ncclPath is not None:
        data['spec']['containers'][0]['volumeMounts'].append({'mountPath': f'{pathJoin("root/volume/nccl/", ncclPath)}', 'name': 'nfs-volume-total',
                         'subPath': f'{pathJoin("nccl", ncclPath)}', 'readOnly': True})
    return data


def getBasicPVName(userLoginID, projectName):
    return "pv-project-" + flask_api.global_def.config.api_id + "-" + userLoginID + "-" + projectName


def getBasicPVCName(userLoginID, projectName):
    return "pvc-project-" + flask_api.global_def.config.api_id + "-" + userLoginID + "-" + projectName


def getBasicPVYaml(userLoginID, projectName):
    data = {
        "apiVersion": "v1",
        "kind": "PersistentVolume",
        "metadata": {
            "name": getBasicPVName(userLoginID, projectName),
            "labels": {
                "app": "nfs-test"
            }
        },
        "spec": {
            "capacity": {
                "storage": "10Gi"
            },
            "volumeMode": "Filesystem",
            "accessModes": [
                "ReadOnlyMany"
            ],
            "persistentVolumeReclaimPolicy": "Delete",
            "storageClassName": "",
            "nfs": {
                "path": flask_api.global_def.config.nfs_path,
                "server": flask_api.global_def.config.nfs_server
            }
        }
    }
    return data


def getBasicPVCYaml(userLoginID, projectName):
    data = {
        "apiVersion": "v1",
        "kind": "PersistentVolumeClaim",
        "metadata": {
            "name": getBasicPVCName(userLoginID, projectName),
        },
        "spec": {
            "accessModes": [
                "ReadOnlyMany"
            ],
            "volumeMode": "Filesystem",
            "storageClassName": "",
            "resources": {
                "requests": {
                    "storage": "10Gi"
                }
            },
            "volumeName": getBasicPVName(userLoginID, projectName),
            "selector": {
                "matchLabels": {
                    "app": "nfs-test"
                }
            }
        }
    }

    return data

def getBasicPodArgs(model, task, **args):
    if(model == 'yolov5'):
        if task == 'train':
            return f' --project /root/user --name {args.get("outputPath") or "no_path"} ' \
                   f'--data {pathJoin((args.get("datasetPath") or "."), "/dataset.yaml")} ' \
                   f'--device {args.get("device") or "0"} --weights {args.get("weightsPath") or "./weights/yolov5s-v7.0.pt"} ' \
                   f'--epochs {args.get("epochs") or "1"} --batch {args.get("batch") or "1"} '

        elif task == 'validation':
            return f' --project /root/user --name {args.get("outputPath") or "no_path"} ' \
                   f'--data {pathJoin((args.get("datasetPath") or "."), "/dataset.yaml")} ' \
                   f'--device {args.get("device") or "0"} --weights {args.get("modelPath") or "./weights/yolov5s-v7.0.pt"} ' \
                   f'--batch-size {args.get("batch") or "1"} '

        elif task == 'optimization':
            return f' --weights {args.get("modelPath") or "./weights/yolov5s-v7.0.pt"} ' \
                   f'--include engine --device {args.get("device") or "0"} --half ' \
                   f'--batch-size {args.get("batch") or "1"} --imgsz {args.get("imgSize") or "640"} --verbose '

        elif task == 'opt_validation':
            return f' --project /root/user --name {args.get("outputPath") or "no_path"} ' \
                   f'--weights {args.get("weightsPath") or "./weights/yolov5s-v7.0.pt"} ' \
                   f'--data {pathJoin((args.get("datasetPath") or "."), "/dataset.yaml")} ' \
                   f'--device {args.get("device") or "0"} --batch-size {args.get("batch") or "1"} ' \
                   f'--imgsz {args.get("imgSize") or "640"} '
        return ''
    elif(model == 'RetinaFace'):
        if task == 'train':
            return f' --root_path {pathJoin(args.get("datasetPath") or ".")} ' \
                   f'--dataset_path {pathJoin(args.get("datasetPath") or "/root/volume/dataset", "wider")} ' \
                   f'--pretrained {args.get("weightsPath") or "model/resnet-50"}  --pretrained_epoch 0 --prefix {args.get("outputPath") or "model/retinaface"} ' \
                   f'--end_epoch {args.get("epochs") or "1"} '

        elif task == 'validation':
            return (f' --prefix {args.get("modelPath") or "./model/R50"} '
                    f'--epoch {args.get("epoch") or "0"} '
                    f'--dataset-path {pathJoin(args.get("datasetPath") or "/root/volume/dataset", "wider")} '
                    f'--root_path . ')

        elif task == 'optimization':
            return f' --symbol {(args.get("modelPath") or "./model/R50-symbol.json")} ' \
                   f'--params {(args.get("modelPath") or "./model/R50-0000.params")} ' \
                   f'-b {args.get("batch") or "1"} '

        elif task == 'opt_validation':
            return (f' --input {args.get("modelPath") or "./model/R50-640p-fp16.engine"} '
                    f'--dataset-path {pathJoin(args.get("datasetPath") or "/root/volume/dataset", "wider")} '
                    f'--root_path . '
                    f'--output {args.get("outputPath") or "./wout"} ')
        return ''

    return ''

def makeYamlTrainRuntime(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, outputPath):
    data = getBasicYaml(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, outputPath)
    if data is None:
        return None
    data['spec']['containers'][0]['args'][0] += 'rm -rf ' + pathJoin('/root/user/', (outputPath or 'no_path')) \
                                                + '; ./bin/train.sh'

    data['spec']['containers'][0]['args'][0] += getBasicPodArgs(model, 'train', outputPath=outputPath, datasetPath=datasetPath)
    # data['spec']['containers'][0]['args'][0] += ' &>> /root/user/logs/' + node_id + '.log'
    return data

def makeYamlValidateRuntime(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, modelPath, outputPath):
    data = getBasicYaml(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, outputPath)
    if data is None:
        return None
    data['spec']['containers'][0]['args'][0] += 'rm -rf ' + pathJoin('/root/user/', (outputPath or 'no_path')) \
                                                + '; ./bin/validation.sh '
    data['spec']['containers'][0]['args'][0] += getBasicPodArgs(model, 'validation', outputPath=outputPath, datasetPath=datasetPath, modelPath=modelPath)
    # data['spec']['containers'][0]['args'][0] += ' &>> /root/user/logs/' + node_id + '.log'

    return data
def makeYamlOptimizationRuntime(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, modelPath):
    data = getBasicYaml(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, modelPath, modelPath)
    if data is None:
        return None
    data['spec']['containers'][0]['args'][0] += './bin/optimization.sh '
    data['spec']['containers'][0]['args'][0] += getBasicPodArgs(model, 'optimization', modelPath=modelPath)
    # data['spec']['containers'][0]['args'][0] += ' &>> /root/user/logs/' + node_id + '.log'
    return data

def makeYamlOptValidateRuntime(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, modelPath, outputPath):
    data = getBasicYaml(userLoginID, userName, projectName, projectID, node_id, runtime, model, tensorRT, framework, datasetPath, outputPath)
    if data is None:
        return None
    data['spec']['containers'][0]['args'][0] += 'rm -rf ' + pathJoin('/root/user/', (outputPath or 'no_path')) \
                                                + '; ./bin/opt_validation.sh '
    data['spec']['containers'][0]['args'][0] += getBasicPodArgs(model, 'opt_validation', outputPath= outputPath, datasetPath=datasetPath, modelPath=modelPath)
    # data['spec']['containers'][0]['args'][0] += ' &>> /root/user/logs/' + node_id + '.log'

    return data


def getProjectYaml(userLoginID, projectName):
    yaml = {'PV': {}, 'PVC': {}}
    yaml['PV'] = getBasicPVYaml(userLoginID, projectName)
    yaml['PVC'] = getBasicPVCYaml(userLoginID, projectName)

    return yaml


def makeYamlInferenceRuntime(userLoginID, userName, projectName, projectID, nodeID, runtime, model, tensorRT, framework):
    runtimePath, imageName, cudaPath, cudnnPath, ncclPath = getRuntimePathAndImage(runtime, model)
    tensorRTPath = getTensorRTPath(runtime, tensorRT)

    appLabel = 'yolo-test'
    if(model == 'yolov5'):
        appLabel = 'yolo-test'
        imageName = 'softonnet/yolov5/inference_test:v0.0.1.230616'
    elif(model == 'RetinaFace'):
        appLabel = 'retina-test'
        imageName = 'softonnet/retinaface/inference_test:v0.0.1.230616'
    data = {'apiVersion': 'v1', 'kind': 'Pod',
            'metadata': {'name': nodeID, 'labels': {'app': appLabel}},
            'spec': {'restartPolicy': 'Never', 'containers': [
                {'name': 'ubuntu', 'image': imageName, 'imagePullPolicy': 'IfNotPresent',
                 'command': ['/bin/bash', '-c'], 'args': [
                    'source /root/path.sh; PATH=/opt/conda/envs/' + runtimePath + '/bin:/root/volume/cuda/' + cudaPath + '/bin:$PATH; env; sh /script.sh;tail -f /dev/null'],
                 'env': [{'name': 'LD_LIBRARY_PATH',
                          'value': '/root/volume/cuda/' + cudaPath + '/lib64:/root/volume/cudnn/' + cudnnPath + '/lib64:/root/volume/tensorrt/' + tensorRTPath + '/lib'}],
                 'resources': {'limits': {'cpu': '4', 'memory': '8G', 'nvidia.com/gpu': '1'}}, 'volumeMounts': [
                    {'mountPath': '/root/volume/cuda/' + cudaPath, 'name': 'nfs-volume-total',
                     'subPath': 'cuda/' + cudaPath,
                     'readOnly': True}, {'mountPath': '/root/volume/cudnn/' + cudnnPath, 'name': 'nfs-volume-total',
                                         'subPath': 'cudnn/' + cudnnPath, 'readOnly': True},
                    {'mountPath': '/opt/conda/envs/' + runtimePath, 'name': 'nfs-volume-total',
                     'subPath': 'envs/' + runtimePath,
                     'readOnly': True},
                    {'mountPath': '/root/volume/tensorrt/' + tensorRTPath + '/', 'name': 'nfs-volume-total',
                     'subPath': 'tensorrt/' + tensorRTPath, 'readOnly': True},
                    {'mountPath': '/root/volume/dataset/coco128', 'name': 'nfs-volume-total',
                     'subPath': 'dataset/coco128',
                     'readOnly': True},
                    {'mountPath': '/root/user', 'name': 'nfs-volume-total',
                     'subPath': 'user/' + userLoginID + "/" + projectName}]}],
                     'volumes': [
                         {'name': 'nfs-volume-total',
                          'persistentVolumeClaim': {'claimName': getBasicPVCName(userLoginID, projectName)}}]}}

    if model == 'RetinaFace':
        data = {'apiVersion': 'v1', 'kind': 'Pod',
                'metadata': {'name': nodeID, 'labels': {'app': appLabel}},
                'spec': {'restartPolicy': 'Never', 'containers': [
                    {'name': 'ubuntu', 'image': imageName, 'imagePullPolicy': 'IfNotPresent',
                     'command': ['/bin/bash', '-c'], 'args': [
                        'source /root/path.sh; PATH=/opt/conda/envs/' + runtimePath + '/bin:/root/volume/cuda/' + cudaPath + '/bin:$PATH; env; sh /script.sh;tail -f /dev/null'],
                     'env': [{'name': 'LD_LIBRARY_PATH',
                              'value': '/root/volume/cuda/' + cudaPath + '/lib64:/root/volume/cudnn/' + cudnnPath + '/lib:/root/volume/tensorrt/' + tensorRTPath + '/lib:/root/volume/nccl/nccl_2.17.1-1+cuda11.0_x86_64/lib'}],
                     'resources': {'limits': {'cpu': '4', 'memory': '8G', 'nvidia.com/gpu': '1'}}, 'volumeMounts': [
                        {'mountPath': '/root/volume/cuda/' + cudaPath, 'name': 'nfs-volume-total',
                         'subPath': 'cuda/' + cudaPath,
                         'readOnly': True}, {'mountPath': '/root/volume/cudnn/' + cudnnPath, 'name': 'nfs-volume-total',
                                             'subPath': 'cudnn/' + cudnnPath, 'readOnly': True},
                        {'mountPath': '/opt/conda/envs/' + runtimePath, 'name': 'nfs-volume-total',
                         'subPath': 'envs/' + runtimePath,
                         'readOnly': True},
                        {'mountPath': '/root/volume/tensorrt/' + tensorRTPath + '/', 'name': 'nfs-volume-total',
                         'subPath': 'tensorrt/' + tensorRTPath, 'readOnly': True},
                        {'mountPath': '/root/volume/nccl/nccl_2.17.1-1+cuda11.0_x86_64', 'name': 'nfs-volume-total',
                         'subPath': 'nccl/nccl_2.17.1-1+cuda11.0_x86_64', 'readOnly': True},
                        {'mountPath': '/root/volume/dataset/retinaface', 'name': 'nfs-volume-total',
                         'subPath': 'dataset/retinaface',
                         'readOnly': True},
                        {'mountPath': '/root/user', 'name': 'nfs-volume-total',
                         'subPath': 'user/' + userLoginID + "/" + projectName}]}],
                         'volumes': [
                             {'name': 'nfs-volume-total',
                              'persistentVolumeClaim': {'claimName': getBasicPVCName(userLoginID, projectName)}}]}}


    return data

def getUserJupyterNodeportName(loginID):
    return 'np-' + flask_api.global_def.config.api_id + '-' + loginID

def getUserJupyterLabelName(loginID):
    return 'jupyter-' + flask_api.global_def.config.api_id + '-' + loginID

def getUserJupyterPVName(loginID):
    return 'pv-user-' + flask_api.global_def.config.api_id + '-' + loginID

def getUserJupyterPVCName(loginID):
    return 'pvc-user-' + flask_api.global_def.config.api_id + '-' + loginID



def makeUserJupyterNodeportYaml(loginID):
    return {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": getUserJupyterNodeportName(loginID),
            "namespace": flask_api.global_def.config.system_namespace
        },
        "spec": {
            "type": "NodePort",
            "ports": [
                {
                    "port": 8888,
                    "targetPort": 8888,
                    "name": "jupyter"
                }
            ],
            "selector": {
                "app": getUserJupyterLabelName(loginID)
            }
        }
    }

# def makeUserJupyterNodeportYaml(loginID, passwd):
def makeUserJupyterPVYaml(loginID):
    data = {
        "apiVersion": "v1",
        "kind": "PersistentVolume",
        "metadata": {
            "name": getUserJupyterPVName(loginID),
            "labels": {
                "type": "local"
            }
        },
        "spec": {
            "storageClassName": "",
            "persistentVolumeReclaimPolicy": "Retain",
            "capacity": {
                "storage": "20Gi"
            },
            "accessModes": [
                "ReadWriteMany"
            ],
            "nfs": {
                "path": pathJoin(flask_api.global_def.config.nfs_path, "/user/", loginID),
                "server": flask_api.global_def.config.nfs_server
            }
        }
    }
    return data

def makeUserJupyterPVCYaml(loginID):
    data = {
          "apiVersion": "v1",
          "kind": "PersistentVolumeClaim",
          "metadata": {
            "name": getUserJupyterPVCName(loginID),
            "namespace": flask_api.global_def.config.system_namespace
          },
          "spec": {
            "accessModes": [
              "ReadWriteMany"
            ],
            "volumeMode": "Filesystem",
            "storageClassName": "",
            "resources": {
              "requests": {
                "storage": "10Gi"
              }
            },
            "volumeName": getUserJupyterPVName(loginID),
            "selector": {
              "matchLabels": {
                "app": getUserJupyterLabelName(loginID)
              }
            }
          }
    }
    return data

def makeUserJupyterPodYaml(loginID, jupyterPW):
    data = {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "name": getUserJupyterLabelName(loginID),
        "namespace": flask_api.global_def.config.system_namespace,
        "labels": {
          "app": getUserJupyterLabelName(loginID)
        }
      },
      "spec": {
        "containers": [
          {
            "image": "jupyter/base-notebook",
            "command": [
              "sh",
              "-c",
              "start-notebook.sh --NotebookApp.allow_origin=* --NotebookApp.password=" + jupyterPW + " --ip=0.0.0.0 --NotebookApp.base_url=/storage/" + loginID
            ],
            "name": "jupyter",
            "volumeMounts": [
              {
                "name": "user-nfs-volume",
                "mountPath": "/home/jovyan"
              }
            ],
            "ports": [
              {
                "containerPort": 8888,
                "protocol": "TCP"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "user-nfs-volume",
            "persistentVolumeClaim": {
              "claimName": getUserJupyterPVCName(loginID)
            }
          }
        ]
      }
    }
    return data