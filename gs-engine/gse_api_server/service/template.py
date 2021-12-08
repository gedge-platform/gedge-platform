from flask import abort
import json
import app_conf

from tools import common as c_tool
from tools.db_connector import DBConnector as mysql, add_search_query
from sql.template_sql import *

# set logger
from tools.exception import NotExistException, DuplicatedException

logger = app_conf.Log.get_logger(__name__)
conn = mysql.instance()


def select_templates(details=None, cnt_from=None, cnt_to=None, search_name=None, sort=None):
    msg = {}
    sql = select_template_list_sql
    if details:
        sql = add_search_query(select_template_list_sql, cnt_from, cnt_to, None, search_name, sort)

    select_result = conn.select(sql)
    if len(select_result) > 0:
        if type(select_result) == tuple and select_result[0] > 0:
            msg['error'] = {
                'code': 400,
                'message': select_result[1]
            }
        else:
            msg["success"] = {
                "templates": []
            }
            templates = select_result.to_dict('records')
            # if sort:
            #     for s in sort:
            #         templates = sorted(templates, key=lambda template: template[s['target'].upper()])
            #         if s['method'] == 'desc':
            #             templates.reverse()
            for data in templates:
                if details:
                    msg["success"]["templates"].append({
                        "name": data["NAME"],
                        "service": json.loads(data["SERVICE"])
                    })
                else:
                    msg["success"]["templates"].append(data["NAME"])
    else:
        msg["success"] = {
            "templates": []
        }
    return msg


def create_template(template):
    try:
        select_result = select_template(template["name"])
        if select_result.get("success", None):
            raise DuplicatedException("template", template["name"])
        else:
            return select_result
    except NotExistException as e:
        data = {
            "name": template["name"],
            "service": json.dumps(template['service'])
        }
        insert_result = conn.insert(insert_template_sql, data)
        return c_tool.gen_msg_result_query(logger, insert_result)


def select_template(template_name):
    select_result = conn.select_one(select_template_sql, {"name": template_name})
    msg = {}
    if type(select_result) == tuple and select_result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': select_result[1]
        }
    else:
        if select_result:
            msg["success"] = {
                "template": {
                    "name": template_name,
                    "service": json.loads(select_result["SERVICE"])
                }
            }
        else:
            raise NotExistException("template", template_name)
    return msg


def update_template(template_name, template, method):
    service = template['service']
    if method.lower() == 'patch':
        result = select_template(template_name)
        if result.get("success", None):
            service = result["success"]["template"]["service"]
            service.update(template['service'])
    data = {
        "name": template_name,
        "service": json.dumps(service)
    }
    update_result = conn.update(update_template_sql, data)
    result = c_tool.gen_msg_result_query(logger, update_result)
    return result


def delete_template(template_name):
    delete_result = conn.delete(delete_template_sql, {"name": template_name})
    return c_tool.gen_msg_result_query(logger, delete_result)
