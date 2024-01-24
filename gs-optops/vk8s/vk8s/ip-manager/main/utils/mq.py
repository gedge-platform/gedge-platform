import logging as log

callbacks = {}  # {"event": set(callback, ...)}


async def subscribe(event, callback):
    log.debug("subscribe event:%s, callback:%s", event, callback)

    def dispose():
        if event in callbacks:
            try:
                if callback in callbacks[event]:
                    callbacks[event].discard(callback)
            except:
                log.error(
                    "fail to dispose callback:%s from event:%s", callback, event
                )

    if event not in callbacks:
        callbacks[event] = set()
    callbacks[event].add(callback)
    return dispose


async def publish(event, data):
    if event in callbacks:
        for callback in callbacks[event]:
            await callback(data)
