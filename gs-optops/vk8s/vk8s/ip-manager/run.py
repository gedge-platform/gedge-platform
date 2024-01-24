import os
import asyncio
import logging as log
import warnings
from main import init_app
from sync import Syncer


def set_log_level(logger):
    logger = log.getLogger(logger)
    logger.setLevel(log.INFO)


def init_log():
    set_log_level("asyncio")
    set_log_level("quart")
    set_log_level("requests")
    set_log_level("urllib3")

    warnings.filterwarnings("ignore")
    log.basicConfig(
        format="%(asctime)s,%(msecs)d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s",
        datefmt="%Y-%m-%d:%H:%M:%S",
        level=log.DEBUG,
    )


init_log()


PROFILE_ENVRON = "PROFILE"
DEFAULT_PROFILE = "local"
INTERVAL_ENVRON = "INTERVAL"
DEFAULT_INTERVAL = "10"


async def start(profile: str):
    _app = await init_app(profile)
    return _app


def get_profile() -> str:
    profile = DEFAULT_PROFILE
    if PROFILE_ENVRON in os.environ:
        profile = os.environ[PROFILE_ENVRON]
    return profile


def get_interval() -> str:
    sync_interval = DEFAULT_INTERVAL
    if INTERVAL_ENVRON in os.environ:
        sync_interval = os.environ[INTERVAL_ENVRON]
    return sync_interval


if __name__ == "__main__":
    p = get_profile()
    event_loop = asyncio.get_event_loop()
    app = event_loop.run_until_complete(start(p))
    port = app.config["PORT"]
    log.debug("Start in port:%s, profile:%s", port, p)
    interval = int(get_interval())
    s = Syncer(interval=interval)
    event_loop.create_task(s.start())
    # event_loop.run_forever()
    app.run(
        port=port,
        host="0.0.0.0",
        debug=True,
        use_reloader=True,
        loop=event_loop,
    )
    event_loop.run_until_complete(s.stop())
    event_loop.close()
