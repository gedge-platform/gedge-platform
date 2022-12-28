"""[summary]
Static Variables for the System(Python)
"""
# Render URLs
RENDER_BASE_URL = '/web'

RENDER_LOGIN = RENDER_BASE_URL + '/login'

RENDER_MULTI_CLUSTER_LIST = RENDER_BASE_URL + '/cluster/list'
RENDER_MULTI_CLUSTER_ADD = RENDER_BASE_URL + '/cluster/add'
RENDER_MULTI_CLUSTER_DETAIL = RENDER_BASE_URL + '/cluster/detail'

RENDER_MICRO_SERVICE_DETAIL = RENDER_BASE_URL + '/ms/detail'
RENDER_MICRO_SERVICE_ADD = RENDER_BASE_URL + '/ms/add'


# Interface URLS
INTERFACE_LOGIN = '/login'
INTERFACE_LOGOUT = '/logout'
INTERFACE_MULTI_CLUSTER_LIST = '/clusters'
INTERFACE_MULTI_CLUSTER_LOOKUP = '/cluster/<cluster_name>'
INTERFACE_MICRO_SERVICE_LIST = '/mss'
INTERFACE_MICRO_SERVICE_LOOKUP = INTERFACE_MULTI_CLUSTER_LOOKUP + '/ms/<ms_name>'
INTERFACE_CNI_LIST = '/cnis'
INTERFACE_CNI_LOOKUP = INTERFACE_MULTI_CLUSTER_LOOKUP + '/cni/<cni_name>'
INTERFACE_PVC_LIST = '/pvcs'
INTERFACE_PVC_LOOKUP = INTERFACE_MULTI_CLUSTER_LOOKUP + '/pvc/<pvc_name>'
INTERFACE_STRGCLASS_LIST = '/strgclasses'
INTERFACE_SERVICE_LIST = '/service'
INTERFACE_SERVICE_LOOKUP = INTERFACE_MULTI_CLUSTER_LOOKUP + '/service/<service_name>'
INTERFACE_CONFIGMAP_LIST = '/configmaps'
INTERFACE_CONFIGMAP_LOOKUP = INTERFACE_MULTI_CLUSTER_LOOKUP + '/configmap/<configmap_name>'

INTERFACE_CONFIG = '/config'
INTERFACE_CONFIG_BASE = INTERFACE_MULTI_CLUSTER_LOOKUP + INTERFACE_CONFIG
INTERFACE_CONFIG_NETWORK_LIST = INTERFACE_CONFIG_BASE + '/network'
INTERFACE_CONFIG_INTERFACE_LIST = INTERFACE_CONFIG_BASE + '/interface'
INTERFACE_CONFIG_DISK_LIST = INTERFACE_CONFIG_BASE + '/disk'
INTERFACE_CONFIG_INIT = INTERFACE_CONFIG_BASE + '/init'
INTERFACE_CONFIG_INVENTORY = INTERFACE_CONFIG_BASE + '/inventory'

# Template paths
LOGIN_TEMPLATE = '/login.html'

MULTI_CLUSTER_LIST_TEMPLATE = '/cluster_list.html'
MULTI_CLUSTER_ADD_TEMPLATE = '/cluster_add.html'
MULTI_CLUSTER_DETAIL_TEMPLATE = '/cluster_detail.html'

MICRO_SERVICE_DETAIL_TEMPLATE = '/ms_detail.html'
MICRO_SERVICE_ADD_TEMPLATE = '/ms_add.html'

# Web Views
WEB_LOGIN_VIEW = 'web_login_view'

WEB_MULTI_CLUSTER_LIST_VIEW = 'web_multi_cluster_list_view'
WEB_MULTI_CLUSTER_ADD_VIEW = 'web_multi_cluster_add_view'
WEB_MULTI_CLUSTER_DETAIL_VIEW = 'web_multi_cluster_detail_view'

WEB_MICRO_SERVICE_DETAIL_VIEW = 'web_micro_service_detail_view'
WEB_MICRO_SERVICE_ADD_VIEW = 'web_micro_service_add_view'

# MGMT Views
MANAGER_LOGIN_VIEW = 'manager_login_view'
MANAGER_LOGOUT_VIEW = 'manager_logout_view'
MANAGER_MULTI_CLUSTER_LIST_VIEW = 'manager_multi_cluster_list_view'
MANAGER_MULTI_CLUSTER_LOOKUP_VIEW = 'manager_multi_cluster_lookup_view'
MANAGER_MICRO_SERVICE_LIST_VIEW = 'manager_micro_service_list_view'
MANAGER_MICRO_SERVICE_LOOKUP_VIEW = 'manager_micro_service_lookup_view'
MANAGER_CNI_VIEW = 'manager_cni_view'
MANAGER_CNI_LOOKUP_VIEW = 'manager_cni_lookup_view'
MANAGER_PVC_VIEW = 'manager_pvc_view'
MANAGER_PVC_LOOKUP_VIEW = 'manager_pvc_lookup_view'
MANAGER_STRGCLASS_VIEW = 'manager_strgclass_view'
MANAGER_SERVICE_VIEW = 'manager_service_view'
MANAGER_SERVICE_LOOKUP_VIEW = 'manager_service_lookup_view'
MANAGER_CONFIGMAP_VIEW = 'manager_configmap_view'
MANAGER_CONFIGMAP_LOOKUP_VIEW = 'manager_configmap_lookup_view'

MANAGER_CONFIG_NETWORK_VIEW = 'config_network_view'
MANAGER_CONFIG_INTERFACE_VIEW = 'config_interface_view'
MANAGER_CONFIG_NODE_VIEW = 'config_node_view'
MANAGER_CONFIG_INIT_VIEW = 'config_init_view'
MANAGER_CONFIG_DISK_VIEW = 'config_disk_view'
MANAGER_CONFIG_INVENTORY_VIEW = 'config_inventory_view'

# DB
ACCOUNT_COLLECTION = 'users'
CLUSTER_COLLECTION = 'clusters'
MICRO_SERVICE_COLLECTION = 'services'
TEMPLATE_COLLECTION = 'templates'

# Result Statsu Code
SUCCESS = 200
CREATE = 201
UPDATE = 202
FAIL = 400
NOTFOUND = 404
EXIST = 409
NOTCONNECTED = 500

# Kubernetes
# DEFAULT_NAMESPACE = "gedge-default"
DEFAULT_NAMESPACE = "default"

# Kubernetes URI
KUBE_NETWORK_URL = '/apis/k8s.cni.cncf.io/v1'

# Kubernetes API Type
KUBE_API_NETWORK = 'CNI'
KUBE_API_STORAGE = 'PV'

CNI_TYPE_NAME = '/network-attachment-definitions'

BUF_SIZE = 8192
PORT = 5300


# Socket Type
SOCKET_INTERFACE = 'interface'
SOCKET_NETWORK = 'network'
SOCKET_DEPLOY = 'deploy'
SOCKET_INVENTORY = 'inventory'
SOCKET_DISK = 'disk'