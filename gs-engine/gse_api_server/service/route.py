import requests as requests

from tools.db_connector import DBConnector as mysql, add_search_query

import app_conf
from app_conf import RouteConf
from sql.route_sql import *


logger = app_conf.Log.get_logger(__name__)
conn = mysql.instance()


def get_routes(namespace=None, service_name=None):
    sql = select_route_list
    if namespace:
        sql = select_route_list + "WHERE INPUT_VALUE like '%" + namespace + "%'"
        if service_name:
            sql += " AND INPUT_VALUE like '%" + service_name + "'"
    return conn.select(sql)


def create_route(namespace="default", service_name=None, output_value=None, filter_value=None):
    input_value = "/" + namespace + "/" + service_name
    data = {
        "input_value": input_value,
        "output_value": output_value
    }
    if filter_value is not None:
        data["filter_value"] = filter_value
    result = conn.insert(insert_route_sql, data)
    if result[0] == 0:
        gateway_host = RouteConf.host
        url = f"http://{gateway_host}/actuator/refresh"
        res = requests.post(url)
        logger.debug(res)
    return result


def get_route(input_value):
    return conn.select(select_route, input_value)


def delete_route(namespace, service_name):
    input_value = "/" + namespace + "/" + service_name
    data = {
        "input_value": input_value
    }
    result = conn.delete(delete_route_sql, data)
    return result
