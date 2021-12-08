import json
import yaml
import logging.handlers
import subprocess

import app_conf
from controller import mydb

# set logger
from tools import envoy_config_parser as ecp

logger = app_conf.Log.get_logger(__name__)

db_path = "./data/service.db"
db_schedulehint_path = "./data/schedulehint.db"
mydb.init(db_path)


def get_name(image):
    x = image.split("/")
    if len(x) == 1:
        x = x[0]
    else:
        x = x[1]
    x = x.split(":")
    return x[0]


def gen_sidecar_container(namespace, name, ports, service_routes):
    _, filename = ecp.write_envoy_config(namespace, name, ports, service_routes)
    return {
        "name": "envoyproxy",
        "image": "envoyproxy/envoy:v1.16-latest",
        "resources": {
            "requests": {
                "cpu": "200m",
                "memory": "500Mi"
            },
            "limits": {
                "cpu": "200m",
                "memory": "500Mi"
            },
        },
        "ports": [{
            "containerPort": 15000,
            "name": "envoy-admin",
            "protocol": "TCP"
        }, {
            "containerPort": 15001,
            "name": "envoy-ingress",
            "protocol": "TCP"
        }, {
            "containerPort": 15002,
            "name": "envoy-egress",
            "protocol": "TCP"
        }],
        "command": ["/usr/local/bin/envoy"],
        "args": [
            "-c", f"/etc/envoy-config/{namespace}/" + filename,
            "-l", "info",
            # "--service-cluster", name,
            # "--service-node", name,
            "--log-format", "[METADATA][%Y-%m-%d %T.%e][%t][%l][%n] %v"
        ],
        "volumeMounts": [{
            "name": "envoy-config-volume",
            "mountPath": "/etc/envoy-config/"
        }]
    }


def parse_deployment(namespace, name, svc, service_routes=None):
    """
    deployment yaml 파서
    :param namespace:
    :param name:
    :param svc:
    :param service_routes:
    :return:
    """
    """ iptables proxy 사용시 yaml
    - iptables
        args:
        - -t 
        - nat
        - -A
        - PREROUTING
        - -p
        - tcp
        - --dport
        - "80"
        - -j
        - REDIRECT
        - --to-ports
        - "15001"
        image: soarinferret/iptablesproxy
        imagePullPolicy: IfNotPresent
        name: istio-init
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            add:
            - NET_ADMIN
            - NET_RAW
            drop:
            - ALL
          privileged: true   <---- changed from false
          readOnlyRootFilesystem: false
          runAsGroup: 0
          runAsNonRoot: false
          runAsUser: 0
    """
    deployment_yaml = f"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  namespace: {namespace}
  labels:
    app: {name}
spec:
  progressDeadlineSeconds: 3600
  replicas: 1
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      labels:
        app: {name}
    spec:
      containers: []
"""
    if service_routes is None:
        service_routes = []
    else:
        deployment_yaml += """      initContainers:
      - image: docker.io/istio/proxyv2:1.11.0
        name: istio-init
        resources:
          requests:
            cpu: 200m
            memory: 500Mi
          limits:
            cpu: 500m
            memory: 1Gi
        args:
        - istio-iptables
        # Outbound port
        - -p
        - "15001"
        # Inbound port
        - -z
        - "15006"
        - -u
        - "1337"
        - -m
        - REDIRECT
        - -i
        - "*"
        - -x
        - ""
        - -b
        - "*"
        - -d
        - "15090,15021,15020"
