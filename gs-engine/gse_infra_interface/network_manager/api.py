from apps.common.api_wrapper import ApiWrapper

class NicApi(ApiWrapper):
    def __init__(self):
        super(NicApi, self).__init__(api_url='/apis/k8s.cni.cncf.io/v1',kind='network-attachment-definitions')

    def read_namespaced_nic(self, name, namespace, **kwargs):
        return self.read_namespaced_obj(name, namespace, **kwargs)

    def list_namespaced_nic(self, namespace, **kwargs):
        return self.list_namespaced_obj(namespace, **kwargs)

    def create_namespaced_nic(self, namespace, body, **kwargs):
        return self.create_namespaced_obj(namespace, body, **kwargs)

    def delete_namespaced_nic(self, name, namespace, **kwargs):
        return self.delete_namespaced_obj(name, namespace, **kwargs)

    def delete_collection_namespaced_nic(self, namespace, **kwargs):
        return self.delete_collection_namespaced_obj(namespace, **kwargs)

class CiliumPlcyApi(ApiWrapper):
    def __init__(self):
        super(CiliumPlcyApi, self).__init__(api_url='/apis/cilium.io/v2',kind='ciliumnetworkpolicies')

    def read_namespaced_plcy(self, name, namespace, **kwargs):
        return self.read_namespaced_obj(name, namespace, **kwargs)

    def list_namespaced_plcy(self, namespace, **kwargs):
        return self.list_namespaced_obj(namespace, **kwargs)

    def create_namespaced_plcy(self, namespace, body, **kwargs):
        return self.create_namespaced_obj(namespace, body, **kwargs)

    def delete_namespaced_plcy(self, name, namespace, **kwargs):
        return self.delete_namespaced_obj(name, namespace, **kwargs)

    def delete_collection_namespaced_plcy(self, namespace, **kwargs):
        return self.delete_collection_namespaced_obj(namespace, **kwargs)