import logging as log
from typing import Any
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class IP(Base):
    __tablename__ = "ip"

    pod_ip = sa.Column(sa.VARCHAR(15), primary_key=True)
    status = sa.Column(sa.VARCHAR(12))
    pod_name = sa.Column(sa.VARCHAR(50))


class IPPool(Base):
    __tablename__ = "ippool"

    ippool = sa.Column(sa.VARCHAR(18), primary_key=True)


def get_dsn(app) -> str:
    return f"""mysql+aiomysql://{app.config["MYSQL_USER"]}:\
{app.config["MYSQL_PW"]}@{app.config["MYSQL_HOST"]}:\
{app.config["MYSQL_PORT"]}/{app.config["MYSQL_DB"]}?charset=utf8mb4"""


# MetaClass for singleton pattern
class DataBaseMeta(type):
    _instances = {}

    def __call__(cls, *args: Any, **kwds: Any) -> Any:
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwds)
            cls._instances[cls] = instance
        return cls._instances[cls]


class DataBase(metaclass=DataBaseMeta):
    def __init__(self, app) -> None:
        self.engine = create_async_engine(get_dsn(app))
        self.async_session = AsyncSession(self.engine, expire_on_commit=False)

    async def execute(self, query):
        try:
            async with self.async_session as session:
                result = await session.execute(query)
                await session.commit()
            return result
        except Exception as e:
            log.error(e, "Rolling Back!!")
            await session.rollback()

    async def execute_all(self, query_list):
        ret = []
        try:
            async with self.async_session as session:
                for query in query_list:
                    result = await session.execute(query)
                    ret.append(result)
                await session.commit()
            return ret
        except Exception as e:
            log.error(e, "Rolling Back!!")
            await session.rollback()

    async def create(self, row):
        try:
            async with self.async_session as session:
                session.add(row)
                await session.commit()
        except Exception as e:
            log.error(e, "Rolling Back!!")
            await session.rollback()

    async def create_all(self, rows):
        try:
            async with self.async_session as session:
                session.add_all(rows)
                await session.commit()
        except Exception as e:
            log.error(e, "Rolling Back!!")
            await session.rollback()
            return


async def init_db(app):
    db_instance = DataBase(app)
    # create table automatically based on class defined above
    async with db_instance.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def init_models(app):
    log.debug("init models")
    await init_db(app)
