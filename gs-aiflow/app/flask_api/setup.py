import base64
import sys
import flask_api.global_def
import flask_api.center_client
import time

def setupToserver():
    systemNamespace = flask_api.global_def.config.system_namespace
    systemCluster = flask_api.global_def.config.system_cluster
    apiID = flask_api.global_def.config.api_id

    # make system project
    res = flask_api.center_client.projectsPost(apiID, apiID, systemNamespace, clusterName=[systemCluster])
    if res.get('status') is not None:
       if res.get('status') == 'failed':
           print('failed to make system project msg = ' + res.get('msg'))
           sys.exit(1)

    print('create system project')

    # makeNodePort
    res = flask_api.center_client.servicePost(getNodeportYaml(), apiID, systemCluster, systemNamespace )
    port = -1
    if res:
        if res.get('spec'):
            if res.get('spec').get('ports'):
                if res.get('spec').get('ports')[0].get('nodePort'):
                    port = res.get('spec').get('ports')[0].get('nodePort')


    # nodeport failed
    if port == -1:
        res = flask_api.center_client.serviceDelete(
            getNodePortName(),
            apiID,
            flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
        res = flask_api.center_client.projectsDelete(systemNamespace)
        print('failed to make nodeport')
        sys.exit(1)

    print('create nodeport')

    # second step

    # make secret
    res = flask_api.center_client.secretPost(apiID, systemCluster, systemNamespace, getSecretYaml())
    # make clusterIP
    res = flask_api.center_client.servicePost(getClusterIPYaml(), apiID, systemCluster, systemNamespace)


    # third step
    res = flask_api.center_client.pvCreate(getPVYaml(), apiID, systemCluster, systemNamespace)
    res = flask_api.center_client.pvcCreate(getPVCYaml(), apiID, systemCluster, systemNamespace)

    print('create pv, pvc')

    # forth step
    res = flask_api.center_client.deploymentPost(apiID, systemCluster, systemNamespace, getMariaDBDeplYaml())
    res = flask_api.center_client.deploymentPost(apiID, systemCluster, systemNamespace, getWebDeplYaml())

    # wait mariadb Depl
    waitingMariaDB()

    # fifth step
    res = flask_api.center_client.deploymentPost(apiID, systemCluster, systemNamespace, getBackDeplYaml())

    # wait back Depl
    waitingFlask()

    # sixth step
    res = flask_api.center_client.deploymentPost(apiID, systemCluster, systemNamespace, getNginxDeplYaml())

    print (f'aiflow port is {port}')
def waiting(func , msg : str = ''):
    print(f'waiting {msg} running for 20 seconds ...')
    count = 0
    while count < 10:
        if func() is True:
            print(f'{msg} is running! start next step')
            return True

        time.sleep(1)
        count += 1
    print(f'{msg} is not still running but start next step')
    return False
#

def checkDepl(name):
    res = flask_api.center_client.deploymentNameGet(flask_api.global_def.config.api_id,
                                                    flask_api.global_def.config.system_cluster
                                                    , flask_api.global_def.config.system_namespace,
                                                    name)
    if res.get('involvesData') is not None:
        if res.get('involvesData').get('pods') is not None:
            for item in res.get('involvesData').get('pods'):
                if item.get('status') is not None:
                    if item.get('status') == 'Running':
                        return True

    return False

def waitingMariaDB():
    def check():
        return checkDepl(getMariaDBDeplName())

    waiting(check, "MariaDB")
    return

def waitingFlask():
    def check():
        return checkDepl(getBackDeplName())

    waiting(check, "backend")
    return

def getPVName():
    return 'pv-' + flask_api.global_def.config.system_namespace

def getPVCName():
    return 'pvc-' + flask_api.global_def.config.system_namespace

def getMariaDBDeplName():
    return 'mariadb'

def getBackDeplName():
    return 'aiflow-flask'

def getBackDeplYaml():
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": getBackDeplName(),
            "labels": {
                "app": flask_api.global_def.config.system_namespace
            }
        },
        "spec": {
            "replicas": 1,
            "selector": {
                "matchLabels": {
                    "app": flask_api.global_def.config.system_namespace
                }
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": flask_api.global_def.config.system_namespace
                    }
                },
                "spec": {
                    "hostname": "back",
                    "subdomain": getClusterIPName(),
                    "containers": [
                        {
                            "name": "flask",
                            "image": flask_api.global_def.config.flask_image,
                            "volumeMounts": [
                                {
                                    "mountPath": "/shared/nfs",
                                    "name": "system-data"
                                }
                            ],
                            "env": [
                                {
                                    "name": "DB_HOST",
                                    "value": "db.aiflow-clusterip"
                                },
                                {
                                    "name": "DB_PASS",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "mariadb-secret",
                                            "key": "password"
                                        }
                                    }
                                },
                                {
                                    "name": "DB_USER",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "mariadb-secret",
                                            "key": "id"
                                        }
                                    }
                                }
                            ],
                            "ports": [
                                {
                                    "containerPort": 5500,
                                    "protocol": "TCP"
                                }
                            ]
                        }
                    ],
                    "volumes": [
                        {
                            "name": "system-data",
                            "persistentVolumeClaim": {
                                "claimName": getPVCName()
                            }
                        }
                    ]
                }
            }
        }
    }


