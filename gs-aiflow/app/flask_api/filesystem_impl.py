import os

import flask_api.global_def
import shutil


def makeFolderToNFS(path):
    totalPath = os.path.join(flask_api.global_def.config.nfs_path, path)
    try:
        os.makedirs(totalPath, exist_ok=True)
        return True
    except:
        return False


def removeFolderFromNFS(path):
    totalPath = os.path.join(flask_api.global_def.config.nfs_path, path)
    try:
        shutil.rmtree(totalPath)
        return True
    except:
        return False


def pathJoin(path, *addPaths):
    import re
    for item in addPaths:
        if(type(item) == str):
            path = os.path.join(path, re.sub('^[\s/\\\]*', "", item))

    return path