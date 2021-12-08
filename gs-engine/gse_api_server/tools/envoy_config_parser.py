import json
import os

import yaml
import logging.handlers
from flask import abort

import app_conf

# set logger
logger = app_conf.Log.get_logger(__name__)

# temp
logger.addHandler(logging.StreamHandler())


def write_envoy_config(namespace, name, ports, service_routes=None):
    if service_routes is None:
        service_routes = []
    directory = f"/mnt/data/{namespace}"
    filename = f"{name}-config.yaml"
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        logger.error('Error: make directory failed.' + directory)
    with open(directory + "/" + filename, "w") as file:
        config_yaml = f"""
admin:
  access_log_path: /tmp/admin_access.log
  address:
    socket_address:
      protocol: TCP
      address: 0.0.0.0
      port_value: 15000
static_resources:
  listeners: []
  clusters: []
"""
        config = yaml.load(config_yaml, Loader=yaml.Loader)
        for idx, port in enumerate(ports):
            if port["externalPort"] == 15000 or port["externalPort"] == 15001 or port["externalPort"] == 15002:
                continue
            cluster_name = port["protocol"].lower() + "-" + str(port["containerPort"])
            e_listener = gen_listener(cluster_name, port, "listener_" + str(idx), service_routes)
            config["static_resources"]["listeners"].append(e_listener)
            if len(service_routes) > 0:
                for sr_idx, service_route in enumerate(service_routes):
                    c_name = service_route["destination"]["host"] + "-" + str(port["containerPort"])
                    try:
                        e_cluster = gen_cluster(c_name, service_route["ip"], port)
                        config["static_resources"]["clusters"].append(e_cluster)
                    except KeyError as e:
                        return f"No match route({service_route['destination']['host']}) in services"
            else:
                e_cluster = gen_cluster(cluster_name, "127.0.0.1", port)
                config["static_resources"]["clusters"].append(e_cluster)
        file.write(yaml.dump(config))
    return directory, filename


def gen_listener(cluster_name, port, listener_name, service_routes):
    e_listener = {
        "name": listener_name,
        "address": {
            "socket_address": {
                "protocol": port["protocol"],
                "address": "0.0.0.0",
                "port_value": 15001
            }
        },
        "filter_chains": [{
            "filters": []
        }]
    }
    e_filter = {
        "name": "envoy.filters.network.http_connection_manager",
        "typed_config": {
            "@type": "type.googleapis.com/envoy.config.filter.network.http_connection_manager.v2.HttpConnectionManager",
            "stat_prefix": "ingress_http",
            "route_config": {
                "name": "local_route",
                "virtual_hosts": []
            },
            "http_filters": [{
                "name": "envoy.filters.http.router"
            }]
        }
    }
    if len(service_routes) > 0:
        for sr_idx, service_route in enumerate(service_routes):
            routes = []
            for match in service_route.get("match", []):
                route = {
                    "match": match["uri"],
                    "route": {
                        "cluster": service_route["destination"]["host"] + "-" + str(port["containerPort"])
                    }
                }
                if service_route.get("rewrite", None):
                    route["route"]["prefix_rewrite"] = service_route["rewrite"]["uri"]
                if service_route.get("timeout", None):
                    route["timeout"] = service_route["timeout"]
                if service_route.get("retries", None):
                    retry_policy = {}
                    if service_route["retries"].get("attempts", None):
                        retry_policy["num_retries"] = service_route["retries"]["attempts"]
                    if service_route["retries"].get("retryOn", None):
                        retry_policy["retry_on"] = service_route["retries"]["retryOn"]
                    if service_route["retries"].get("preTryTimeout", None):
                        retry_policy["pre_try_timeout"] = service_route["retries"]["preTryTimeout"]
                    if len(retry_policy.keys()) > 0:
                        route["retry_policy"] = retry_policy
                routes.append(route)
            virtual_host = {
                "name": service_route["name"],
                "routes": routes,
                "domains": service_route["hosts"]
            }
            e_filter["typed_config"]["route_config"]["virtual_hosts"].append(virtual_host)
    else:
        e_filter["typed_config"]["route_config"]["virtual_hosts"].append({
            "name": "local_service",
            "domains": ["*"],
            "routes": [{
                "match": {
                    "prefix": "/"
                },
                "route": {
                    "cluster": cluster_name
                }
            }]
        })
    e_listener["filter_chains"][0]["filters"].append(e_filter)
    return e_listener


def gen_cluster(cluster_name, address, port):
    e_cluster = {
        "name": cluster_name,
        "connect_timeout": "30s",
        "type": "LOGICAL_DNS",
        # Comment out the following line to test on v6 networks
        "dns_lookup_family": "V4_ONLY",
        "lb_policy": "ROUND_ROBIN",
        "load_assignment": {
            "cluster_name": cluster_name,
            "endpoints": [{
                "lb_endpoints": []
            }]
        }
        # "transport_socket": {
        #     "name": "envoy.transport_sockets.tls",
        #     "typed_config": {
        #         "@type": "type.googleapis.com/envoy.api.v2.auth.UpstreamTlsContext",
        #         "sni": "www.google.com"
        #     }
        # }
    }
    lb_endpoint = {
        "endpoint": {
            "address": {
                "socket_address": {
                    "address": address,
                    "port_value": port["containerPort"]
                }
            }
        }
    }
    e_cluster["load_assignment"]["endpoints"][0]["lb_endpoints"].append(lb_endpoint)
    return e_cluster
