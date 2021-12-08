insert_service_mesh_sql = """
    INSERT INTO tb_service_mesh (
           NAMESPACE
         , NAME
         , SERVICES
         , SERVICE_HOSTS
         , SERVICE_ROUTES
    ) VALUES (
           {namespace}
         , {name}
         , {services}
         , {serviceHosts}
         , {serviceRoutes}
    );
"""

update_service_mesh = """
    UPDATE tb_service_mesh SET
           SERVICES = {services}
     WHERE NAMESPACE = {namespace}
       AND NAME = {name};
"""

delete_service_mesh_sql = """
    DELETE FROM tb_service_mesh
     WHERE NAMESPACE = {namespace}
       AND NAME = {name};
"""

select_service_mesh_list_sql = """
    SELECT NAMESPACE
         , NAME
         , SERVICES
         , SERVICE_HOSTS
         , SERVICE_ROUTES
      FROM tb_service_mesh
"""

select_service_mesh_list_by_namespace_sql = """
    SELECT NAMESPACE
         , NAME
         , SERVICES
         , SERVICE_HOSTS
         , SERVICE_ROUTES
      FROM tb_service_mesh
"""

select_service_mesh_list_by_namespace_and_name_sql = """
    SELECT NAMESPACE
         , NAME
         , SERVICES
         , SERVICE_HOSTS
         , SERVICE_ROUTES
      FROM tb_service_mesh
     WHERE NAMESPACE = {namespace}
       AND NAME = {name}
"""

select_service_mesh_sql = """
    SELECT SERVICES
         , SERVICE_HOSTS
         , SERVICE_ROUTES
      FROM tb_service_mesh
     WHERE NAMESPACE = {namespace}
       AND NAME = {name}
"""