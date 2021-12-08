import traceback
from typing import Dict, List, Any

from flask import abort
import json
import subprocess

import app_conf
from service.route import get_routes
from tools import common as c_tool

from tools import k8s_yaml_parser as kyp
from tools.db_connector import DBConnector as mysql
from sql.service_sql import *
from service import route as route_service

# set logger
logger = app_conf.Log.get_logger(__name__)

conn = mysql.instance()


def filter_for_service(item, search_name, search_label):
    match_name = True
    match_label = True
    if search_name:
        match_name = search_name in item['metadata']['name']
    if search_label:
        labels = item['metadata'].get('labels', None)
        split_label = search_label.split(":")
        match_label = labels.get(split_label[0], None) == split_label[1]

    return match_name and match_label


def paging_service(i, cnt_from, cnt_to):
    lt_from = cnt_from is None or i >= cnt_from
    gt_to = cnt_to is None or i < cnt_to

    return lt_from and gt_to


def filter_for_deployment(deployment, item, search_label):
    same_namespace = deployment["metadata"]["namespace"] == item["metadata"]["namespace"]
    include_name = item["metadata"]["name"] in deployment["metadata"]["name"]
    same_label = True

    if search_label:
        deployment_label = deployment['spec']['template']['metadata'].get('labels', None)
        split_label = search_label.split(":")
        same_label = deployment_label is not None and deployment_label.get(split_label[0], None) == split_label[1]

    return same_namespace and include_name and same_label


def list_service(details=False, cnt_from=None, cnt_to=None, search_namespace=None, search_name=None, search_label=None, sort=None):
    def fnc(obj):
        deployments = None
        result_routes = []
        db_services = []
        if details:
            ns = f'-n {search_namespace}' if search_namespace else '--all-namespaces'
            f_cmd = f'kubectl get deployments {ns} -o json'
            try:
                st, res = subprocess.getstatusoutput(f_cmd)
                if st != 0:
                    logger.error(res)
                elif fnc:
                    dep_obj = json.loads(res)
                    deployments = dep_obj["items"]
                select_result = conn.select(select_service_list_sql)
                if len(select_result) > 0:
                    if not (type(select_result) == tuple and select_result[0] > 0):
                        db_services = select_result.to_dict('records')
            except Exception as e:
                logger.error(traceback.format_exc())
            result_routes = get_routes(search_namespace)
            if type(result_routes) == tuple and result_routes[0] > 0:
                logger.error(result_routes[1])
            elif not result_routes.empty:
                pass
        success: Dict[str, List[Dict[str, List]]] = {
            'namespaces': []
        }
        services = [
            item
            for item in obj['items']
            if not details or filter_for_service(item, search_name, search_label)
        ]
        if sort:
            for s_idx, s in enumerate(sort):
                services = sorted(services, key=lambda service: service['metadata'][s['target']])
                if s['method'] == 'desc':
                    services.reverse()
                if len(sort) == 2 and s_idx == 0 and sort[1]['method'] == 'desc':
                    services.reverse()
        for i, item in enumerate(services):
            meta = item['metadata']
            idx = next((
                i
                for (i, f_ns) in enumerate(success['namespaces'])
                if f_ns['name'] == meta['namespace']
            ), None)

            if idx is None:
                idx = len(success['namespaces'])
                success['namespaces'].append({
                    'name': meta['namespace'],
                    'services': []
                })
            if details:
                if paging_service(i, cnt_from, cnt_to):
                    filtered_route = [
                        result_data
                        for route_i, result_data in result_routes.iterrows()
                        if result_data["INPUT_VALUE"] == "/" + meta['namespace'] + "/" + meta[
                            'name']
                    ]
                    link = ""
                    if not success.get("order", None):
                        success['order'] = []
                    success['order'].append({"namespace": meta['namespace'], "name": meta['name']})
                    if len(filtered_route) > 0:
                        link = "http://" + app_conf.RouteConf.host + "/" + meta['namespace'] + "/" + \
                               meta['name']
                    service = {
                        "service": item,
                        "deployments": [
                            deployment
                            for deployment in deployments
                            if filter_for_deployment(deployment, item, search_label)
                        ],
                        "link": link
                    }
                    db_service = [
                        _db_service
                        for _db_service in db_services
                        if _db_service['NAME'] == meta['name'] and _db_service['NAMESPACE'] == meta['namespace']
                    ]
                    if len(db_service) == 1:
                        service['serviceMesh'] = db_service[0].get("SERVICE_MESH", None)
                    success['namespaces'][idx]['services'].append(service)
            else:
                success['namespaces'][idx]['services'].append(meta['name'])
        return success

    ns = f'-n {search_namespace}' if search_namespace else '--all-namespaces'
    cmd = f'kubectl get services {ns}'
    return c_tool.gen_msg(logger, cmd, fnc)


