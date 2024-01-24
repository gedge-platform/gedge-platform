# import flwr as fl

# strategy = fl.server.strategy.FedAvg(
#     fraction_fit=0.1,  # Sample 10% of available clients for the next round
#     min_fit_clients=10,  # Minimum number of clients to be sampled for the next round
#     min_available_clients=80,  # Minimum number of clients that need to be connected to the server before a training round can start
# )
# fl.server.start_server(server_address="[::]:8080", config=fl.server.ServerConfig(num_rounds=3), strategy=strategy)

from typing import List, Tuple, Union, Dict, Optional
import numpy as np

import flwr as fl
from flwr.common import Metrics

import torch
from torch import nn
from torchvision import models
from collections import OrderedDict
from minio import Minio
import os

# Define metric aggregation function
# def weighted_average(metrics: List[Tuple[int, Metrics]]) -> Metrics:
#     # Multiply accuracy of each client by number of examples used
#     accuracies = [num_examples * m["accuracy"] for num_examples, m in metrics]
#     examples = [num_examples for num_examples, _ in metrics]

#     # Aggregate and return custom metric (weighted average)
#     return {"accuracy": sum(accuracies) / sum(examples)}


# Define strategy
# strategy = fl.server.strategy.FedAvg(evaluate_metrics_aggregation_fn=weighted_average)
# strategy = fl.server.strategy.FedAvg(
#     fraction_fit=0.1,  # Sample 10% of available clients for the next round
#     min_fit_clients=10,  # Minimum number of clients to be sampled for the next round
#     min_available_clients=80,  # Minimum number of clients that need to be connected to the server before a training round can start
# )
# DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# DEVICE = torch.device("cpu")
DEVICE = torch.device("cuda")

group = os.environ.get("GROUPCODE", "DUD")
project = os.environ.get("PROJECT", "skin-cancer")
client_num = int(os.environ.get("CLIENT_NUM", "2"))


def set_parameter_requires_grad(model, feature_extracting):
    if feature_extracting:
        for param in model.parameters():
            param.requires_grad = False


def load_model():
    net = models.densenet121().to(DEVICE)
    feature_extract = False
    num_classes = 7
    set_parameter_requires_grad(net, feature_extract)
    num_ftrs = net.classifier.in_features
    net.classifier = nn.Linear(num_ftrs, num_classes)
    return net


def upload_weight(weight_file, round):
    bucket = "data"
    object_name = f"{group}/{project}/{round}/federated_learning_result.pth"
    client = Minio(
        "cap.dudaji.com:32380",
        access_key="federated-learning",
        secret_key="MWf4Qas6n0GjjRZtpKKzOd5px4Nl3OZQo3M1k1xE",
        region="seoul",
    )
    client.fput_object(bucket, object_name, weight_file)


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

            # Convert `List[np.ndarray]` to PyTorch`state_dict`
            params_dict = zip(model.state_dict().keys(), aggregated_ndarrays)
            state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})

            model.load_state_dict(state_dict, strict=True)

            # Save the model
            torch.save(model.state_dict(), f"model_round_{server_round}.pth")
            upload_weight(f"./model_round_{server_round}.pth", server_round)
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
# # Define metric aggregation function
# def weighted_average(metrics: List[Tuple[int, Metrics]]) -> Metrics:
#     # Multiply accuracy of each client by number of examples used
#     accuracies = [num_examples * m["accuracy"] for num_examples, m in metrics]
#     examples = [num_examples for num_examples, _ in metrics]

#     # Aggregate and return custom metric (weighted average)
#     return {"accuracy": sum(accuracies) / sum(examples)}

# strategy = fl.server.strategy.FedAvg(
#     evaluate_metrics_aggregation_fn=weighted_average,
#     fraction_fit=0.2,
#     fraction_evaluate=0.2,
#     min_fit_clients=2,
#     min_evaluate_clients=2,
#     min_available_clients=2,
# )

# Start Flower server
fl.server.start_server(
    server_address="0.0.0.0:8080",
    config=fl.server.ServerConfig(num_rounds=3),
    strategy=strategy,
)