def getWebDeplYaml():
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": "aiflow-web",
            "labels": {
                "app": flask_api.global_def.config.system_namespace
            }
        },
        "spec": {
            "replicas": 1,
            "selector": {
                "matchLabels": {
                    "app": flask_api.global_def.config.system_namespace
                }
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": flask_api.global_def.config.system_namespace
                    }
                },
                "spec": {
                    "hostname": "web",
                    "subdomain": getClusterIPName(),
                    "containers": [
                        {
                            "name": "react",
                            "image": flask_api.global_def.config.react_image,
                            "ports": [
                                {
                                    "containerPort": 3000,
                                    "protocol": "TCP"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }

def getNginxDeplYaml():
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": "nginx",
            "labels": {
                "app": getNginxSelector()
            }
        },
        "spec": {
            "selector": {
                "matchLabels": {
                    "app": getNginxSelector()
                }
            },
            "strategy": {
                "type": "Recreate"
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": getNginxSelector()
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "image": "nginx:latest",
                            "name": "nginx",
                            "ports": [
                                {
                                    "containerPort": 80,
                                    "name": "nginx"
                                }
                            ],
                            "volumeMounts": [
                                {
                                    "mountPath": "/etc/nginx/conf.d",
                                    "subPath": "system/conf.d",
                                    "name": "nginx-data"
                                }
                            ]
                        }
                    ],
                    "volumes": [
                        {
                            "name": "nginx-data",
                            "persistentVolumeClaim": {
                                "claimName": getPVCName()
                            }
                        }
                    ]
                }
            }
        }
    }

