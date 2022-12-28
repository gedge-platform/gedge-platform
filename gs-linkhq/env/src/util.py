import yaml


def get_conf(path):
    with open(path) as f:
        conf = yaml.load(f, Loader=yaml.FullLoader)

    return conf

