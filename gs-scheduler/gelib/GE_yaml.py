import yaml

def is_multi_yaml_file(yaml_filename):
    try:
        with open(yaml_filename, 'r') as f:
            yaml_content = f.read()
            yaml_docs = list(yaml.safe_load_all(yaml_content))
            return len(yaml_docs) > 1
    except Exception as e:
        print(f"Error: {e}")
        return False

'''-----------------------------------------
 Read yaml dic (from redis) 
 -----------------------------------------'''

def add_namespace_to_yaml_file_dic(yaml_file_dic,desired_namespace): 
    if yaml_file_dic.get('kind', '').lower() in ['pod','service','secret','deployment','persistentvolume','persistentvolumeclaim','configmap']:
        metadata = yaml_file_dic.get('metadata', {})
        metadata["namespace"] = desired_namespace
    return yaml_file_dic

def add_annotation_to_yaml_file_dic(yaml_file_dic, new_annotation_dic):
    try :
        print('1')
        #yaml_bytes_data_dic = yaml.safe_load(yaml_data)
        print('1-1',yaml_file_dic)
        if 'annotations' not in yaml_file_dic['metadata']:
            print('2')
            yaml_file_dic["metadata"]["annotations"] = {}
            print('3')
        yaml_file_dic["metadata"]["annotations"].update(new_annotation_dic)
        print('4',yaml_file_dic)
        return yaml_file_dic
    except Exception as e:
        print('Error : add_annotation_from_bytes_to_yaml',e)
        return None 
            
def add_nodeselector_to_yaml_file_dic(yaml_data_dic,node_name):
    try :
        print('1')
        if "kind" in yaml_data_dic :
            print('2')
            if yaml_data_dic['kind'] == "Pod":
                print('3')
                yaml_data_dic["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
                print('4')
            elif yaml_data_dic['kind'] == "Deployment" or yaml_data_dic['kind'] == "StatefulSet" or yaml_data_dic['kind'] == "DaemonSet" or \
                yaml_data_dic['kind'] == "CronJob" or yaml_data_dic['kind'] == "Job":
                print('5')
                if "spec" in yaml_data_dic.get("template", {}):
                    print('6')
                    yaml_data_dic["template"]["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
                    print('7')
                else:
                    print('8')
                    yaml_data_dic["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
                    print('9')
            print('10',yaml_data_dic)        
            return yaml_data_dic
        else:
            print('11')
            return None
    except Exception as e:
        print('Error : assign_node_from_bytes_to_yaml',e)
        return None
 
'''-----------------------------------------
  Read Yaml dic  From yaml file 
 -----------------------------------------'''
    
def add_annotation_to_yaml_file(resource_yaml,new_annotation_dic, modified_yaml):
    
    try :
        with open(resource_yaml, "r") as yaml_file:
            yaml_data = yaml.safe_load(yaml_file)
            
        if "annotations" not in yaml_data["metadata"]:
            yaml_data["metadata"]["annotations"] = {}
        yaml_data["metadata"]["annotations"].update(new_annotation_dic)
        with open(modified_yaml, "w") as modified_file:
            yaml.dump(yaml_data, modified_file, default_flow_style=False)
    except Exception as e:
        print('Error : add_annotation_to_yaml',e)
        
def add_nodeselector_to_yaml_file(resource_yaml,node_name,modified_resource_yaml):
    try :
        with open(resource_yaml, "r") as yaml_file:
            resource_data = yaml.safe_load(yaml_file)
        if "kind" in resource_data :
            if resource_data['kind'] == "Pod":
                resource_data["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
            elif resource_data['kind'] == "Deployment" or resource_data['kind'] == "StatefulSet" or resource_data['kind'] == "DaemonSet" or \
                resource_data['kind'] == "CronJob" or resource_data['kind'] == "Job":
                if "spec" in resource_data.get("template", {}):
                    resource_data["template"]["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
                else:
                    resource_data["spec"].setdefault("nodeSelector", {})["kubernetes.io/hostname"] = node_name
            # modified_resource_path = f"modified_{resource_kind.lower()}s/{resource_name}.yaml"
            with open(modified_resource_yaml, "w") as modified_file:
                yaml.dump(resource_data, modified_file, default_flow_style=False)
            print(f"Modified resource saved to '{modified_resource_yaml}'.")
        else:
            return None
    except Exception as e:
        print('Error : assign_node_to_yaml',e)      
            