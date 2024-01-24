# python libraties
import os, cv2, itertools
import numpy as np
import pandas as pd
from tqdm import tqdm
from glob import glob
from PIL import Image

# pytorch libraries
import torch
from torch import optim, nn
from torch.autograd import Variable
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms

# sklearn libraries
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

import flwr as fl
from typing import Tuple, Dict, List
from collections import OrderedDict


def load_data():
    from minio import Minio
    import zipfile
    import os

    bucket = "data"
    object_name = "archive.zip"
    filename = "data"
    if os.path.isfile(filename):
        return
    client = Minio(
        "cap.dudaji.com:32380",
        access_key="federated-learning",
        secret_key="MWf4Qas6n0GjjRZtpKKzOd5px4Nl3OZQo3M1k1xE",
        region="seoul",
    )
    client.fget_object(bucket, object_name, filename)

    with zipfile.ZipFile(filename, "r") as zip_ref:
        zip_ref.extractall(".")


def compute_img_mean_std(image_paths):
    """
    computing the mean and std of three channel on the whole dataset,
    first we should normalize the image from 0-255 to 0-1
    """

    img_h, img_w = 224, 224
    imgs = []
    means, stdevs = [], []

    for i in tqdm(range(len(image_paths))):
        img = cv2.imread(image_paths[i])
        img = cv2.resize(img, (img_h, img_w))
        imgs.append(img)

    imgs = np.stack(imgs, axis=3)
    print(imgs.shape)

    imgs = imgs.astype(np.float32) / 255.0

    for i in range(3):
        pixels = imgs[:, :, i, :].ravel()  # resize to one row
        means.append(np.mean(pixels))
        stdevs.append(np.std(pixels))

    means.reverse()  # BGR --> RGB
    stdevs.reverse()

    print("normMean = {}".format(means))
    print("normStd = {}".format(stdevs))
    return means, stdevs


def get_duplicates(x, df_undup):
    unique_list = list(df_undup["lesion_id"])
    if x in unique_list:
        return "unduplicated"
    else:
        return "duplicated"


def get_val_rows(x, df_val):
    # create a list of all the lesion_id's in the val set
    val_list = list(df_val["image_id"])
    if str(x) in val_list:
        return "val"
    else:
        return "train"


# feature_extract is a boolean that defines if we are finetuning or feature extracting.
# If feature_extract = False, the model is finetuned and all model parameters are updated.
# If feature_extract = True, only the last layer parameters are updated, the others remain fixed.
def set_parameter_requires_grad(model, feature_extracting):
    if feature_extracting:
        for param in model.parameters():
            param.requires_grad = False


def initialize_model(model_name, num_classes, feature_extract, use_pretrained=True):
    # Initialize these variables which will be set in this if statement. Each of these
    #   variables is model specific.
    model_ft = None
    input_size = 0

    if model_name == "resnet":
        """Resnet18, resnet34, resnet50, resnet101"""
        model_ft = models.resnet50(pretrained=use_pretrained)
        set_parameter_requires_grad(model_ft, feature_extract)
        num_ftrs = model_ft.fc.in_features
        model_ft.fc = nn.Linear(num_ftrs, num_classes)
        input_size = 224

    elif model_name == "vgg":
        """VGG11_bn"""
        model_ft = models.vgg11_bn(pretrained=use_pretrained)
        set_parameter_requires_grad(model_ft, feature_extract)
        num_ftrs = model_ft.classifier[6].in_features
        model_ft.classifier[6] = nn.Linear(num_ftrs, num_classes)
        input_size = 224

    elif model_name == "densenet":
        """Densenet121"""
        model_ft = models.densenet121(pretrained=use_pretrained)
        set_parameter_requires_grad(model_ft, feature_extract)
        num_ftrs = model_ft.classifier.in_features
        model_ft.classifier = nn.Linear(num_ftrs, num_classes)
        input_size = 224

    elif model_name == "inception":
        """Inception v3
        Be careful, expects (299,299) sized images and has auxiliary output
        """
        model_ft = models.inception_v3(pretrained=use_pretrained)
        set_parameter_requires_grad(model_ft, feature_extract)
        # Handle the auxilary net
        num_ftrs = model_ft.AuxLogits.fc.in_features
        model_ft.AuxLogits.fc = nn.Linear(num_ftrs, num_classes)
        # Handle the primary net
        num_ftrs = model_ft.fc.in_features
        model_ft.fc = nn.Linear(num_ftrs, num_classes)
        input_size = 299

    else:
        print("Invalid model name, exiting...")
        exit()
    return model_ft, input_size


# Define a pytorch dataloader for this dataset
class HAM10000(Dataset):
    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, index):
        # Load data and get label
        X = Image.open(self.df["path"][index])
        y = torch.tensor(int(self.df["cell_type_idx"][index]))

        if self.transform:
            X = self.transform(X)

        return X, y


