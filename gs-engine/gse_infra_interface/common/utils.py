import paramiko, json
from kubernetes import client, config
from . import static_value

def init_kubernetes():
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
        configuration = client.Configuration()
        configuration.api_key['authorization'] = kubeconfig['acc_key']
        configuration.verify_ssl = kubeconfig['verify_ssl']
        configuration.host = kubeconfig['host']
        client.Configuration.set_default(configuration)

def make_json_data(convert_data, form_data,json_format):
    for key, value in json_format.items():
        if isinstance(value, dict):
            obj = make_json_data({},form_data, value)
            if obj:
                convert_data[key] = obj
        elif isinstance(value, list):
            idx = 0
            convert_data[key]=[]
            for temp in value:
                if isinstance(temp, str):
                    convert_data[key].append(temp)
                else:
                    convert_data[key].append(make_json_data({},form_data,temp))
        else:
            if value in form_data:
                if form_data[value]:
                    convert_data[key] = form_data[value]
            else:
                convert_data[key] = json_format[key]
    return convert_data
