"""[summary]
Kubernetes Interface Module
"""
from kubernetes import config, client
from kubernetes.client.api_client import ApiClient



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


