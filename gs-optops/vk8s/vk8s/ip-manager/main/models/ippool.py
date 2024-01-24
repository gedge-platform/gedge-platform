from sqlalchemy import delete
from sqlalchemy.future import select

from main.models import DataBase, IPPool


async def get_all():
    db = DataBase(None)
    stmt = select(IPPool)
    result = await db.execute(stmt)
    ret = []
    for row in result.fetchall():
        ippool_row = row.IPPool
        ret.append(ippool_row.ippool)
    return ret


async def create_all(ippool_list):
    db = DataBase(None)
    if len(ippool_list) == 0:
        return
    ippool_list = list(map(lambda ippool: IPPool(ippool=ippool), ippool_list))
    await db.create_all(ippool_list)


async def delete_ippool(ippool):
    db = DataBase(None)
    stmt = (
        delete(IPPool)
        .where(IPPool.ippool == ippool)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)


async def delete_ippools(ippool_list):
    db = DataBase(None)
    stmts = []
    for ippool in ippool_list:
        stmt = (
            delete(IPPool)
            .where(IPPool.ippool == ippool)
            .execution_options(synchronize_session="fetch")
        )
        stmts.append(stmt)
    await db.execute_all(stmts)
