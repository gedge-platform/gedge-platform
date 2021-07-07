from kubernetes import client, config
from kubernetes.client.rest import ApiException

from flask import request, Response
from flask.views import MethodView

from .function import *
from .api import NicApi, CiliumPlcyApi
from apps.common import static_value
from apps.common import log_manager
                    
from apps.kube_init_manager.function import create_default_multus, create_default_sriov
import json, yaml

class NicManageView(MethodView):
    def get(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : get nic manager\n'+
                'desc : get nic\n'+
                '\n-----Request data-----\n'+
                str(request.args)+
                '\n------------------'
            )
            nic_nm = request.args.get('nic_nm',None)
            nic_api = NicApi()

            if not nic_nm:
                response = nic_api.list_namespaced_nic(namespace=static_value.NAMESPACE)

                nic_list = []
                for nic in response['items']:
                    nic_config = json.loads(nic['spec']['config'].replace('\'','"'))
                    if nic['metadata']['name'] in ['macvlan-static','sriov-static']:
                        continue
                    nic_list.append({
                        'plugin_nm':'Multus' if nic['metadata']['name'].split('-')[0] == 'multus' else 'sriov',
                        'nic_nm' : nic['metadata']['name'],
                        'type' : nic_config['ipam']['type'],
                        'subnet' : nic_config['ipam'].get('subnet','-')
                    })
                log_manager.debug(
                    '\n-----Response-----\n'+
                    'method : get nic manager\n'+
                    'desc : get nic\n'+
                    '-----data-----\n'+
                    str(nic_list)+
                    '\n------------------'
                )
                return Response(
                    json.dumps(nic_list, ensure_ascii=False).encode('utf-8'),
                    status=200
                )
            else:
                response = nic_api.read_namespaced_nic(name=nic_nm, namespace=static_value.NAMESPACE)
                nic_config = json.loads(response['spec']['config'].replace('\'','"'))
                nic_info={
                    'plugin_nm':'Multus' if response['metadata']['name'].split('-')[0] == 'multus' else 'sriov',
                    'nic_nm' : response['metadata']['name'],
                    'type' : nic_config['ipam']['type'],
                    'subnet' : nic_config['ipam'].get('subnet','-')
                }
                log_manager.debug(
                    '\n-----Response-----\n'+
                    'method : get nic manager\n'+
                    'desc : get nic\n'+
                    '-----data-----\n'+
                    str(nic_info)+
                    '\n------------------'
                )
                return Response(
                    json.dumps(nic_info, ensure_ascii=False).encode('utf-8'),
                    status=200
                )

        except ApiException as e:
            log_manager.error(
                '-----ERROR-----\n'+
                'method : get nic manager\n'+
                'desc : get nic\n'+
                str(e)+
                '\n------------------'
            )  
            return str(e)
    def post(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : post nic manager\n'+
                'desc : create nic\n'+
                '\n-----Request data-----\n'+
                str(request.get_json())+
                '\n------------------'
            )
            nic_api = NicApi()
            nic_json, nic_config = make_nic_json(request.get_json())
            response = nic_api.create_namespaced_nic(namespace=static_value.NAMESPACE,body=nic_json)
            nic_info={
                'plugin_nm':'Multus' if nic_json['metadata']['name'].split('-')[0] == 'multus' else 'sriov',
                'nic_nm' : nic_json['metadata']['name'],
                'type' : nic_config['ipam']['type'],
                'subnet' : nic_config['ipam'].get('subnet','-')
            }
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : post nic manager\n'+
                'desc : create nic\n'+
                '-----data-----\n'+
                str(nic_info)+
                '\n------------------'
            )    
            return Response(
                json.dumps(nic_info, ensure_ascii=False).encode('utf-8'),
                status=200
            )
        except ApiException as e:
            log_manager.error(
                '-----ERROR-----\n'+
                'method : create nic manager\n'+
                'desc : create nic\n'+
                str(e)+
                '\n------------------'
            )  
            return str(e)
    def delete(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : delete nic manager\n'+
                'desc : delete nic\n'+
                '\n-----Request data-----\n'+
                str(request.get_json())+
                '\n------------------'
            )
            request_data = request.get_json()
            nic_nm = request_data.get('nic_nm',None)
            plugin = request_data.get('del_nic_plugin',None)
            nic_api = NicApi()
            if plugin:
                response = nic_api.list_namespaced_nic(namespace=static_value.NAMESPACE)
                nic_list = []
                for nic in response['items']:
                    target_nic_nm = nic['metadata']['name']
                    plugin_nm = target_nic_nm.split('-')[0]

                    if plugin_nm == plugin:
                        response = nic_api.delete_namespaced_nic(name=target_nic_nm, namespace=static_value.NAMESPACE)

                v1 = client.CoreV1Api()
                response = v1.list_namespaced_pod(namespace=static_value.NAMESPACE)
                for pod in response.items:
                    pod_nic_list = pod.metadata.annotations.get('k8s.v1.cni.cncf.io/networks',None)
                    if pod_nic_list:
                        pod_nic_list = json.loads(pod_nic_list)
                        for nic in pod_nic_list:
                            pod_nic_plugin_nm = nic['name'].split('-')[0]
                            if pod_nic_plugin_nm == plugin:
                                pod_nm = pod.metadata.name
                                response = v1.delete_namespaced_pod(namespace=static_value.NAMESPACE,name=pod_nm)
                if plugin == 'multus':
                    reset_multus()
                    create_default_multus()
                    create_default_sriov()
                elif plugin == 'sriov':
                    reset_sriov()
                    create_default_sriov()
                    
            else:
                if not nic_nm:
                    response = nic_api.delete_collection_namespaced_nic(namespace=static_value.NAMESPACE)
                else:
                    response = nic_api.delete_namespaced_nic(name=nic_nm, namespace=static_value.NAMESPACE)
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : delete nic manager\n'+
                'desc : delete nic\n'+
                '-----data-----\n'+
                'done'+
                '\n------------------'
            ) 
            return Response(
                'done',
                status=200
            )
        except ApiException as e:
            log_manager.error(
                '-----ERROR-----\n'+
                'method : delete nic manager\n'+
                'desc : delete nic\n'+
                str(e)+
                '\n------------------'
            )    
            return str(e)

