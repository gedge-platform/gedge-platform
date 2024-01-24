import logging as log
import json
from werkzeug.exceptions import HTTPException


class NotFoundException(HTTPException):
    code = 404
    name = "Not Found"

    def __init__(self, desc="Resource Not Found"):
        super(NotFoundException, self).__init__()
        self.description = desc


class NotImplementedException(HTTPException):
    code = 501
    name = "Not Implemented"

    def __init__(self, desc="Method Not Implemented"):
        super(NotImplementedException, self).__init__()
        self.description = desc


class BadRequestException(HTTPException):
    code = 400
    name = "Bad Request"

    def __init__(self, desc="Bad Request"):
        super(BadRequestException, self).__init__()
        self.description = desc


class InternalServerException(HTTPException):
    code = 500
    name = "Internal Server Error"

    def __init__(self, desc="Internal Server Error"):
        super(InternalServerException, self).__init__()
        self.description = desc


def handle_exception(e):
    log.debug("handle exception:%s", e)
    data = json.dumps(
        {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    )
    return data, e.code


async def init_errors(app):
    app.register_error_handler(HTTPException, handle_exception)