def create_service(namespace, svc):
    # for deployment & service
    service_yaml = kyp.parse_yaml_service(namespace, svc['name'], svc)
    # apply
    cmd = f'cat << EOF | kubectl apply -f -\n{service_yaml}\nEOF\n'
    result = c_tool.gen_msg(logger, cmd)

    # todo: insert scheduleHint to schedulehint.db
    # k = f"{namespace}/{service['name']}"
    # v = json.dumps(service['scheduelHint']).encode()
    # mydb.upsert(db_schedulehint_path, k, v)
    data = {
        "name": svc["name"],
        "namespace": namespace,
        "app": svc["name"]
    }

    if not result.get('error', None):
        cmd = f'kubectl get svc {svc["name"]} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            if not result.get("error", None):
                result["error"] = {'code': 400, 'message': ""}
            result['error']['message'] += '\nservice: ' + res
        else:
            obj = json.loads(res)
            ip = obj["spec"]["clusterIP"]
            data["ip"] = ip
            port = obj["spec"]["ports"][0]["port"]
            output_value = "http://" + ip + ":" + str(port)
            insert_result = conn.insert(insert_service_sql, data)
            result = c_tool.gen_msg_result_query(logger, insert_result)
            if not result.get("error", None):
                create_route_result = route_service.create_route(namespace, svc["name"], output_value)
                if create_route_result[0] != 0:
                    if not result.get("error", None):
                        result["error"] = {'code': 400, 'message': ""}
                    result['error']['message'] += '\nroute: ' + create_route_result[1]
    return result


