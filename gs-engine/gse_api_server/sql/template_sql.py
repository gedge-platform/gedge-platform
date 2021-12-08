insert_template_sql = """
    INSERT INTO tb_template (
           NAME
         , SERVICE
    ) VALUES (
           {name}
         , {service}
    )
"""

select_template_list_sql = """
    SELECT NAME
         , SERVICE 
      FROM tb_template
"""

select_template_sql = """
    SELECT SERVICE
      FROM tb_template
     WHERE NAME = {name}
"""

select_in_template_sql = """
    SELECT NAME
         , SERVICE
      FROM tb_template
     WHERE NAME in ({name})
"""

update_template_sql = """
    UPDATE tb_template
       SET SERVICE = {service}
     WHERE NAME = {name}
"""

delete_template_sql = """
    DELETE FROM tb_template
     WHERE NAME = {name}
"""