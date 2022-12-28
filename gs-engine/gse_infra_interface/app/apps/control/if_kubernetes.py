"""
Kubernetes Interface Module
"""
from kubernetes import config, client
from kubernetes.client.api_client import ApiClient

from apps.common.statics import *

class KubernetesConnection:
    """[summary]
    This is the class that connects to Kubernetes using the Kubernetes SDK.
    """
    def __init__(self, address, key):
        self.address = address
        self.key = key
        self.client = None
        self.conn_yn = False

    def __enter__(self):
        if self.conn_yn == False:
            self.connect()
        return self.client

    def __exit__(self, exc_type, exc_value, traceback):
        if self.conn_yn == True:
            self.disconnect()
            self.conn_yn = False

    def connect(self):
        """[summary]
        Kubernetes Connect Setting, Create Kubernetes Client Variable
        """
        configuration = client.Configuration()
        configuration.api_key['authorization'] = self.key
        configuration.verify_ssl = False
        configuration.host = 'https://' + self.address + ':6443'
        configuration.client_side_validation = False
        client.Configuration.set_default(configuration)

        self.client = client

    def disconnect(self):
        """[summary]
        Disconnect Kubernetes, Delete The Kubernetes Client Variable
        """
        if self.client is not None:
            del self.client
            self.client = None


class KubernetesInterface:
    """[summary]
    Kubernetes InterFace Class, Use this class to access Kubernetes.
    """
    def __init__(self, master_node_address, master_node_key):
        self.client = KubernetesConnection(master_node_address, master_node_key)


    def KubeAPICall(self, method='GET', api_type=None, body=None, **ft):
        """
        Kubernetes API Call, Network Attachement Difinition

        Args:
            method (str, optional): _description_. Defaults to 'GET'.
            api_type (_type_, optional): _description_. Defaults to None.
            body (_type_, optional): _description_. Defaults to None.

        Returns:
            _type_: _description_
        """
        api_client = None
        with self.client as client:
            api_client = client.ApiClient()
        
        local_var_params = locals()

        url = None
        if not api_type:
            raise "No Input API Type"
        elif api_type == KUBE_API_NETWORK:
            url = KUBE_NETWORK_URL + '/namespaces/{namespace}' + CNI_TYPE_NAME

        path_params = {}
        if ft.get('namespace'):
            path_params['namespace'] = ft.get('namespace')
        else:
            path_params['namespace'] = DEFAULT_NAMESPACE

        if ft.get('name'):
            path_params['name'] = ft.get('name')
            url = url + '/{name}'
        
        query_params = []
        
        form_params = []
        local_var_files = {}
        
        header_params = {}
        # HTTP header `Accept`
        header_params['Accept'] = api_client.select_header_accept(
            ['application/json', 'application/yaml', 'application/vnd.kubernetes.protobuf'])

        return api_client.call_api(
            url, method,
            path_params,
            query_params,
            header_params,
            body=body,
            post_params=form_params,
            files=local_var_files,
            response_type=object,
            auth_settings=['BearerToken'],
            async_req=local_var_params.get('async_req'),
            _return_http_data_only=True,
            _preload_content=local_var_params.get('_preload_content', True),
            _request_timeout=local_var_params.get('_request_timeout'),
        )