def getMariaDBDeplYaml():
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": getMariaDBDeplName(),
            "labels": {
                "app": flask_api.global_def.config.system_namespace
            }
        },
        "spec": {
            "selector": {
                "matchLabels": {
                    "app": flask_api.global_def.config.system_namespace
                }
            },
            "strategy": {
                "type": "Recreate"
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": flask_api.global_def.config.system_namespace
                    }
                },
                "spec": {
                    "securityContext": {
                        "runAsUser": 65534,
                        "fsGroup": 65534
                    },
                    "hostname": "db",
                    "subdomain": getClusterIPName(),
                    "containers": [
                        {
                            "image": "mariadb:10.7",
                            "name": "mariadb",
                            "ports": [
                                {
                                    "containerPort": 3306,
                                    "name": "mariadb"
                                }
                            ],
                            "volumeMounts": [
                                {
                                    "mountPath": "/var/lib/mysql",
                                    "subPath": "system/mysql",
                                    "name": "mairadb-data"
                                }
                            ],
                            "env": [
                                {
                                    "name": "MYSQL_HOST",
                                    "value": "%"
                                },
                                {
                                    "name": "MYSQL_ROOT_PASSWORD",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "mariadb-secret",
                                            "key": "root"
                                        }
                                    }
                                },
                                {
                                    "name": "MYSQL_USER",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "mariadb-secret",
                                            "key": "id"
                                        }
                                    }
                                },
                                {
                                    "name": "MYSQL_PASSWORD",
                                    "valueFrom": {
                                        "secretKeyRef": {
                                            "name": "mariadb-secret",
                                            "key": "password"
                                        }
                                    }
                                },
                                {
                                    "name": "MYSQL_DATABASE",
                                    "value": "aiflow"
                                }
                            ]
                        }
                    ],
                    "volumes": [
                        {
                            "name": "mairadb-data",
                            "persistentVolumeClaim": {
                                "claimName": getPVCName()
                            }
                        }
                    ]
                }
            }
        }
    }

def getPVCYaml():
    return {
        "apiVersion": "v1",
        "kind": "PersistentVolumeClaim",
        "metadata": {
            "name": getPVCName()
        },
        "spec": {
            "storageClassName": "",
            "accessModes": [
                "ReadWriteMany"
            ],
            "resources": {
                "requests": {
                    "storage": "50Gi"
                }
            },
            "volumeName": getPVName(),
            "selector": {
                "matchLabels": {
                    "app": getPVName()
                }
            }
        }
    }


def getPVYaml():
    return {
        "apiVersion": "v1",
        "kind": "PersistentVolume",
        "metadata": {
            "name": getPVName(),
            "labels": {
                "type": "local",
                "app": getPVName()
            }
        },
        "spec": {
            "storageClassName": "",
            "capacity": {"storage": "50Gi"},
            "accessModes": [
                "ReadWriteMany"
            ],
            "nfs": {
                "path": flask_api.global_def.config.nfs_path,
                "server": flask_api.global_def.config.nfs_server
            }
        }
    }


def getSecretYaml():
    return {
        "apiVersion": "v1",
        "kind": "Secret",
        "metadata": {
            "name": "mariadb-secret"
        },
        "data": {
            "root": base64.b64encode(flask_api.global_def.config.mariadb_pass.encode('UTF-8')).decode('UTF-8'),
            "id": base64.b64encode(flask_api.global_def.config.mariadb_user.encode('UTF-8')).decode('UTF-8'),
            "password": base64.b64encode(flask_api.global_def.config.mariadb_pass.encode('UTF-8')).decode('UTF-8')
        }
    }


def getNodePortName():
    return "aiflow-nodeport"

def getNginxSelector():
    return flask_api.global_def.config.system_namespace + "-nginx"

def getNodeportYaml():
    return {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": getNodePortName(),
        },
        "spec": {
            "type": "NodePort",
            "ports": [
                {
                    "port": 80,
                    "targetPort": 80,
                    "name": "nginx"
                }
            ],
            "selector": {
                "app": getNginxSelector()
            }
        }
    }

def getClusterIPName():
    return 'aiflow-clusterip'

def getClusterIPYaml():
    data = {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": getClusterIPName(),
        },
        "spec": {
            "selector": {
                "app": flask_api.global_def.config.system_namespace,
            },
            "type": "ClusterIP",
            "clsuterIP" : None,
            "ports": [
                {
                    "name": "db",
                    "port": 3306,
                    "targetPort": 3306,
                    "protocol": "TCP"
                },
                {
                    "name": "react",
                    "port": 3000,
                    "targetPort": 3000,
                    "protocol": "TCP"
                },
                {
                    "name": "back",
                    "port": 8000,
                    "targetPort": 8000,
                    "protocol": "TCP"
                }
            ],
        }
    }

    return data
