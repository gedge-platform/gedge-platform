"""Optimized help funcs
"""

import sys
from collections import deque
from io import StringIO


class Base(object):
    def __repr__(self):
        s = StringIO()
        s.write(self.__class__.__name__ + ": {")
        for k, v in self.__dict__.iteritems():
            s.write(k + ": " + str(v))
            s.write(", ")
        if len(self.__dict__) > 0:
            s.seek(-2, 1)
        s.write("}")
        ret = s.getvalue()
        s.close()
        return ret


def generalize(obj, modules={}, filt=None):
    queue = deque()
    result = {"": obj}
    queue.appendleft((result, "", obj))

    while len(queue) > 0:
        # dict or list or object, key or index, value
        d, k, v = queue.pop()
        if isinstance(v, tuple):
            # convert to mutable list
            v = d[k] = list(v)

        new_d = None
        try:
            if hasattr(v, "__dict__"):
                new_d = {}
                # engine and clique ligrary Endpoint module is different
                new_d["___module___"] = modules.get(v.__module__, v.__module__)
                new_d["___classname___"] = v.__class__.__name__
            else:
                d[k] = v
        except:
            pass

        if isinstance(v, dict):
            new_d = {}
            d[k] = new_d
            for k2, v2 in v.iteritems():
                queue.appendleft((new_d, k2, v2))
        elif isinstance(v, list):
            ln = len(v)
            new_d = range(ln)
            d[k] = new_d
            for index in new_d:
                queue.appendleft((new_d, index, v[index]))
        elif hasattr(v, "__dict__"):
            d[k] = new_d
            for k2, v2 in v.__dict__.iteritems():
                if not hasattr(k2, "__getitem__"):
                    queue.appendleft((new_d, k2, v2))
                else:
                    if filt is None or filt(k2):
                        queue.appendleft((new_d, k2, v2))
    # Return the adapted original obj_data
    return result[""]


def specialize(obj, modules={}, defc=Base):
    # Recursively replace objects
    queue = deque()
    result = {"": obj}
    queue.appendleft((result, "", obj))

    while len(queue) > 0:
        # dict or list or object, key or index, value
        d, k, v = queue.pop()
        if isinstance(v, tuple):
            # convert to mutable list
            v = d[k] = list(v)

        try:
            if (
                isinstance(v, dict)
                and "___classname___" in v
                and "___module___" in v
            ):
                # engine and clique ligrary Endpoint module is different
                modulename = modules.get(v["___module___"], v["___module___"])
                classname = v["___classname___"]
                if modulename in sys.modules:
                    m = __import__(modulename, fromlist=[classname])
                    if hasattr(m, classname):
                        cls = getattr(m, classname)
                        obj = object.__new__(cls)
                        obj.__dict__ = v
                    else:
                        obj = defc()
                        obj.__dict__ = v
                else:
                    obj = defc()
                    obj.__dict__ = v

                v = d[k] = obj
            else:
                d[k] = v
        except:
            pass

        if isinstance(v, dict):
            new_d = {}
            d[k] = new_d
            for k2, v2 in v.iteritems():
                queue.appendleft((new_d, k2, v2))
        elif isinstance(v, list):
            ln = len(v)
            new_d = range(ln)
            d[k] = new_d
            for index in new_d:
                queue.appendleft((new_d, index, v[index]))
        elif hasattr(v, "__dict__"):
            obj_dic = v.__dict__
            new_d = {}
            v.__dict__ = new_d
            for k2, v2 in obj_dic.iteritems():
                queue.appendleft((new_d, k2, v2))
    # Return the adapted original obj_data
    return result[""]
