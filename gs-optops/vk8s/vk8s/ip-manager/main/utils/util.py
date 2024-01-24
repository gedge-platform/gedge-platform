import sys
import os
import io
import time
import logging as log
from urllib.parse import urljoin
import numpy as np
import aiohttp


fl = sys.argv[0]
pathname = os.path.dirname(fl)
dir_path = os.path.abspath(pathname)
timestamps = {}


def join_with_root(path):
    return os.path.join(dir_path, path)


SHOW_TIME = False


class TimeStamp:
    def __init__(self, name):
        self.name = name
        self.infos = []
        self.previous = None

    def init(self):
        self.previous = time.time()
        self.infos = []

    def stamp(self, point_name):
        if not self.previous:
            raise Exception("time stamp not initialized")

        end = time.time()
        taken = np.around((end - self.previous) * 1000, 2)
        self.infos.append((point_name, taken))
        self.previous = end

    def show(self):
        log.info("-------------------------------")
        total = 0
        for i, info in enumerate(self.infos):
            point_name, taken = info
            total += taken
            log.info("%s. %s (%s)", i, point_name, taken)
        log.info("total: %s", total)


def timestamp(name):
    if name not in timestamps:
        stamp = TimeStamp(name)
        timestamps[name] = stamp
    return timestamps[name]


class Lazy(object):
    """Abstract data that will be initialized when it is actually accessed."""

    def __init__(self):
        self._inits = {}

    def add_initializer(self, name, initializer):
        """Adds the initializer function to the specified property."""
        self._inits[name] = initializer

    def has_attr(self, name):
        try:
            object.__getattribute__(self, name)
            return True
        except:
            return False

    def __getattr__(self, name):
        try:
            return object.__getattribute__(self, name)
        except:
            initializer = self._inits[name]
            log.debug("value (%s) initialized", name)
            value = initializer()
            object.__setattr__(self, name, value)
            return value

    def __delattr__(self, name):
        return object.__delattr__(self, name)

    def __setattr__(self, name, value):
        return object.__setattr__(self, name, value)


class Progress:
    def __init__(
        self, progress_name, parent, current_progress_callback,
    ):
        self.progress_name = progress_name
        self.parent = parent
        self.childrun = {}
        self.total = 0
        self.current = 0
        self.current_progress_callback = current_progress_callback

    def _update_parent(self, percent):
        self.parent.from_child(self.progress_name, percent)

    def from_child(self, progress_name, percent):
        self.childrun[progress_name] = percent
        sum_childrun = sum(self.childrun.values())
        len_childrun = len(self.childrun)
        self.current = sum_childrun / len_childrun
        self._update_parent(self.current)

    def done(self):
        # make already done
        self.set_total(100)
        self.set_value(100)

    def set_total(self, total):
        # total can be set later because parent receive only percent from child
        self.total = total

    def set_value(self, value):
        if self.childrun:
            log.debug("progress that have child can't have percent")
            return

        if self.total == 0:
            self.total = value

        self.current = value
        percent = (self.current / self.total) * 100
        self._update_parent(percent)
        if self.current_progress_callback:
            self.current_progress_callback(self.progress_name, percent)

    def get_child(self, progress_name):
        # if progress has children, it can not have progress itself
        child = Progress(progress_name, self, self.current_progress_callback)
        self.childrun[progress_name] = 0
        self.total = len(self.childrun.values()) * 100
        return child


def load_classes(path: str) -> list:
    # Loads *.names file at 'path'
    with open(path, "r") as f:
        ns = f.read().split("\n")
        return list(
            filter(None, ns)
        )  # filter removes empty strings (such as last line)


def image_to_byte_array(image):
    imgByteArr = io.BytesIO()
    image.save(imgByteArr, format=image.format)
    imgByteArr = imgByteArr.getvalue()
    return imgByteArr


def check_time(func, *args, **kargs):
    start = time.time()
    result = func(*args, **kargs)
    end = time.time()
    taken = np.round((end - start) * 1000, 2)
    return result, taken


def calculate_ms(start, end):
    if end <= 0:
        return 0
    return np.round((end - start) * 1000, 2)


class RestClient(object):
    """Generic request client

    :param server string: Endpoint base url
    :param default_headers dict: Key is header name and value is header value
    :param verify_ssl bool: If false, ignore validation of cert
    """

    def __init__(
        self, server=None, default_headers=None, verify_ssl=False, cert=None,
    ):
        self.server = server or "http://localhost"
        self._default_headers = default_headers or {}
        self.verify = cert
        if not verify_ssl:
            self.verify = False
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=1000)
        )

    @property
    def server(self):
        return self._server

    @server.setter
    def server(self, value):
        self._server = value

    def get_header(self, name=None):
        """Get header value by header name

        if name is None, return all of header

        :param name string: header name
        :return string|dict: header value | all of header
        """
        if name is None:
            return self._default_headers
        return self._default_headers[name]

    def set_header(self, name, value):
        """Set default header

        :param name string: header name
        :param value string: header value
        """
        self._default_headers[name] = value

    @property
    def verify(self):
        return self._verify

    @verify.setter
    def verify(self, value):
        self._verify = value

    async def call_api(
        self,
        method,
        resource_path="",
        headers=None,
        query_params=None,
        body=None,
    ):
        """

        :param method string: GET | POST | PUT | DELETE
        :param resource_path: To be added to base endpoint
        :param headers dict: To be added to default headers
        :param query_params dict: query params
        :param body: body data
        :return requests.models.Response: response object
        """
        headers = headers or {}
        query_params = query_params or {}
        # request url
        url = urljoin(self.server, resource_path)

        # set header
        req_headers = {**self._default_headers, **headers}

        # perform request and return response
        response = await self._request(
            method, url, headers=req_headers, body=body, params=query_params,
        )
        response.raise_for_status()
        return response

    async def _request(self, method, url, headers=None, params=None, body=None):
        method = method.upper()
        if method not in ["GET", "POST", "PUT", "DELETE"]:
            raise AttributeError("not supported method: {}")
        if method == "GET":
            res = await self.session.get(
                url, ssl=self.verify, headers=headers, params=params
            )
            return res
        if method == "POST":
            res = await self.session.post(
                url, json=body, ssl=self.verify, headers=headers, params=params,
            )
            return res
        if method == "PUT":
            res = await self.session.put(
                url, json=body, ssl=self.verify, headers=headers, params=params,
            )
            return res
        if method == "DELETE":
            res = await self.session.delete(
                url, ssl=self.verify, headers=headers, params=params,
            )
            return res

    async def close(self):
        await self.session.close()


def format_elapsed_time(elapsed_time):
    return str(elapsed_time).split(":")[2]
