import os
from typing import Dict, List, Any

from flask import jsonify, abort
import json
import yaml
import subprocess
import logging.handlers

import app_conf
from service.service import list_service
from sql.service_mesh_sql import *
from tools.db_connector import DBConnector as mysql, add_search_query
from sql.template_sql import select_in_template_sql
from sql.service_sql import insert_service_sql, delete_service_sql
from tools import common as c_tool
from tools import k8s_yaml_parser as kyp
from service import route as route_service

# set logger
logger = app_conf.Log.get_logger(__name__)
conn = mysql.instance()


def get_service(namespace, service_name):
    return


def get_service_meshes(details=False, cnt_from=None, cnt_to=None, search_namespace=None, search_name=None, sort=None):
    msg = {}
    sql = select_service_mesh_list_by_namespace_sql
    if details:
        sql = add_search_query(select_service_mesh_list_by_namespace_sql, cnt_from, cnt_to, search_namespace,
                               search_name, sort)
        select_result = conn.select(sql)
    else:
        select_result = conn.select(sql, {"namespace": search_namespace})
    if type(select_result) == tuple and select_result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': select_result[1]
        }
    elif not select_result.empty:
        success = {
            "namespaces": []
        }
        msg["success"] = success
        service_in_namespaces = None
        if details:
            result_services = list_service(details, cnt_from, cnt_to, search_namespace, search_name)
            if result_services.get("success", None):
                service_in_namespaces = result_services["success"].get("namespaces", None)
        service_meshes = select_result.to_dict('records')
        # if sort:
        #     for s in sort:
        #         service_meshes = sorted(service_meshes, key=lambda service_mesh: service_mesh[s['target'].upper()])
        #         if s['method'] == 'desc':
        #             service_meshes.reverse()
        for result_data in service_meshes:
            _idx = next((
                i
                for (i, ns) in enumerate(success['namespaces'])
                if ns == result_data["NAMESPACE"]
            ), None)
            if _idx is None:
                _idx = len(success['namespaces'])
                success['namespaces'].append({
                    'name': result_data['NAMESPACE'],
                    'serviceMeshes': []
                })
            if details and service_in_namespaces:
                for service_in_namespace in service_in_namespaces:
                    if success['namespaces'][_idx]['name'] == service_in_namespace['name']:
                        success['namespaces'][_idx]["serviceMeshes"].append({
                            "name": result_data["NAME"],
                            "services": json.loads(result_data["SERVICES"]),
                            "serviceRoutes": json.loads(result_data["SERVICE_ROUTES"])
                        })
            else:
                success['namespaces'][_idx]["serviceMeshes"].append(result_data["NAME"])
    return msg


def get_service_mesh(namespace, mesh_name):
    msg = {}
    select_result = conn.select_one(select_service_mesh_sql, {"namespace": namespace, "name": mesh_name})
    if type(select_result) == tuple and select_result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': select_result[1]
        }
    else:
        if select_result:
            msg["success"] = {
                "namespaces": [{
                    "name": namespace,
                    "serviceMesh": {
                        "name": mesh_name,
                        "services": json.loads(select_result["SERVICES"]),
                        "serviceRoutes": json.loads(select_result["SERVICE_ROUTES"])
                    }
                }]
            }
            for service in msg["success"]["namespaces"][0]["serviceMesh"]["services"]:
                if service.get("externalAccess", False):
                    service["link"] = 'http://' + app_conf.RouteConf.host + '/' + namespace + '/' + service['name']
        else:
            abort(404, description="not exist serviceMesh(" + mesh_name + ")")
    return msg


def create_service_mesh(namespace, sm):
    msg = {}
    data = [{"name": s["template"]} for s in sm['services']]
    select_result = conn.select(select_in_template_sql, data)
    if type(select_result) == tuple and select_result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': select_result[1]
        }
    elif not select_result.empty:
        apps = []
        svcs = []
        cluster_ip_dict = {}
        created_services = []
        for s in sm['services']:
            # for deployment & service
            for idx, result_data in select_result.iterrows():
                if result_data['NAME'] == s['template']:
                    service_name = s['name']
                    if not s.get('labels', None):
                        s['labels'] = {
                            'app': service_name
                        }
                    else:
                        s['labels']['app'] = service_name
                    deployment_name = s['name']
                    if s["labels"].get("version", None):
                        deployment_name += "-" + s["labels"]["version"]
                    svc_spec = json.loads(result_data["SERVICE"])

                    svc = {'name': deployment_name, 'service': svc_spec, 'labels': s['labels']}
                    if service_name not in apps:
                        apps.append(service_name)
                        cluster_ip = create_service_in_service_mesh(sm['name'], namespace, service_name, svc_spec, created_services)
                        cluster_ip_dict[service_name] = cluster_ip
                        for route in sm["serviceRoutes"]:
                            if route.get("hosts", None) is None:
                                route['hosts'] = []
                            if service_name == route["destination"]['host']:
                                route["ip"] = cluster_ip
                                route['hosts'].append(route["destination"]['host'])
                                route['hosts'].append(cluster_ip)
                                for c in svc_spec['containers']:
                                    for p in c['ports']:
                                        if cluster_ip:
                                            route['hosts'].append(cluster_ip + ":" + str(p['externalPort']))
                        svc['cluster_ip'] = cluster_ip
                        if s.get("externalAccess", False) and cluster_ip:
                            port = svc_spec['containers'][0]['ports'][0]["externalPort"]
                            output_value = "http://" + cluster_ip + ":" + str(port)
                            create_route_result = route_service.create_route(namespace, service_name, output_value)
                            if create_route_result[0] != 0:
                                logger.debug('route insert error: ' + create_route_result[1])
                    else:
                        svc['cluster_ip'] = cluster_ip_dict.get(service_name, None)
                    svcs.append(svc)

        created_deployments = []
        for svc in svcs:
            deployment_obj = kyp.parse_deployment(namespace, svc["name"], svc["service"], sm["serviceRoutes"])
            # destination과 service의 이름이 같지 않을 시 해당 서비스메쉬의 생성된 service, deployment 삭제
            if type(deployment_obj) == str:
                if len(created_services) > 0:
                    for created_service in created_services:
                        cmd = f'kubectl delete service {" ".join(created_service)} -n {namespace}'
                        c_tool.gen_msg(logger, cmd)
                    conn.delete(delete_service_sql, created_services)
                for created_deployment in created_deployments:
                    cmd = f'kubectl delete deployment {" ".join(created_deployment)} -n {namespace}'
                    c_tool.gen_msg(logger, cmd)
                abort(400, deployment_obj)

            deployment_obj["metadata"]["labels"] = svc["labels"].copy()
            deployment_obj["spec"]["selector"]["matchLabels"] = svc["labels"].copy()
            deployment_obj["spec"]["template"]["metadata"]["labels"] = svc["labels"].copy()
            deployment_yaml = yaml.dump(deployment_obj)
            cmd = f'cat << EOF | kubectl apply -f -\n{deployment_yaml}\nEOF\n'
            result = c_tool.gen_msg(logger, cmd)

            if result.get("error", None):
                if msg.get("error", None):
                    msg["error"]["message"] += "\n"
                else:
                    msg["error"] = result['error']
                msg["error"]["message"] += result["error"]["message"]
            else:
                created_deployments.append(svc["name"])
    insert_result = conn.insert(insert_service_mesh_sql, {
        "namespace": namespace,
        "name": sm["name"],
        "services": json.dumps(sm["services"]),
        "serviceRoutes": json.dumps(sm["serviceRoutes"])
    })
    return msg


