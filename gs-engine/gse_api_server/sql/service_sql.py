insert_service_sql = """
    INSERT INTO tb_service (
           NAMESPACE
         , NAME
         , APP
         , IP
         , SERVICE_MESH
    ) VALUES (
           {namespace}
         , {name}
         , {app}
         , {ip}
         , {service_mesh}
    );
"""

update_service = """
    UPDATE tb_service SET
           APP = {app}
         , IP = {ip}
     WHERE NAMESPACE = {namespace}
       AND NAME = {name};
"""

delete_service_sql = """
    DELETE FROM tb_service
     WHERE NAMESPACE = {namespace}
       AND NAME = {name};
"""

select_empty_ip_service_list = """
    SELECT NAMESPACE
         , NAME
         , APP
         , IP
         , SERVICE_MESH
      FROM tb_service
     WHERE IP IS NULL
"""

select_service_list_sql = """
    SELECT NAMESPACE
         , NAME
         , APP
         , IP
         , SERVICE_MESH
      FROM tb_service
     WHERE SERVICE_MESH IS NOT NULL
"""

select_service_sql = """
    SELECT NAMESPACE
         , NAME
         , APP
         , IP
         , SERVICE_MESH
      FROM tb_service
     WHERE NAME = {name}
       AND NAMESPACE = {namespace};
"""