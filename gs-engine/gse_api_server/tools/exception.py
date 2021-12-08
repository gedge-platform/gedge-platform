class CustomException(Exception):
    msg = "custom"

    def __init__(self, resource_type, name, namespace=None):
        self.namespace = namespace
        self.resource_type = resource_type
        self.name = name
        self.message = f"{self.msg} {self.resource_type}({self.name})"
        if self.namespace:
            self.message += f" in namespace({self.namespace})"

    def __str__(self):
        return self.message


class NotExistException(CustomException):
    msg = "not exist"


class DuplicatedException(CustomException):
    msg = "Duplicate"