def delete_service_mesh(namespace, mesh_name):
    # TODO: return 작업
    msg = {}
    data = {"namespace": namespace, "name": mesh_name}
    select_result = conn.select_one(select_service_mesh_sql, data)
    if type(select_result) == tuple and select_result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': select_result[1]
        }
    elif select_result:
        services = json.loads(select_result["SERVICES"])
        del_service_names = []
        for s in services:
            if not s["name"] in del_service_names:
                del_service_names.append(s["name"])
            delete_route_result = route_service.delete_route(namespace, s["name"])
            if delete_route_result[0] != 0:
                logger.debug('route insert error: ' + delete_route_result[1])
        cmd = f'kubectl delete service {" ".join(del_service_names)} -n {namespace}'
        msg = c_tool.gen_msg(logger, cmd)

        del_deployment_names = [
            s["name"] + (
                "-" + s["labels"]["version"]
                if s.get("labels", None) and s["labels"].get("version", None)
                else ""
            )
            for s in services
        ]
        cmd = f'kubectl delete deployment {" ".join(del_deployment_names)} -n {namespace}'
        result = c_tool.gen_msg(logger, cmd)
        for name in del_deployment_names:
            directory = f"/mnt/data/{namespace}"
            filename = f"{name}-config.yaml"
            file = directory + "/" + filename
            if os.path.isfile(file):
                os.remove(file)

        if result.get("error", None):
            if msg.get("error", None):
                msg["error"] = {
                    'code': 400,
                    'message': ""
                }
            else:
                msg["error"]["message"] += "\n"
            msg["error"]["message"] += result["error"]["message"]

        del_service = [{"namespace": namespace, "name": s["name"]} for s in services]
        conn.delete(delete_service_sql, del_service)
        conn.delete(delete_service_mesh_sql, data)
        return msg
    else:
        abort(404, description="not exist service mesh(" + mesh_name + ")")


def create_service_in_service_mesh(service_mesh_name, namespace, name, svc, created_services):
    cluster_ip = None
    service_obj = kyp.parse_service(namespace, name, svc, True)
    service_yaml = yaml.dump(service_obj)
    # apply
    cmd = f'kubectl get svc {name} -n {namespace}'
    msg = c_tool.gen_msg(logger, cmd, (lambda obj: obj))
    if msg.get("error", None) and "NotFound" in msg["error"]["message"]:
        cmd = f'cat << EOF | kubectl apply -f -\n{service_yaml}\nEOF\n'
        msg = c_tool.gen_msg(logger, cmd)
        if msg.get('error', None):
            abort(400, description="can't create service(" + name + "): " + msg['error'].get("message", ""))
        else:
            def fnc(obj):
                return obj["spec"]["clusterIP"]

            cmd = f'kubectl get service {name} -n {namespace}'
            msg = c_tool.gen_msg(logger, cmd, fnc)
            if msg.get('success', None):
                cluster_ip = msg["success"]
                data = {
                    'namespace': namespace,
                    'name': name,
                    'ip': cluster_ip,
                    'app': name,
                    'service_mesh': service_mesh_name
                }
                insert_result = conn.insert(insert_service_sql, data)
                if insert_result[0] > 0:
                    logger.error(insert_result[1])
                created_services.append(name)
                return cluster_ip
    elif len(created_services) > 0:
        # destination과 service의 이름이 같지 않을 시 해당 서비스메쉬의 생성된 service 삭제
        for created_service in created_services:
            cmd = f'kubectl delete service {created_service} -n {namespace}'
            c_tool.gen_msg(logger, cmd)
        conn.delete(delete_service_sql, created_services)
        abort(400, description=f"Duplicate service({name}) in namespace({namespace})")