class CiliumPlcyManagerView(MethodView):
    def post(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : create cilium plcy manager\n'+
                'desc : create plcy\n'+
                '\n-----Request data-----\n'+
                str(request.get_json())+
                '\n------------------'
            )
            cilium_api = CiliumPlcyApi()
            request_data = request.get_json()
            pod_list = request_data['pod_list']
            idx = 0
            select_in_type = request_data['select_in_type']
            select_out_type = request_data['select_out_type']
            for pod_nm in pod_list:
                plcy_nm = pod_nm+'-'+str(idx)
                cilium_plcy_json = make_plcy_json(request_data,plcy_nm,pod_nm)
                idx += 1
                if True:
                    response = cilium_api.create_namespaced_plcy(namespace=static_value.NAMESPACE,body=cilium_plcy_json['ingress'])

                if select_out_type:
                    response = cilium_api.create_namespaced_plcy(namespace=static_value.NAMESPACE,body=cilium_plcy_json['egress'])

            log_manager.debug(
                '\n-----Response-----\n'+
                'method : create cilium plcy manager\n'+
                'desc : create plcy\n'+
                '\n-----Request data-----\n'+
                'done'
                '\n------------------'
            )
            return Response(
                'done',
                status=200
            )
        except ApiException as e:
            log_manager.error(
                '-----ERROR-----\n'+
                'method : create cilium plcy manager\n'+
                'desc : create cilium plcy\n'+
                str(e)+
                '\n------------------'
            )  
            log_manager.error(str(e))
            return str(e)
    def delete(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : delete cilium plcy manager\n'+
                'desc : delete plcy\n'+
                '\n-----Request data-----\n'+
                str(request.get_json())+
                '\n------------------'
            )
            cilium_api = CiliumPlcyApi()
            response = cilium_api.list_namespaced_plcy(namespace=static_value.NAMESPACE)
            pod_list = request.get_json()['pod_list']
            for plcy in response['items']:
                plcy_name = plcy['metadata']['name']
                pod_nm_idx = [-1,-1]
                tmp_idx = 0
                for idx in range(0,len(plcy_name)):
                    if plcy_name[idx] == '-':
                        if pod_nm_idx[0] == -1:
                            pod_nm_idx[0] = idx
                        tmp_idx = idx
                pod_nm_idx[1] = tmp_idx
                pod_name = plcy_name[pod_nm_idx[0]+1:pod_nm_idx[1]]
                if pod_name in pod_list:
                    response = cilium_api.delete_namespaced_plcy(name=plcy_name, namespace=static_value.NAMESPACE)
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : delete cilium plcy manager\n'+
                'desc : delete plcy\n'+
                '-----data-----\n'+
                'done'+
                '\n------------------'
            )
            return Response(
                'done',
                status=200
            )
        except ApiException as e:
            log_manager.error(
                '-----ERROR-----\n'+
                'method : delete cilium plcy manager\n'+
                'desc : delete cilium plcy\n'+
                str(e)+
                '\n------------------'
            )  
            return str(e)