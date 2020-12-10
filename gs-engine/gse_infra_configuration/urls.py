import sys

def add_urls_app(app):
    #add_url
    url_list = [
        'apps.node_manager.urls',
        'apps.pod_manager.urls',
        'apps.network_manager.urls',
        'apps.kube_init_manager.urls',
        'apps.response_analysis_manager.urls',
    ]

    index = 0
    while index < len(url_list):
        # importlib.import_module(url_list[index])
        __import__(url_list[index])
        getattr(
            sys.modules[url_list[index]],
            'add_url'
        )(app)
        index += 1
