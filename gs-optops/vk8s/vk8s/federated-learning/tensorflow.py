import flwr as fl

# fl.server.start_server(config=fl.server.ServerConfig(num_rounds=3))

# import flwr as fl

# strategy = fl.server.strategy.FedAvg(
#     fraction_fit=0.1,  # Sample 10% of available clients for the next round
#     min_fit_clients=10,  # Minimum number of clients to be sampled for the next round
#     min_available_clients=80,  # Minimum number of clients that need to be connected to the server before a training round can start
# )
# fl.server.start_server(server_address="[::]:8080", config=fl.server.ServerConfig(num_rounds=3), strategy=strategy)

from typing import List, Tuple, Union, Dict, Optional
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
import flwr as fl
from flwr.common import Metrics

from collections import OrderedDict
from minio import Minio


group = os.environ.get("GROUPCODE", "DUD")
project = os.environ.get("PROJECT", "face-recognition")
client_num = int(os.environ.get("CLIENT_NUM", "2"))


def load_model():
    model = Sequential()
    model.add(Conv2D(32, (3, 3), input_shape=(62, 47, 1), activation="relu"))
    model.add(MaxPooling2D(2, 2))
    model.add(Conv2D(32, (3, 3), activation="relu"))
    model.add(MaxPooling2D(2, 2))
    model.add(Flatten())
    model.add(Dense(units=512, activation="relu"))
    model.add(Dense(units=128, activation="relu"))
    model.add(Dense(units=5, activation="softmax"))
    model.compile(
        loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"]
    )
    return model


def upload_model(file, round):
    bucket = "data"
    object_name = f"{group}/{project}/{round}/{file}"
    client = Minio(
        "cap.dudaji.com:32380",
        access_key="federated-learning",
        secret_key="MWf4Qas6n0GjjRZtpKKzOd5px4Nl3OZQo3M1k1xE",
        region="seoul",
    )
    client.fput_object(bucket, object_name, file)


def append_file(p, file_list):
    if os.path.isfile(p):
        file_list.append(p)
        return
    obj_list = os.listdir(p)
    #     if len(obj_list) == 0:
    #         file_list.append(p)
    #         return
    for obj in obj_list:
        append_file(os.path.join(p, obj), file_list)
    return


class SaveModelStrategy(fl.server.strategy.FedAvg):
    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes]],
        failures: List[
            Union[
                Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes],
                BaseException,
            ]
        ],
    ) -> Tuple[Optional[fl.common.Parameters], Dict[str, float]]:
        """Aggregate model weights using weighted average and store checkpoint"""

        # Call aggregate_fit from base class (FedAvg) to aggregate parameters and metrics
        aggregated_parameters, aggregated_metrics = super().aggregate_fit(
            server_round, results, failures
        )
        if aggregated_parameters is not None:
            print(f"Saving round {server_round} aggregated_parameters...")
            model = load_model()
            # Convert `Parameters` to `List[np.ndarray]`
            aggregated_ndarrays: List[np.ndarray] = fl.common.parameters_to_ndarrays(
                aggregated_parameters
            )
            model.set_weights(aggregated_ndarrays)
            model_path = f"model_round_{server_round}"
            model.save(model_path)
            file_list = []
            append_file(model_path, file_list)
            for file in file_list:
                upload_model(file, server_round)
        return aggregated_parameters, aggregated_metrics


# Create strategy and run server
strategy = SaveModelStrategy(
    #     (same arguments as FedAvg here)
    fraction_fit=0.2,
    fraction_evaluate=0.2,
    min_fit_clients=2,
    min_evaluate_clients=client_num,
    min_available_clients=client_num,
)

# Start Flower server
fl.server.start_server(
    server_address="0.0.0.0:8080",
    config=fl.server.ServerConfig(num_rounds=1),
    strategy=strategy,
)
