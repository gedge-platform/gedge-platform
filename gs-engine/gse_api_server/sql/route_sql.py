insert_route_sql = """
    INSERT INTO tb_route (
           INPUT_VALUE
         , OUTPUT_VALUE
         , FILTER_VALUE
         , INS_DATE
         , UPD_DATE
    ) VALUES (
           {input_value}
         , {output_value}
         , {filter_value}
         , NOW()
         , NOW()
    );
"""

select_route_list = """
    SELECT ROUTE_KEY
         , INPUT_VALUE
         , OUTPUT_VALUE
         , FILTER_VALUE
         , INS_DATE
         , UPD_DATE
      FROM tb_route
"""

select_route = """
    SELECT ROUTE_KEY
         , INPUT_VALUE
         , OUTPUT_VALUE
         , FILTER_VALUE
         , INS_DATE
         , UPD_DATE
      FROM tb_route
     WHERE INPUT_VALUE = {input_value}
"""

update_route = """
    UPDATE tb_route SET
           INPUT_VALUE = {input_value}
         , OUTPUT_VALUE = {output_value}
         , FILTER_VALUE = {filter_value}
     WHERE ROUTE_KEY = {route_key};
"""

delete_route_sql = """
    DELETE FROM tb_route
     WHERE INPUT_VALUE = {input_value};
"""