def get_service(namespace, service_name):
    # cmd = f"kubectl get svc {app_conf.RouteConf.service_name} -n {app_conf.RouteConf.namespace} -o json " + \
    #       "|jq '{\"ip\":.status.loadBalancer.ingress[0].ip, \"port\":.spec.ports[0].port}'"
    # access_url = ""
    # try:
    #     st, res = subprocess.getstatusoutput(cmd)
    #     if st != 0:
    #         logger.error(res)
    #     else:
    #         obj = json.loads(res)
    #         access_ip = obj.get("ip", None)
    #         access_port = obj.get("port", None)
    #         access_url = "http://" + access_ip + ":" + str(access_port) + "/" + namespace + "/" + service_name
    # except Exception as e:
    #     logger.error(traceback.format_exc())
    def deployment_fnc(_obj):
        deployments = []
        for _item in _obj.get('items', []):
            deployments.append({
                "name": _item['metadata']['name'],
                "replicas": _item['spec']['replicas'],
                "containers": [
                    container
                    for container in _item['spec']['template']['spec']['containers']
                    if container['name'] != 'envoyproxy'
                ],
                "labels": _item['metadata'].get("labels", {})
            })
        return deployments

    def service_fnc(_obj):
        success: Dict[str, List[Dict[str, List[Dict]]]] = {
            'namespaces': []
        }
        if not _obj:
            abort(404, description="not exist service(" + service_name + ")")
        _idx = next((
            i
            for (i, ns) in enumerate(success['namespaces'])
            if ns['name'] == _obj['metadata']['namespace']
        ), None)
        if _idx is None:
            _idx = len(success['namespaces'])
            success['namespaces'].append({
                'name': _obj['metadata']['namespace'],
                'services': []
            })

        _s_idx = next((
            i
            for (i, svc) in enumerate(success['namespaces'][_idx]['services'])
            if svc['name'] == _obj['metadata']['name']
        ), None)
        if _s_idx is None:
            _s_idx = len(success['namespaces'][_idx]['services'])
            success['namespaces'][_idx]['services'].append({
                'name': _obj['metadata']['name'],
            })

        service_obj = success['namespaces'][_idx]['services'][_s_idx]
        service_obj['clusterIP'] = _obj['spec']['clusterIP']
        service_obj['type'] = _obj['spec']['type']
        try:
            deployment_cmd = f'kubectl get deployment -l app={_obj["spec"]["selector"]["app"]} -n {namespace}'
        except KeyError as e:
            deployment_cmd = f'kubectl get deployment {service_name} -n {namespace}'
        deployment_result = c_tool.gen_msg(logger, deployment_cmd, deployment_fnc)
        deployments = deployment_result.get("success", None)
        result_routes = get_routes(namespace, service_name)
        filtered_route = [
            result_data
            for route_i, result_data in result_routes.iterrows()
            if result_data["INPUT_VALUE"] == "/" + namespace + "/" + _obj['metadata']['name']
        ]
        if len(filtered_route) > 0:
            service_obj['link'] = 'http://' + app_conf.RouteConf.host + '/' + namespace + '/' + service_name
        if deployments and len(deployments) >= 1:
            if len(deployments) > 1:
                service_obj['containers'] = deployments[0]['containers']
                service_obj['deployments'] = deployments
            elif len(deployments) == 1:
                service_obj['containers'] = deployments[0]['containers']
                service_obj['labels'] = deployments[0].get('labels', {})
            service_obj['replicas'] = deployments[0]['replicas']
        for port in _obj['spec']['ports']:
            for container in service_obj.get('containers', []):
                if container.get('ports', None):
                    for c_port in container['ports']:
                        if str(c_port['containerPort']) == port['name']:
                            c_port['externalPort'] = port['port']

        select_result = conn.select_one(select_service_sql, {"name": service_name, "namespace": namespace})
        if not (type(select_result) == tuple and select_result[0] > 0) and select_result:
            service_obj['serviceMesh'] = select_result.get("SERVICE_MESH", None)
        return success

    # deployment & service
    cmd = f'kubectl get services {service_name} -n {namespace}'
    result = c_tool.gen_msg(logger, cmd, service_fnc)
    # try:
    #     select_route_result = route_service.get_route(service_name)
    # except Exception as e:
    #     pass

    # # serviceMonitor
    # cmd = f'kubectl get servicemonitor {service_name} -n {namespace} -o json'
    # st, res = subprocess.getstatusoutput(cmd)
    # if st != 0:
    #     logger.error(res)
    # else:
    #     try:
    #         obj = json.loads(res)
    #         if obj.get('items', None):
    #             for item in obj['items']:
    #                 idx = next((
    #                     i
    #                     for (i, ns) in enumerate(result['success']['namespaces'])
    #                     if ns['name'] == item['metadata']['namespace']
    #                 ), None)
    #                 if idx is not None:
    #                     namespace_obj = result['success']['namespaces'][idx]
    #                     s_idx = next((
    #                         i
    #                         for (i, svc) in enumerate(namespace_obj['services'])
    #                         if svc['name'] == item['metadata']['name']
    #                     ), None)
    #                     if s_idx is not None:
    #                         namespace_obj['services'][s_idx]['monitorPorts'] = [
    #                             int(endpoint['port'])
    #                             for endpoint in item['spec']['endponts']
    #                         ]
    #         else:
    #             idx = next((
    #                 i
    #                 for (i, ns) in enumerate(result['success']['namespaces'])
    #                 if ns['name'] == obj['metadata']['namespace']
    #             ), None)
    #             if idx is not None:
    #                 namespace_obj = result['success']['namespaces'][idx]
    #                 s_idx = next((
    #                     i
    #                     for (i, svc) in enumerate(namespace_obj['services'])
    #                     if svc['name'] == obj['metadata']['name']
    #                 ), None)
    #                 if s_idx is not None:
    #                     namespace_obj['services'][s_idx]['monitorPorts'] = [
    #                         int(endpoint['port'])
    #                         for endpoint in obj['spec']['endpoints']
    #                     ]
    #
    #     except Exception as e:
    #         result.update({'error': {'code': 400, 'message': service_name + ' is not gse service'}})
    return result


