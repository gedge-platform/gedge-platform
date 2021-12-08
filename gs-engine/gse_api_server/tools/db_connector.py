import re
import traceback

import pymysql
import pandas as pd
import numpy as np

import app_conf
from app_conf import DBConf
from tools.singleton import SingletonInstane

# set logger
logger = app_conf.Log.get_logger(__name__)

"""
execute()
data = ('ramen', 1)

# SELECT 
sql = "SELECT * FROM `food` WHERE name = %s AND id = %s;"
cursor.execute(sql, data)

# DELETE
sql = "DELETE FROM `food` WHERE `name` = %s AND `id` = %s;"
cursor.execute(sql, data)
db.commit()
===============================================================
executemany() 반복문 시 유리
data = [['ramen', 1], ['fried rice', 2], ['chicken', 3]]

# INSERT 
sql = "INSERT INTO `food`(name, id) VALUES (%s, %s);"
cursor.executemany(sql, data)
db.commit()

# UPDATE 
sql = "UPDATE `food` SET `name` = %s WHERE `id` = %s;"
cursor.executemany(sql, data)
db.commit()
"""


def parse_sql(sql: str, data):
    logger.debug(sql)
    logger.debug(data)
    p = re.compile(r'\{[\w_]+\}')
    key_list = [key.replace("{", "").replace("}", "") for key in p.findall(sql)]
    result_data = []
    try:
        if np.array(data).ndim == 0:
            result_data = [data.get(key, None) for key in key_list]
        else:
            result_data = [
                [d.get(key, None) for key in key_list]
                for d in data
            ]
    except KeyError as e:
        logger.error(e.args)
    if 'select ' in sql.lower() and ' in (' in sql.lower():
        result_data = np.array(result_data).flatten().tolist()
        result_sql = re.sub(p, ', '.join('%s' for _ in result_data), sql)
    else:
        result_sql = re.sub(p, '%s', sql)
    return result_sql, result_data


def add_search_query(origin_sql, cnt_from=None, cnt_to=None, search_namespace=None, search_name=None, sort=None):
    sql = origin_sql + "\n"
    if search_name or search_namespace:
        sql += "WHERE "
        if search_namespace:
            sql += f"NAMESPACE = '{search_namespace}'\n"
        if search_name and search_namespace:
            sql += "AND "
        if search_name:
            sql += f"NAME like '%{search_name}%'\n"
    if sort:
        sql += f"ORDER BY " + (", ".join([f"{s['target']} {s['method']}" for s in sort])) + "\n"
    if cnt_from is not None and cnt_to is not None:
        sql += f"LIMIT {cnt_from}, {cnt_to - cnt_from}"
    elif cnt_from is not None:
        sql += f"OFFSET {cnt_from}"
    elif cnt_to is not None:
        sql += f"LIMIT 0, {cnt_to}"
    return sql


class DBConnector(SingletonInstane):
    def __init__(self):
        self.user = DBConf.user
        self.passwd = DBConf.passwd
        self.host = DBConf.host
        self.db = DBConf.db
        self.charset = DBConf.charset

    def connect(self):
        return pymysql.connect(user=self.user, passwd=self.passwd, host=self.host, db=self.db, charset=self.charset)

    def _cud(self, sql, data):
        conn = self.connect()
        result = (0, "success")
        _sql, _data = parse_sql(sql, data)
        try:
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                if np.array(_data).ndim == 1:
                    if len(_data) > 0:
                        cursor.execute(_sql, _data)
                    else:
                        cursor.execute(_sql)
                else:
                    if len(_data) > 0:
                        cursor.executemany(_sql, _data)
                    else:
                        cursor.execute(_sql)
                conn.commit()
        except pymysql.err.InternalError as e:
            result = e.args
            logger.error(e.args)
        except pymysql.err.IntegrityError as e:
            result = e.args
            logger.error(e.args)
        finally:
            conn.close()
        return result

    def select(self, sql, data=[]):
        conn = self.connect()
        _sql, _data = parse_sql(sql, data)
        try:
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                if len(_data) > 0:
                    cursor.execute(_sql, _data)
                else:
                    cursor.execute(_sql)
                result = pd.DataFrame(cursor.fetchall())
        except pymysql.err.InternalError as e:
            result = e.args
            logger.error(e.args)
        except pymysql.err.IntegrityError as e:
            result = e.args
            logger.error(e.args)
        finally:
            conn.close()
        return result

    def select_one(self, sql, data=[]):
        conn = self.connect()
        _sql, _data = parse_sql(sql, data)
        try:
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                if len(_data) > 0:
                    cursor.execute(_sql, _data)
                else:
                    cursor.execute(_sql)
                result = cursor.fetchone()
        except pymysql.err.InternalError as e:
            result = e.args
            logger.error(e.args)
        except pymysql.err.IntegrityError as e:
            result = e.args
            logger.error(e.args)
        finally:
            conn.close()
        return result

    def insert(self, sql, data):
        return self._cud(sql, data)

    def delete(self, sql, data):
        return self._cud(sql, data)

    def update(self, sql, data):
        return self._cud(sql, data)

