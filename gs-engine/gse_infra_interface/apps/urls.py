"""[summary]
Entire System URI Module
"""
import sys

def add_urls_app(app):
    """[Add Entire System URI function]

    Args:
        app ([Flask]): [Flask Class]
    """
    #add_url
    url_list = [
        'apps.web.urls',
        'apps.manager.login.urls',
        'apps.manager.multi_cluster.urls',
        'apps.manager.micro_service.urls'
    ]

    index = 0
    while index < len(url_list):
        __import__(url_list[index])
        getattr(
            sys.modules[url_list[index]],
            'add_url'
        )(app)
        index += 1
