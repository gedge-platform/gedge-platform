from kubernetes import config, client

config.load_kube_config()
v1 = client.CoreV1Api()
ret = v1.list_pod_for_all_namespaces()
for po in ret.items:
    print(po.metadata.name, po.status.pod_ip, po.status.phase)

current_ip_list = list(
    map(
        lambda po: {
            "pod_name": po.metadata.name,
            "pod_ip": po.status.pod_ip,
            "phase": po.status.phase,
        },
        ret.items,
    )
)
print(current_ip_list)
