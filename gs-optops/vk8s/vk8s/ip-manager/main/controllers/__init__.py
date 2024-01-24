import json
from datetime import date, datetime
import numpy as np
from quart import Blueprint
from bson import ObjectId

ip_bp = Blueprint("ip", __name__, url_prefix="/api")

blue_prints = [ip_bp]


class Encoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, np.integer):
            return int(o)
        elif isinstance(o, np.floating):
            return float(o)
        elif isinstance(o, np.ndarray):
            return o.tolist()
        elif isinstance(o, ObjectId):
            return str(o)
        elif isinstance(o, (datetime, date)):
            return o.isoformat()
        else:
            if callable(getattr(o, "dict", None)):
                return o.dict()
            return super(Encoder, self).default(o)


def jsonize(obj):
    return json.dumps(obj, cls=Encoder)

from .ip import *