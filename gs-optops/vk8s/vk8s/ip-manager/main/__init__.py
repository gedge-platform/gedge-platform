import os
import asyncio
from quart import Quart
from quart_cors import cors

# Blueprint
from main.controllers import blue_prints
from main.errors import init_errors
from main.models import init_models
from main.services import init_service


class App:
    def __init__(self, app: Quart):
        self.app = app
        self.config = app.config

    def register_error_handler(self, *args, **kwargs):
        return self.app.register_error_handler(*args, **kwargs)

    def run(self, *args, **kwargs):
        return self.app.run(*args, **kwargs)

    def get_config(self, key: str):
        return self.config[key]


async def init_app(profile: str) -> App:
    app = Quart(__name__)
    # cors
    cors(app, allow_origin="*")


    for bp in blue_prints:
        app.register_blueprint(bp)

    main_dir = os.getcwd()
    app.config.from_pyfile(f"{main_dir}/{profile}.cfg")

    await init_errors(app)
    await init_models(app)
    await init_service(app)
    app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024

    app = App(app)


    # set config
    return app