"""
    doc = yaml.load(deployment_yaml, Loader=yaml.Loader)
    # for resource metric based hpa, resource limits and request must be defined.
    # replica 정의
    if svc.get('replicas', None):
        doc['spec']['replicas'] = svc['replicas']
    if svc.get('labels', None):
        doc['metadata']['labels'].update(svc['labels'])
        doc['spec']['template']['metadata']['labels'].update(svc['labels'])
        doc['spec']['selector']['matchLabels'].update(svc['labels'])
    ports = []
    # container 정의
    for c_idx, c in enumerate(svc.get('containers', [])):
        container = {
            "name": name if c_idx == 0 else name + str(c_idx),  # get_name(c["image"])
            "image": c["image"],
            "resources": {
                "requests": {"cpu": "200m", "memory": "500Mi"},
                "limits": {"cpu": "500m", "memory": "1Gi"}
            }
        }
        # port 정의
        if c.get("ports", None):
            container["ports"] = []
            for port in c["ports"]:
                container["ports"].append({
                    "containerPort": port["containerPort"],
                    "name": port["protocol"].lower() + "-" + str(port["containerPort"]),
                    "protocol": port["protocol"]
                })
                ports.append(port)
        # resource 정의
        if c.get('resources', None):
            con_res = container['resources']
            if c['resources'].get('acceleration', None):
                acceleration = c['resources']['acceleration']
                a_network = acceleration.get('network', None)
                a_compute = acceleration.get('compute', None)
                if acceleration.get('topologyAware', False):
                    doc['spec']['template']['spec']['nodeSelector'] = {'gse-resalloc': 'numa'}
                    if c['resources'].get('limits', None):
                        con_res['limits'] = c['resources']['limits']
                    else:
                        con_res['limits'] = {"cpu": "1", "memory": "500Mi"}
                if a_compute:
                    if a_compute.get('gpu', None):
                        a_gpu = 'nvidia.com/gpu'
                        con_res['limits'][a_gpu] = a_compute['gpu']
                    # if a_compute.get('fpga', None):
                    #     con_res['limits'][''] = a_compute['fpga']
                    # if a_compute.get('aix', None):
                    #     con_res['limits'][''] = a_compute['aix']
                # if a_network:
                #     if a_network.get('sriov', None):
                #         a_sriov = 'broadcom.inc/broadcom_sriov_netdevice'
                #         con_res['limits'][a_sriov] = a_network['sriov']
                #     if a_network.get('rdma', None):
                #         a_rdma = ''
                #         con_res['limits'][a_rdma] = a_network['rdma']
                con_res['requests'] = con_res['limits']
            else:
                if c['resources'].get('requests', None):
                    con_res['requests'] = c['resources']['requests']
                if c['resources'].get('limits', None):
                    con_res['limits'] = c['resources']['limits']

        # command, args, env 정의
        if c.get('command', None) and type(c['command']) is list:
            container['command'] = c['command']
        if c.get('args', None) and type(c['args']) is list:
            container['args'] = c['args']
        if c.get('env', None) and type(c['env']) is list:
            container['env'] = c['env']

        doc['spec']['template']['spec']['containers'].append(container)
    if len(service_routes) > 0:
        sidecar = gen_sidecar_container(namespace, name, ports, service_routes)
        doc['spec']['template']['spec']['containers'].append(sidecar)
        doc['spec']['template']['spec']['volumes'] = [{
            "name": "envoy-config-volume",
            "persistentVolumeClaim": {
                "claimName": "envoy-config-claim"
            }
        }]
    return doc


def parse_service(namespace, name, svc, is_micro=False):
    service_yaml = f"""
apiVersion: v1
kind: Service
metadata:
  name: {name}
  namespace: {namespace}
  labels:
    app: {name}
    service: {name}
spec:
  selector:
    app: {name}
  type: ClusterIP
  ports: []
"""
    doc = yaml.load(service_yaml, Loader=yaml.Loader)
    if svc.get("labels", None):
        doc["metadata"]["labels"].update(svc["labels"])
    # ports
    for c in svc['containers']:
        for p in c['ports']:
            port = {
                'name': str(p['containerPort']),
                'port': p['externalPort'],
                'targetPort': p['externalPort'] if is_micro else p['containerPort']
            }
            doc['spec']['ports'].append(port)

    # ports
    # if svc["type"].lower() == "loadbalancer":
    #     doc['spec']['type'] = "ClusterIP"
    # else:
    #     doc['spec']['type'] = svc['type']
    doc['spec']['type'] = svc.get('type', "ClusterIP")
    return doc


def parse_service_monitor(namespace, name, svc):
    service_monitor_yaml = f"""
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {name}
  namespace: {namespace}
spec:
  selector:
    matchLabels:
      app: {name}
  endpoints: []
"""
    doc = yaml.load(service_monitor_yaml, Loader=yaml.Loader)
    for p in svc['monitorPorts']:
        port = {
            'port': str(p)
        }
        doc['spec']['endpoints'].append(port)
    return doc


def parse_yaml_service(namespace, name, svc):
    # for deployment & service
    deployment_doc = parse_deployment(namespace, name, svc)
    service_doc = parse_service(namespace, name, svc)
    docs = [deployment_doc, service_doc]

    # for serviceMonitor
    # if "monitorPorts" in svc:
    #     docs.append(parse_service_monitor(namespace, name, svc))
    return yaml.dump_all(docs)


def parse_yaml_delete_service(namespace, name):
    temp = f"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  namespace: {namespace}
---
apiVersion: v1
kind: Service
metadata:
  name: {name}
  namespace: {namespace}
"""
#     cmd = f"kubectl get ServiceMonitor -n {namespace} -o json"
#     st, res = subprocess.getstatusoutput(cmd)
#     if st == 0:
#         obj = json.loads(res)
#         for item in obj["items"]:
#             if item["metadata"]["name"] == name:
#                 temp += f"""---
# apiVersion: monitoring.coreos.com/v1
# kind: ServiceMonitor
# metadata:
#   name: {name}
#   namespace: {namespace}
# """
    return temp
