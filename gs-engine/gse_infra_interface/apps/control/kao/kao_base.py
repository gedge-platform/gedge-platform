"""[summary]
Module where Kubernetes Access Object Base is defined
"""
from apps.control.if_router import *
from apps.common.exceptions import Error


class KaoBaseType(type):
    """[summary]
    Define Kubernetes Access Object Type Class
    
    Args:
        type ([class]): [Type Class]
    """
    def __new__(cls, name, bases, attrs, **kwargs):
        super_new = super().__new__
        parents = [ b for b in bases if isinstance(b, KaoBaseType) ]
        if not parents:
            return super_new(cls, name, bases, attrs)
        new_class = super_new(cls, name, bases, attrs, **kwargs)
        setattr(new_class, 'router', InterfaceRouter(obj_class=new_class))
        return new_class

class KaoBase(metaclass=KaoBaseType):
    """[summary]
    Define Kubernetes Access Object Class
    Args:
        metaclass ([class], optional): [description]. Defaults to KaoBaseType.
    """
    def __init__(self, router=None, **kwargs):
        setattr(self, 'router', InterfaceRouter(obj_class=self.__class__))
        if router:
            self.router._target = router._target
            self.router._params = router._params
            self.router._link = router._link
        self.constructor = None
        self.route = None
        self.pk = None
        
    def get(self, **ft):
        """[summary]
        Define Kao get Command
        
        Returns:
            [json]: [Result Value of get Method Function]
        """
        if isinstance(self, LinkKao):
            if self.constructor:
                self.router.target(self.constructor.router._target)
                ft_data = { 'pk': self.pk }
                ft_data.update(ft)
            return self.router.get(**ft_data)
        return None
        
    def list(self, **ft):
        """[summary]
        Define Kao list Command
        
        Returns:
            [dict]: [Result Value of list Method Function]
        """
        if isinstance(self, LinkListKao):
            if self.constructor:
                self.router.target(self.constructor.router._target)
            return self.router.list(**ft)
        return None

    def create(self, **data):
        """[summary]
        Define Kao create Command
        
        Returns:
            [json]: [Result Value of create Method Function]
        """
        if isinstance(self, LinkKao) or isinstance(self, LinkListKao):
            raise Error('LinkKao or LinkListKao cannot create.', 500)
        return self.router.create(self, **data)
    
    def delete(self, **ft):
        """[summary]
        Define Kao delete Command
        
        Returns:
            [json]: [Result Value of delete Method Function]
        """
        if isinstance(self, LinkKao) or isinstance(self, LinkListKao):
            raise Error('LinkKao or LinkListKao cannot delete.', 500)
        return self.router.delete(self, **ft)


class LinkListKao(KaoBase):
    """[summary]
    Define Link List Kubernetes Access Object Class
    
    Args:
        KaoBase ([class]): [Class KaoBase inheritance]
    """
    def __init__(self, constructor, obj_class_name=None, **kwargs):
        if kwargs == None:
            kwargs = {}
        if obj_class_name:
            obj_class_name = obj_class_name + 'Kao'

        get_obj_class = getattr(sys.modules['apps.control.kao'], 'get_obj_class')
        obj_class = get_obj_class(obj_class_name)
        self.constructor = constructor
        self.link = kwargs.get('link', {})
        self.params = kwargs.get('params', {})
        setattr(self, 'router', InterfaceRouter(obj_class=obj_class))
        self.router = self.router.link(**self.link)
        self.router = self.router.params(**self.params)
        self.router = self.router.target(KUBERNETES)

    
class LinkKao(KaoBase):
    """[summary]
    Define Link Kubernetes Access Object Class
    
    Args:
        KaoBase ([class]): [Class KaoBase inheritance]
    """
    def __init__(self, constructor, obj_class_name=None, **kwargs):
        if kwargs == None:
            kwargs = {}
        if obj_class_name:
            obj_class_name = obj_class_name + 'Kao'

        get_obj_class = getattr(sys.modules['apps.control.kao'], 'get_obj_class')
        obj_class = get_obj_class(obj_class_name)
        self.constructor = constructor
        self.pk = kwargs.get('pk', None)
        self.link = kwargs.get('link', {})
        self.params = kwargs.get('params', {})
        setattr(self, 'router', InterfaceRouter(obj_class=obj_class))
        self.router = self.router.link(**self.link)
        self.router = self.router.params(**self.params)
        self.router = self.router.target(KUBERNETES)