def preprocess():
    data_dir = "."
    all_image_path = glob(os.path.join(data_dir, "*", "*.jpg"))
    imageid_path_dict = {
        os.path.splitext(os.path.basename(x))[0]: x for x in all_image_path
    }
    lesion_type_dict = {
        "nv": "Melanocytic nevi",
        "mel": "dermatofibroma",
        "bkl": "Benign keratosis-like lesions ",
        "bcc": "Basal cell carcinoma",
        "akiec": "Actinic keratoses",
        "vasc": "Vascular lesions",
        "df": "Dermatofibroma",
    }
    #     norm_mean, norm_std = compute_img_mean_std(all_image_path)
    norm_mean = [0.7630444, 0.5456509, 0.57003975]
    norm_std = [0.14092743, 0.15261324, 0.16997053]

    df_original = pd.read_csv(os.path.join(data_dir, "HAM10000_metadata.csv"))
    df_original["path"] = df_original["image_id"].map(imageid_path_dict.get)
    df_original["cell_type"] = df_original["dx"].map(lesion_type_dict.get)
    df_original["cell_type_idx"] = pd.Categorical(df_original["cell_type"]).codes
    df_original = df_original.groupby("cell_type_idx", group_keys=False).apply(
        lambda x: x.sample(frac=0.02)
    )
    # this will tell us how many images are associated with each lesion_id
    df_undup = df_original.groupby("lesion_id").count()
    # now we filter out lesion_id's that have only one image associated with it
    df_undup = df_undup[df_undup["image_id"] == 1]
    df_undup.reset_index(inplace=True)

    # here we identify lesion_id's that have duplicate images and those that have only one image.

    # create a new colum that is a copy of the lesion_id column
    df_original["duplicates"] = df_original["lesion_id"]
    # apply the function to this new column
    df_original["duplicates"] = df_original["duplicates"].apply(
        get_duplicates, df_undup=df_undup
    )

    # now we filter out images that don't have duplicates
    df_undup = df_original[df_original["duplicates"] == "unduplicated"]

    # now we create a val set using df because we are sure that none of these images have augmented duplicates in the train set
    y = df_undup["cell_type_idx"]
    _, df_val = train_test_split(df_undup, test_size=0.2, random_state=101, stratify=y)

    # identify train and val rows
    # create a new colum that is a copy of the image_id column
    df_original["train_or_val"] = df_original["image_id"]
    # apply the function to this new column
    df_original["train_or_val"] = df_original["train_or_val"].apply(
        get_val_rows, df_val=df_val
    )
    # filter out train rows
    df_train = df_original[df_original["train_or_val"] == "train"]

    # Copy fewer class to balance the number of 7 classes
    data_aug_rate = [15, 10, 5, 50, 0, 40, 5]
    for i in range(7):
        if data_aug_rate[i]:
            df_train = df_train.append(
                [df_train.loc[df_train["cell_type_idx"] == i, :]]
                * (data_aug_rate[i] - 1),
                ignore_index=True,
            )

    # # We can split the test set again in a validation set and a true test set:
    # df_val, df_test = train_test_split(df_val, test_size=0.5)
    df_train = df_train.reset_index()
    df_val = df_val.reset_index()
    num_examples = {"trainset": len(df_train), "testset": len(df_val)}
    return norm_mean, norm_std, df_train, df_val, num_examples


def load_model(device):
    # resnet,vgg,densenet,inception
    model_name = "densenet"
    num_classes = 7
    feature_extract = False
    # Initialize the model for this run
    model_ft, input_size = initialize_model(
        model_name, num_classes, feature_extract, use_pretrained=True
    )
    # Define the device:
    # device = torch.device('cpu')
    # Put the model on the device:
    model = model_ft.to(device)
    return model, input_size


