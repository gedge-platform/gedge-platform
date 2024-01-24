import logging as log
import traceback


async def _init(func, app):
    try:
        await func(app)
    except Exception as e:
        traceback.print_exc()
        log.debug("fail to init %s", func)
        raise e


async def init_service(app):
    log.debug("init service")
    # inference should be init before device
