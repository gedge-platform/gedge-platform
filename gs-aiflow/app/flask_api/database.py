import os
import sys

import mysql.connector
from flask_api.global_def import g_var


dbHost = os.getenv('DB_HOST', 'localhost')
dbPort = os.getenv('DB_PORT', '3306')
dbUser = os.getenv('DB_USER', 'admin')
dbPass = os.getenv('DB_PASS', 'admin')

def create_tables(dbcon=None):
    if dbcon is None:
        try:
            dbcon = mysql.connector.connect(
                host=dbHost,
                port=dbPort,
                user=dbUser,
                password=dbPass,
            )
        except:
            print("CANT CONNECT DATABASE")
            sys.exit(1)

    cursor = dbcon.cursor()
    cursor.execute(
        'SHOW DATABASES'
    )
    rets = cursor.fetchall()

    if ('aiflow',) in rets:
        #return print("DATABASE ALREADY EXIST")
        print("DATABASE ALREADY EXIST")
    else:
        cursor.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED')
        cursor.execute(f'CREATE DATABASE IF NOT EXISTS {"aiflow"} CHARACTER SET utf8')
    cursor.execute('USE aiflow')
    dbcon.commit()

    import codecs
    with codecs.open(filename='./runtime_data/clusterDB.sql', mode='r', encoding='utf-8') as f:
        sqls = f.read()
    cursor = dbcon.cursor()
    rs = cursor.execute(sqls, multi=True)
    for r in rs:
        pass
    dbcon.commit()

    return print("SUCCESS SET DATABASE")


def get_db_connection():
    if not g_var.mycon or not g_var.mycon.is_connected():
        g_var.mycon = mysql.connector.connect(
            host=dbHost,
            port=dbPort,
            user=dbUser,
            database='aiflow',
            password=dbPass,
        )

    return g_var.mycon
