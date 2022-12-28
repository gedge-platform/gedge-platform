"""
Command InterFace Router Module
"""
from apps.common.exceptions import Error
from apps.common.database import *
from apps.common.statics import *
from apps.common.utils import *

from apps.control.if_kubernetes import KubernetesInterface
from apps.control.kubernetes_controller import if_node
from apps.control.kubernetes_controller import if_pod
from apps.control.kubernetes_controller import if_service
from apps.control.kubernetes_controller import if_cni
from apps.control.kubernetes_controller import if_pvc
from apps.control.kubernetes_controller import if_storageclass
from apps.control.kubernetes_controller import if_configmap

class InterfaceRouter:
    """[summary]
    define InterFaceRoute Class
    """
    def __new__(cls, *args, **kwargs):
        """
        New InterfaceRouter Function

        Returns:
            _type_: _description_
        """
        obj = super().__new__(cls)
        obj._constructor_args = (args, kwargs)
        return obj

    def __init__(self, obj_class=None, using=None, params={}, link={}):
        """
        Init InterfaceRouter Function

        Args:
            obj_class (_type_, optional): _description_. Defaults to None.
            using (_type_, optional): _description_. Defaults to None.
            params (dict, optional): _description_. Defaults to {}.
            link (dict, optional): _description_. Defaults to {}.
        """
        super().__init__()
        self._obj_class = obj_class
        self._target = using
        self._params = params
        self._link = link


    def _clone(self):
        """
        Clone InterfaceRouter class
        
        Returns:
            [InterfaceRouter]: [Clone self Class]
        """
        return self.__class__(obj_class=self._obj_class, using=self._target, params=self._params)

    def using(self, target):
        """
        Define InterFaceRouter using command

        Args:
            target ([obj]): [Target data]

        Returns:
            [InterfaceRouter]: [Clone InterfaceRouter Class Data]
        """
        clone = self._clone()
        cluster = DB()[CLUSTER_COLLECTION].find_one({'_id': target })
        if not cluster:
            raise Error('해당 클러스터가 없습니다.', 400)
        clone._target = KubernetesInterface(
            cluster.get('clu_data').get('clu_ip'), cluster.get('clu_data').get('api_key'))
        return clone

    def params(self, **params):
        """
        Set params variable in Clone InterfaceRouter Class
        
        Returns:
            [InterfaceRouter]: [Clone InterfaceRouter Class Data]
        """
        clone = self._clone()
        clone._params = params
        return clone

    def link(self, **link):
        """
        Set link variable in Clone InterfaceRouter Class
        
        Returns:
            [InterfaceRouter]: [Clone InterfaceRouter Class Data]
        """
        if link == {}:
            self._link = {}
            return self

        clone = self._clone()
        _link = {}
        for k, v in link.items():
            if v:
                _link[k] = v

        clone._link = _link if len(_link) > 0 else {}
        return clone

    def obj(self, obj_class):
        """
        Set obj_class variable to self._obj_class
        
        Args:
            obj_class ([obj_class]): [set obj_class data]
        """
        self._obj_class = obj_class

    def _execute(self):
        """[summary]
        Get Interface Name
        
        Returns:
            [string]: [Interface Name Text]
        """
        interface_name = self._obj_class.__name__
        if self._target is None:
            raise Error('Invalid target of this interface', 500)

        return interface_name
    

    def list(self, **ft):
        """[summary]
        Define List command

        Returns:
            [dict]: [Result Value of list Command function]
        """
        interface_name = self._execute()
        result = getattr(self._target, f'{interface_name}_list'.lower())(link=copy.copy(self._link), **ft)
        if not result or not result.get('result'):
            raise result.get('exc')
        response_list = []
        result_list = result.get('response')
        for result in result_list:
            new_obj = self._obj_class(self, **result)
            response_list.append(new_obj)
        return response_list
    
    def all(self, **ft):
        """[summary]
        Define List command

        Returns:
            [dict]: [Result Value of list Command function]
        """
        interface_name = self._execute()
        result = getattr(self._target, f'{interface_name}_list'.lower())(link=copy.copy(self._link), **ft)
        if not result or not result.get('result'):
            raise result.get('exc')
        
        result_list = result.get('response')
        return result_list
    
    def get(self, **ft):
        """[summary]
        Define get command

        Returns:
            [json]: [Result Value of get Command function]
        """
        interface_name = self._execute()
        result = getattr(self._target, f'{interface_name}_get'.lower())(link=copy.copy(self._link), **ft)
        if not result or not result.get('result'):
            raise result.get('exc')
        result_data = result.get('response')
        # new_obj = self._obj_class(self, **result.get('response'))
        return result_data

    def create(self, **data):
        """[summary]
        Define create command

        Returns:
            [json]: [Result Value of create Command function]
        """
        interface_name = self._execute()
        arguments = copy.copy(self._params)
        arguments.update(data)
        result = getattr(
            self._target, f'{interface_name}_create'.lower())(link=copy.copy(self._link), **arguments)
        if not result or not result.get('result'):
            raise result.get('exc')
        result_data = result.get('response')
        # new_obj = self._obj_class(self, **result.get('response'))
        return result_data

    def update(self, obj, **data):
        """[summary]
        Define update command

        Returns:
            [json]: [Result Value of update Command function]
        """
        interface_name = self._execute()
        arguments = copy.copy(self._params)
        arguments.update(data)
        result = getattr(
            self._target, f'{interface_name}_update'.lower())(link=copy.copy(self._link), obj=obj, **arguments)
        if not result or not result.get('result'):
            raise result.get('exc')
        new_obj = self._obj_class(self, **result.get('response'))
        return new_obj


    def delete(self, **ft):
        """[summary]
        Define delete command

        Returns:
            [bool]: [Result Value of delete Command function]
        """
        interface_name = self._execute()
        result = getattr(self._target, f'{interface_name}_delete'.lower())(link=copy.copy(self._link), **ft)
        if not result or not result.get('result'):
            raise result.get('exc')
        return True

    def command(self, cmd, obj=None, resp_obj_class=None, **data):
        """[summary]
        Define command base

        Returns:
            [string]: [Result Value of Command name]
        """
        interface_name = self._execute()
        arguments = copy.copy(self._params)
        arguments.update(data)
        result = getattr(
            self._target, f'{interface_name}_{cmd}'.lower())(link=copy.copy(self._link), obj=obj, **arguments)
        if not result or not result.get('result'):
            raise result.get('exc')
        if result.get('response'):
            if type(result.get('response')) == dict:
                new_obj = resp_obj_class(**result.get('response'))
                return new_obj
            elif type(result.get('response')) == list:
                response_list = []
                result_list = result.get('response')
                for result in result_list:
                    new_obj = resp_obj_class(self, **result)
                    response_list.append(new_obj)
                return response_list
        
        return result


    
    