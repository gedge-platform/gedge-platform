from kubernetes import client, config
from kubernetes.client.rest import ApiException

from flask import request, Response, session
from flask.views import MethodView

from .function import *
from apps.common import log_manager

import json, os
class KubeInitManageView(MethodView):
    def get(self):
        log_manager.debug(
            '-----Request-----\n'+
            'method : get response_analysis_manager\n'+
            'desc : get kube info\n'+
            '------------------'
        )
        ret_data = {
            'network':get_kube_network(),
            'tplg_plcy':get_topology_policy(),
            'reset_status':get_reset_status()
        }
        log_manager.debug(
            '\n-----Response-----\n'+
            'method : get response_analysis_manager\n'+
            'desc : get kube info\n'+
            '-----data-----\n'+
            str(ret_data)+
            '\n------------------'
        )
        return Response(
            json.dumps(ret_data, ensure_ascii=False).encode('utf-8'),
            status=200
        )
        
    def post(self):
        log_manager.debug(
            '-----Request-----\n'+
            'method : post response_analysis_manager\n'+
            'desc : kubernets reset\n'+
            '------------------'
        )
        log_manager.debug('kubernets reset start')
        request_data = request.get_json()
        network_type = request_data['network_type']
        tplg_plcy = request_data['tplg_plcy']
        init_kube(network_type, tplg_plcy)
        renew_acc_key()

        create_default_multus()
        create_default_sriov()

        set_kube_network(network_type)
        set_topology_policy(tplg_plcy)
        
        session['kube_network'] = get_kube_network()
        session['tplg_plcy'] = get_topology_policy()
        
        ret_data = {
            'network':get_kube_network(),
            'tplg_plcy':get_topology_policy()
        }
        log_manager.debug(
            '\n-----Response-----\n'+
            'method : post response_analysis_manager\n'+
            'desc : kubernets reset end\n'+
            '-----data-----\n'+
            str(ret_data)+
            '\n------------------'
        )
        log_manager.debug('kubernets reset end')

        return Response(
            json.dumps(ret_data, ensure_ascii=False).encode('utf-8'),
            status=200
        )
   