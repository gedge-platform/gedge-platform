from sqlalchemy import delete, update
from sqlalchemy.future import select
from sqlalchemy.sql.expression import func
from main.constants import FREE, POD_IP, POD_NAME, RESERVED, STATUS


from main.models import DataBase, IP


async def get_all():
    db = DataBase(None)
    stmt = select(IP)
    result = await db.execute(stmt)
    ret = []
    for row in result.fetchall():
        ip_row = row.IP
        ret.append(_parse_row(ip_row))
    return ret


async def get_free_ips():
    db = DataBase(None)
    stmt = select(IP).where(IP.status == FREE)
    result = await db.execute(stmt)
    ret = []
    for row in result.fetchall():
        ip_row = row.IP
        ret.append(_parse_row(ip_row))
    return ret


async def create_ip(pod_ip, status, pod_name):
    db = DataBase(None)
    new_ip = IP(pod_ip=pod_ip, status=status, pod_name=pod_name)
    await db.create_ip(new_ip)


async def create_ips(ip_list):
    if len(ip_list) == 0:
        return
    db = DataBase(None)
    ip_list = list(
        map(
            lambda ip: IP(
                pod_ip=ip[POD_IP], status=ip[STATUS], pod_name=ip[POD_NAME]
            ),
            ip_list,
        )
    )
    await db.create_all(ip_list)


async def update_ip(pod_ip, status, pod_name):
    db = DataBase(None)
    stmt = (
        update(IP)
        .where(IP.pod_ip == pod_ip)
        .values(status=status)
        .values(pod_name=pod_name)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)


async def update_ips(pod_ip_list):
    if len(pod_ip_list) == 0:
        return
    db = DataBase(None)
    stmts = []
    for ip in pod_ip_list:
        stmt = (
            update(IP)
            .where(IP.pod_ip == ip[POD_IP])
            .values(status=ip[STATUS])
            .values(pod_name=ip[POD_NAME])
            .execution_options(synchronize_session="fetch")
        )
        stmts.append(stmt)
    await db.execute_all(stmts)


async def delete_ip(pod_ip):
    db = DataBase(None)
    stmt = (
        delete(IP)
        .where(IP.pod_ip == pod_ip)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)


async def delete_ips(pod_ip_list):
    if len(pod_ip_list) == 0:
        return
    db = DataBase(None)
    stmts = []
    for pod_ip in pod_ip_list:
        stmt = (
            delete(IP)
            .where(IP.pod_ip == pod_ip)
            .where(IP.status == FREE)
            .execution_options(synchronize_session="fetch")
        )
        stmts.append(stmt)
    await db.execute_all(stmts)


async def get_random_free_ip():
    db = DataBase(None)
    async with db.async_session as session:
        get_free_stmt = (
            select(IP)
            .where(IP.status == FREE)
            .order_by(func.rand())
            .limit(1)
        )
        result = await session.execute(get_free_stmt)
        row = result.first()
        if row is None:
            return None
        ip_row = row.IP
        free_ip = IP(pod_ip=ip_row.pod_ip, status=ip_row.status, pod_name="")
        free_ip.status = RESERVED
        update_stmt = (
            update(IP)
            .where(IP.pod_ip == free_ip.pod_ip)
            .values(status=free_ip.status)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(update_stmt)
        await session.commit()
    return _parse_row(ip_row)


def _parse_row(ip_row):
    return {
        "pod_ip": ip_row.pod_ip,
        "status": ip_row.status,
        "pod_name": ip_row.pod_name,
    }
