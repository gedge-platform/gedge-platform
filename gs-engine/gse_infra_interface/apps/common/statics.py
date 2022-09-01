"""[summary]
Static Variables for the System(Python)
"""
# Render URLs
RENDER_BASE_URL = ''

RENDER_LOGIN = RENDER_BASE_URL + '/login'

RENDER_MULTI_CLUSTER_LIST = RENDER_BASE_URL + '/cluster/list'
RENDER_MULTI_CLUSTER_ADD = RENDER_BASE_URL + '/cluster/add'

RENDER_MICRO_SERVICE_DETAIL = RENDER_BASE_URL + '/ms/detail'
RENDER_MICRO_SERVICE_ADD = RENDER_BASE_URL + '/ms/add'


# Interface URLS
INTERFACE_BASE_URL = '/api/v1'

INTERFACE_LOGIN = INTERFACE_BASE_URL + '/login'
INTERFACE_LOGOUT = INTERFACE_BASE_URL + '/logout'
INTERFACE_MULTI_CLUSTER_LIST = INTERFACE_BASE_URL + '/cluster'
INTERFACE_MULTI_CLUSTER_LOOKUP = INTERFACE_BASE_URL + '/cluster/<cluster_name>'
INTERFACE_MICRO_SERVICE_LIST = INTERFACE_BASE_URL + '/ms'
INTERFACE_MICRO_SERVICE_LOOKUP = INTERFACE_BASE_URL + '/cluster/<cluster_name>/ms/<ms_name>'

# Template paths
LOGIN_TEMPLATE = '/login.html'

MULTI_CLUSTER_LIST_TEMPLATE = '/cluster_list.html'
MULTI_CLUSTER_ADD_TEMPLATE = '/cluster_add.html'

MICRO_SERVICE_DETAIL_TEMPLATE = '/ms_detail.html'
MICRO_SERVICE_ADD_TEMPLATE = '/ms_add.html'

# Views
WEB_LOGIN_VIEW = 'web_login_view'

WEB_MULTI_CLUSTER_LIST_VIEW = 'web_multi_cluster_list_view'
WEB_MULTI_CLUSTER_ADD_VIEW = 'web_multi_cluster_add_view'

WEB_MICRO_SERVICE_DETAIL_VIEW = 'web_micro_service_detail_view'
WEB_MICRO_SERVICE_ADD_VIEW = 'web_micro_service_add_view'


MANAGER_LOGIN_VIEW = 'manager_login_view'
MANAGER_LOGOUT_VIEW = 'manager_logout_view'
MANAGER_MULTI_CLUSTER_LIST_VIEW = 'manager_multi_cluster_list_view'
MANAGER_MULTI_CLUSTER_LOOKUP_VIEW = 'manager_multi_cluster_lookup_view'
MANAGER_MICRO_SERVICE_LIST_VIEW = 'manager_micro_service_list_view'
MANAGER_MICRO_SERVICE_LOOKUP_VIEW = 'manager_micro_service_lookup_view'

# DB
ACCOUNT_COLLECTION = 'user'
CLUSTER_COLLECTION = 'cluster'
MICRO_SERVICE_COLLECTION = 'ms'


# Result Statsu Code
SUCCESS = 200
CREATE = 201
UPDATE = 202
FAIL = 400
EXIST = 409

# Kubernetes
DEFAULT_NAMESPACE = "gedge-default"