def normalize(norm_mean, norm_std, df_train, df_val, input_size):
    # norm_mean = (0.49139968, 0.48215827, 0.44653124)
    # norm_std = (0.24703233, 0.24348505, 0.26158768)
    # define the transformation of the train images.
    train_transform = transforms.Compose(
        [
            transforms.Resize((input_size, input_size)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomVerticalFlip(),
            transforms.RandomRotation(20),
            transforms.ColorJitter(brightness=0.1, contrast=0.1, hue=0.1),
            transforms.ToTensor(),
            transforms.Normalize(norm_mean, norm_std),
        ]
    )
    # define the transformation of the val images.
    val_transform = transforms.Compose(
        [
            transforms.Resize((input_size, input_size)),
            transforms.ToTensor(),
            transforms.Normalize(norm_mean, norm_std),
        ]
    )

    # Define the training set using the table train_df and using our defined transitions (train_transform)
    training_set = HAM10000(df_train, transform=train_transform)
    train_loader = DataLoader(training_set, batch_size=32, shuffle=True, num_workers=4)
    # Same for the validation set:
    validation_set = HAM10000(df_val, transform=train_transform)
    val_loader = DataLoader(validation_set, batch_size=32, shuffle=False, num_workers=4)
    return train_loader, val_loader


# this function is used during training process, to calculation the loss and accuracy
class AverageMeter(object):
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count


total_loss_train, total_acc_train = [], []


def train(train_loader, model, criterion, optimizer, epoch, device):
    model.train()
    train_loss = AverageMeter()
    train_acc = AverageMeter()
    curr_iter = (epoch - 1) * len(train_loader)
    print(len(train_loader))
    for i, data in enumerate(train_loader):
        print("training...", i)
        images, labels = data
        N = images.size(0)
        # print('image shape:',images.size(0), 'label shape',labels.size(0))
        images = Variable(images).to(device)
        labels = Variable(labels).to(device)

        optimizer.zero_grad()
        outputs = model(images)

        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        prediction = outputs.max(1, keepdim=True)[1]
        train_acc.update(prediction.eq(labels.view_as(prediction)).sum().item() / N)
        train_loss.update(loss.item())
        curr_iter += 1
        if (i + 1) % 100 == 0:
            print(
                "[epoch %d], [iter %d / %d], [train loss %.5f], [train acc %.5f]"
                % (epoch, i + 1, len(train_loader), train_loss.avg, train_acc.avg)
            )
            total_loss_train.append(train_loss.avg)
            total_acc_train.append(train_acc.avg)
    return train_loss.avg, train_acc.avg


def validate(val_loader, model, criterion, optimizer, epoch, device):
    model.eval()
    val_loss = AverageMeter()
    val_acc = AverageMeter()
    with torch.no_grad():
        print(len(val_loader))
        for i, data in enumerate(val_loader):
            print("validating...", i)
            images, labels = data
            N = images.size(0)
            images = Variable(images).to(device)
            labels = Variable(labels).to(device)

            outputs = model(images)
            prediction = outputs.max(1, keepdim=True)[1]

            val_acc.update(prediction.eq(labels.view_as(prediction)).sum().item() / N)

            val_loss.update(criterion(outputs, labels).item())

    print("------------------------------------------------------------")
    print(
        "[epoch %d], [val loss %.5f], [val acc %.5f]"
        % (epoch, val_loss.avg, val_acc.avg)
    )
    print("------------------------------------------------------------")
    return val_loss.avg, val_acc.avg


class CifarClient(fl.client.NumPyClient):
    def __init__(
        self,
        model,
        trainloader: torch.utils.data.DataLoader,
        testloader: torch.utils.data.DataLoader,
        num_examples: Dict,
        epoch,
    ) -> None:
        self.model = model
        self.trainloader = trainloader
        self.testloader = testloader
        self.num_examples = num_examples
        self.epoch = epoch

    def get_parameters(self, config) -> List[np.ndarray]:
        # Return model parameters as a list of NumPy ndarrays
        ret = [val.cpu().numpy() for _, val in self.model.state_dict().items()]
        print("get_parameters")
        #         print(ret)
        return ret

    def set_parameters(self, parameters: List[np.ndarray]) -> None:
        # Set model parameters from a list of NumPy ndarrays
        params_dict = zip(self.model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        print("set_parameters")
        self.model.load_state_dict(state_dict, strict=True)

    def fit(
        self, parameters: List[np.ndarray], config: Dict[str, str]
    ) -> Tuple[List[np.ndarray], int, Dict]:
        # Set model parameters, train model, return updated model parameters
        self.set_parameters(parameters)
        #         train(self.model, self.trainloader, epochs=1, device=DEVICE)
        print("fit")
        train(self.trainloader, self.model, criterion, optimizer, self.epoch, DEVICE)
        return self.get_parameters(config={}), self.num_examples["trainset"], {}

    def evaluate(
        self, parameters: List[np.ndarray], config: Dict[str, str]
    ) -> Tuple[float, int, Dict]:
        # Set model parameters, evaluate model on local test dataset, return result
        self.set_parameters(parameters)
        #         loss, accuracy = test(self.model, self.testloader, device=DEVICE)
        print("evaluate")
        loss, accuracy = validate(
            self.testloader, self.model, criterion, optimizer, self.epoch, DEVICE
        )
        return float(loss), self.num_examples["testset"], {"accuracy": float(accuracy)}


# DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
load_data()
DEVICE = torch.device("cpu")
norm_mean, norm_std, df_train, df_val, num_examples = preprocess()
print(norm_mean, norm_std, num_examples)
model, input_size = load_model(DEVICE)
train_loader, val_loader = normalize(norm_mean, norm_std, df_train, df_val, input_size)
optimizer = optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss().to(DEVICE)
epoch_num = 1
best_val_acc = 0

client = CifarClient(model, train_loader, val_loader, num_examples, epoch_num)
fl.client.start_numpy_client(server_address="192.168.202.204:32394", client=client)