def get_service_detail(namespace, service_name):
    def fnc(_obj):
        success: Dict[str, List[Dict[str, List[Dict]]]] = {
            'namespaces': []
        }
        for _item in _obj['items']:
            _idx = next((
                i
                for (i, ns) in enumerate(success['namespaces'])
                if ns['name'] == _item['metadata']['namespace']
            ), None)
            if _idx is None:
                _idx = len(success['namespaces'])
                success['namespaces'].append({
                    'name': _item['metadata']['namespace'],
                    'services': []
                })

            _s_idx = next((
                i
                for (i, svc) in enumerate(success['namespaces'][_idx]['services'])
                if svc['name'] == _item['metadata']['name']
            ), None)
            if _s_idx is None:
                _s_idx = len(success['namespaces'][_idx]['services'])
                success['namespaces'][_idx]['services'].append({
                    'name': _item['metadata']['name'],
                })

            service_obj = success['namespaces'][_idx]['services'][_s_idx]
            _kind = _item['kind'][:1].lower() + _item['kind'][1:]
            if not service_obj.get(_kind):
                service_obj[_kind] = []
            service_obj[_kind].append(_item)

        return success

    # deployment & service
    cmd = f'kubectl get deployment,services {service_name} -n {namespace}'
    result = c_tool.gen_msg(logger, cmd, fnc)

    # # serviceMonitor
    cmd = f'kubectl get servicemonitor {service_name} -n {namespace} -o json'
    st, res = subprocess.getstatusoutput(cmd)
    if st != 0:
        logger.error(res)
        result['error']['message'] += '\nserviceMonitor: ' + res
    else:
        obj = json.loads(res)
        if obj.get('items', None):
            for item in obj['items']:
                idx = next((
                    i
                    for (i, ns) in enumerate(result['success']['namespaces'])
                    if ns['name'] == item['metadata']['namespace']
                ), None)
                if idx is not None:
                    namespace_obj = result['success']['namespaces'][idx]
                    s_idx = next((
                        i
                        for (i, svc) in enumerate(namespace_obj['services'])
                        if svc['name'] == item['metadata']['name']
                    ), None)
                    if s_idx is not None:
                        kind = item['kind'][:1].lower() + item['kind'][1:]
                        if not namespace_obj['services'][s_idx].get(kind):
                            namespace_obj['services'][s_idx][kind] = []
                        namespace_obj['services'][s_idx][kind].append(item)
        else:
            idx = next((
                i
                for (i, ns) in enumerate(result['success']['namespaces'])
                if ns['name'] == obj['metadata']['namespace']
            ), None)
            if idx is not None:
                namespace_obj = result['success']['namespaces'][idx]
                s_idx = next((
                    i
                    for (i, svc) in enumerate(namespace_obj['services'])
                    if svc['name'] == obj['metadata']['name']
                ), None)
                if s_idx is not None:
                    kind = obj['kind'][:1].lower() + obj['kind'][1:]
                    if not namespace_obj['services'][s_idx].get(kind):
                        namespace_obj['services'][s_idx][kind] = []
                    namespace_obj['services'][s_idx][kind].append(obj)
    return result


