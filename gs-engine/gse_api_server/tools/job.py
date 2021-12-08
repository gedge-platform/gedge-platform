# _*_ coding:utf-8 _*_
from sql.service_sql import select_empty_ip_service_list, update_service
from tools.db_connector import DBConnector as mysql
from tools import common as c_tool
import app_conf
# set logger
logger = app_conf.Log.get_logger(__name__)
conn = mysql.instance()


def service_ip_collector(num):
    cmd = f'kubectl get svc -n edge'
    value = conn.select(select_empty_ip_service_list, [])
    if len(value) > 0:
        result = c_tool.gen_msg(logger, cmd, service_parser)
        params = []
        for idx, data in value.iterrows():
            for item in result['success']['items']:
                if data['NAMESPACE'] == item['namespace'] and data['NAME'] == item['name']:
                    params.append(
                        {
                            'ip': item['ip'],
                            'namespace': item['namespace'],
                            'name': item['name']
                         }
                    )
        conn.update(update_service, params)
    # print('value :', value)
    # print('result :', result)


def service_parser(data):
    value = {}
    value['items'] = []

    for container in data['items']:
        dic = {}
        dic['namespace'] = container['metadata']['namespace']
        dic['name'] = container['metadata']['name']
        dic['ip'] = container['spec']['clusterIP']
        dic['service_mesh'] = None
        value['items'].append(dic)

    return value