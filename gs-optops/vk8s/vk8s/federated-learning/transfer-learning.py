import numpy as np
import pandas as pd
import os
from time import time
import errno
import shutil
import matplotlib.pyplot as plt

import tensorflow as tf
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import (
    Dense,
    Flatten,
    GlobalAveragePooling2D,
    Conv2D,
    MaxPooling2D,
    Activation,
    Dropout,
)

import sklearn
from sklearn.datasets import fetch_lfw_people  ######
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report, log_loss, accuracy_score
from sklearn.model_selection import train_test_split

# from sklearn.decomposition import PCA
# from sklearn.svm import SVC
# from sklearn.model_selection import GridSearchCV
from minio import Minio

path = "."


def load_data():
    lfw_dataset = sklearn.datasets.fetch_lfw_people(
        data_home=path, min_faces_per_person=100, download_if_missing=True
    )
    return lfw_dataset


def preprocess(lfw_dataset):
    Name = lfw_dataset.target_names
    N = []
    for i in range(len(Name)):
        N += [i]

    mapping = dict(zip(Name, N))
    reverse_mapping = dict(zip(N, Name))

    def mapper(value):
        return reverse_mapping[value]

    X0 = lfw_dataset.images
    y = lfw_dataset.target
    X = X0.reshape(-1, 62, 47, 1)
    dataset = []
    testset = []
    t = 0
    for Xi, yi in zip(X, y):
        img = Xi / 255.0
        if t <= 200:
            dataset.append([img, yi])
        else:
            testset.append([img, yi])
        t += 1
    data, labels0 = zip(*dataset)
    test, tlabels0 = zip(*testset)
    labels1 = to_categorical(labels0)
    data = np.array(data)
    labels = np.array(labels1)
    tlabels1 = to_categorical(tlabels0)
    test = np.array(test)
    tlabels = np.array(tlabels1)
    trainx, testx, trainy, testy = train_test_split(
        data, labels, test_size=0.2, random_state=44
    )
    datagen = ImageDataGenerator(
        horizontal_flip=True,
        vertical_flip=True,
        rotation_range=20,
        zoom_range=0.2,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.1,
        fill_mode="nearest",
    )
    return datagen, trainx, trainy, testx, testy


def download_model(bucket, group, project, rnd):
    client = Minio(
        "cap.dudaji.com:32380",
        access_key="federated-learning",
        secret_key="MWf4Qas6n0GjjRZtpKKzOd5px4Nl3OZQo3M1k1xE",
        region="seoul",
    )
    results = client.list_objects(bucket, prefix=f"{group}/{project}", recursive=True)
    for obj in results:
        print(f"Downloading {obj.object_name}")
        client.fget_object(bucket, obj.object_name, obj.object_name)


def initialize_model(bucket, group, project, rnd):
    if not os.path.isdir(f"{group}/{project}"):
        download_model(bucket, group, project, rnd)
    model = tf.keras.models.load_model(f"{group}/{project}/{rnd}/model_round_{rnd}")
    #     model = tf.keras.models.load_model("model")
    return model


bucket = "data"
group = "DUD"
project = "face-recognition"
rnd = 1
lfw_dataset = load_data()
datagen, trainx, trainy, testx, testy = preprocess(lfw_dataset)

model = initialize_model(bucket, group, project, rnd)
model.summary()
his = model.fit(
    datagen.flow(trainx, trainy, batch_size=32),
    validation_data=(testx, testy),
    epochs=500,
)

y_pred = model.predict(testx)
pred = np.argmax(y_pred, axis=1)
ground = np.argmax(testy, axis=1)
print(classification_report(ground, pred))