def delete_service(namespace, service_name):
    delete_yaml = kyp.parse_yaml_delete_service(namespace, service_name)

    # delete deployment & service
    cmd = f'cat << EOF | kubectl delete -f -\n{delete_yaml}\nEOF\n'

    data = {
        "name": service_name,
        "namespace": namespace
    }
    result = c_tool.gen_msg(logger, cmd)
    conn.delete(delete_service_sql, data)
    delete_route_result = route_service.delete_route(namespace, service_name)
    if delete_route_result[0] != 0:
        if not result.get("error", None):
            result["error"] = {'code': 400, 'message': ""}
        result['error']['message'] += '\nroute: ' + delete_route_result[1]

    return result


def status_service(namespace, service_name):
    def fnc(obj):
        return obj['status']

    # deployment
    cmd = f'kubectl get deployment {service_name} -n {namespace}'
    return c_tool.gen_msg(logger, cmd, fnc)


def create_label(namespace, service_name, labels):
    cmd = f"kubectl label svc {service_name} -n {namespace} "
    cmd += " ".join([f"{k}={v}" for k, v in labels.items()])
    return c_tool.gen_msg(logger, cmd)


def get_label(namespace, service_name):
    def fnc(obj):
        return obj['metadata']['labels']

    # deployment
    cmd = f'kubectl get svc {service_name} -n {namespace} -o json'
    return c_tool.gen_msg(logger, cmd, fnc)


def delete_label(namespace, service_name, labels):
    cmd = f"kubectl label svc {service_name} -n {namespace} "
    cmd += " ".join([label + "-" for label in labels])
    return c_tool.gen_msg(logger, cmd)


def create_node_selector(namespace, service_name, node_selector):
    temp = {
        "spec": {
            "template": {
                "spec": {
                    "nodeSelector": node_selector
                }
            }
        }
    }
    # temp = yaml.dump(temp)
    temp = json.dumps(temp)

    cmd = f"""kubectl patch deployment {service_name} -n {namespace} --patch '{temp}'"""
    return c_tool.gen_msg(logger, cmd)


def delete_node_selector(namespace, service_name):
    temp = {
        "spec": {
            "template": {
                "spec": {
                    "nodeSelector": {}
                }
            }
        }
    }
    temp = json.dumps(temp)

    # multiline command! : """command"""
    cmd = f"""kubectl patch deployment {service_name} -n {namespace} --patch '{temp}'"""
    return c_tool.gen_msg(logger, cmd)


def get_node_selector(namespace, service_name):
    def fnc(obj):
        if 'nodeSelector' in obj['spec']['template']['spec']:
            return obj['spec']['template']['spec']['nodeSelector']
        else:
            # TODO: service_name이 None일 경우 디버깅(None 오류 안뜨면 주석제거)
            return f'"{service_name}" not found'

    # deployment
    cmd = f'kubectl get deployment {service_name} -n {namespace} -o json'
    return c_tool.gen_msg(logger, cmd, fnc)


def get_logs(namespace, service_name, labels, container=None):
    cmd = f'kubectl logs -n {namespace}'
    cnt = 0
    app = None
    version = None
    if labels is None:
        labels = {"app": service_name}
        if container is None:
            cmd += f" -c {service_name}"
    else:
        version = labels.get("version", None)
        app = labels.get("app", None)
    if container:
        cmd += f" -c {container}"
    elif version and app:
        cmd += f" -c {app}-{version}"
    elif version:
        cmd += f" -c {service_name}-{version}"
    elif app:
        cmd += f" -c {app}"

    for k, v in labels.items():
        if cnt > 0:
            cmd += ","
        else:
            cmd += " -l"
        cmd += f"{k}={v}"
        cnt += 1

    msg = {}
    try:
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['error'] = {'code': 400, 'message': res}
        else:
            msg['success'] = res
    except Exception as e:
        logger.error(traceback.format_exc())
        msg['error'] = {'code': 400, 'message': traceback.format_exc()}
    return msg
