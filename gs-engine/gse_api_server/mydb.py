import sqlite3
import json


def init(db_path):
    sql = """
    create table if not exists mytable ( 
        key text not null, 
        value blob, 
        primary key(key) 
    )    
    """
    try:
        conn = sqlite3.connect(db_path)
        curs = conn.cursor()
        curs.execute(sql)
        curs.close()
    except Exception as ex:
        print("error", ex)
    else:
        conn.commit()
    finally:
        if conn:
            conn.close()


def upsert(db_path, key, value):
    sql = "replace into mytable (key, value) values (?, ?)"
    try:
        conn = sqlite3.connect(db_path)
        curs = conn.cursor()
        curs.execute(sql, (key, value))
        curs.close()
    except Exception as ex:
        print("error", ex)
    else:
        conn.commit()
    finally:
        if conn:
            conn.close()


def delete(db_path, key):
    sql = "delete from mytable where key=?"
    try:
        conn = sqlite3.connect(db_path)
        curs = conn.cursor()
        curs.execute(sql, (key,))
        curs.close()
    except Exception as ex:
        print("error", ex)
    else:
        conn.commit()
    finally:
        if conn:
            conn.close()


def get(db_path, key):
    res = None
    sql = "select * from mytable where key = ?"
    try:
        conn = sqlite3.connect(db_path)
        curs = conn.cursor()
        curs.execute(sql, (key,))
        rows = curs.fetchall()
        for row in rows:
            res = row[1]
            break
        curs.close()
    except Exception as ex:
        print("error", ex)
    finally:
        if conn:
            conn.close()
    return res


def keys(db_path):
    sql = f"select * from mytable"
    res = []
    try:
        conn = sqlite3.connect(db_path)
        curs = conn.cursor()
        curs.execute(sql)
        rows = curs.fetchall()
        for row in rows:
            res.append(row[0])
        curs.close()
    except Exception as ex:
        print("error", ex)
    finally:
        if conn:
            conn.close()
    return res

# init()
# upsert("k1", "v1")
# upsert("k1", "hello world")
# read("k1")
#
# v = [0, 1]  # [modified_time, last_line]
# v = json.dumps(v).encode()
# upsert("k2", v)
#
# value = read("k2")
# if value is not None:
#     print(json.loads(value.decode()))
