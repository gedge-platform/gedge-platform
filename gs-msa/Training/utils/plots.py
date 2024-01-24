import glob
import math
import os
from copy import copy
from pathlib import Path
import cv2
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import yaml
from torchvision import transforms
import re


def increment_path(path, exist_ok=False, sep='', mkdir=False):
    # Increment file or directory path, i.e. runs/exp --> runs/exp{sep}2, runs/exp{sep}3, ... etc.
    path = Path(path)  # os-agnostic
    if path.exists() and not exist_ok:
        suffix = path.suffix
        path = path.with_suffix('')
        dirs = glob.glob(f"{path}{sep}*")  # similar paths
        matches = [re.search(rf"%s{sep}(\d+)" % path.stem, d) for d in dirs]
        i = [int(m.groups()[0]) for m in matches if m]  # indices
        n = max(i) + 1 if i else 2  # increment number
        path = Path(f"{path}{sep}{n}{suffix}")  # update path
    dir = path if path.suffix == '' else path.parent  # directory
    if not dir.exists() and mkdir:
        dir.mkdir(parents=True, exist_ok=True)  # make directory
    return path


def feature_visualization(features, module_type, module_idx, n=64):
    """
    features:       Features to be visualized
    module_type:    Module type
    module_idx:     Module layer index within model
    n:              Maximum number of feature maps to plot
    """
    project, name = 'runs/features', 'exp'
    save_dir = increment_path(Path(project) / name)  # increment run
    save_dir.mkdir(parents=True, exist_ok=True)  # make dir

    plt.figure(tight_layout=True)
    blocks = torch.chunk(features, features.shape[1], dim=1)  # block by channel dimension
    n = min(n, len(blocks))
    for i in range(n):
        feature = transforms.ToPILImage()(blocks[i].squeeze())
        ax = plt.subplot(int(math.sqrt(n)), int(math.sqrt(n)), i + 1)
        ax.axis('off')
        plt.imshow(feature)  # cmap='gray'

    f = f"layer_{module_idx}_{module_type.split('.')[-1]}_features.png"
    print(f'Saving {save_dir / f}...')
    plt.savefig(save_dir / f, dpi=300)