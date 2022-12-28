
function svc_detail_get_callback(result, status_code) {
    const svc_name_input = document.getElementById("svc_name");
    const svc_type_input = document.getElementById("svc_type");
    const svc_cluster_name_input = document.getElementById("svc_cluster_name");
    const svc_ports_input = document.getElementById("svc_ports");
    const svc_cluster_ip_input = document.getElementById("svc_cluster_ip");
    const svc_external_ip_input = document.getElementById("svc_external_iP");

    if (status_code == SUCCESS_CODE) {
        svc_name_input.textContent = result['service_name'];
        svc_type_input.textContent = result['service_type'];
        svc_cluster_name_input.textContent = result['cluster_name'];
        svc_ports_input.textContent = result['service_ports'];
        svc_cluster_ip_input.textContent = result['cluster_ip'];
        svc_external_ip_input.textContent = result['external_ip'];
    }
}

function svc_list_click_event(event, element) {
    const client = new RestClientManager(null, svc_detail_get_callback);
    
    const cluster_name = element.getAttribute("data_value");
    const svc_name = element.textContent;
    
    client.send_request("GET", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/service/' + svc_name);
}

function ms_detail_get_callback(result, status_code) {
    const ms_name_input = document.getElementById("ms_datail_pod_name");
    const ms_node_name_input = document.getElementById("ms_detail_node_name");
    const ms_cluster_name_input = document.getElementById("ms_detail_cluster_name");
    const cpu_limit = document.getElementById("ms_detail_computing_resource_cpu_limit_input");
    const cpu_request = document.getElementById("ms_detail_computing_resource_cpu_request_input");
    const mem_limit = document.getElementById("ms_detail_computing_resource_memory_limit_input");
    const mem_request = document.getElementById("ms_detail_computing_resource_memory_request_input");
    const gpu_limit = document.getElementById("ms_detail_computing_resource_gpu_limit_input");
    const gpu_request = document.getElementById("ms_detail_computing_resource_gpu_request_input");
    const ms_log_input = document.getElementById("ms_detail_pod_log_box_data_textarea");
    

    if (status_code == SUCCESS_CODE) {
        const pod_resource = result['pod_resource'];

        ms_name_input.textContent = result['pod_name'];
        ms_node_name_input.textContent = result['pod_node'];
        ms_cluster_name_input.textContent = result['cluster_name'];
        cpu_limit.textContent = pod_resource['cpu']['limits'];
        cpu_request.textContent = pod_resource['cpu']['requests'];
        mem_limit.textContent = pod_resource['mem']['limits'];
        mem_request.textContent = pod_resource['mem']['requests'];
        gpu_limit.textContent = pod_resource['gpu']['limits'];
        gpu_request.textContent = pod_resource['gpu']['requests'];

        const pod_log = result['pod_log']
        if (pod_log) {
            ms_log_input.value = pod_log;
        }
        else {
            ms_log_input.value = '';
        }
    }
    
}
function ms_list_click_event(event, element) {
    const client = new RestClientManager(null, ms_detail_get_callback);

    const cluster_name = element.getAttribute("data_value");
    const pod_name = element.textContent;
    
    client.send_request("GET", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/ms/' + pod_name);
}

function ms_detail_delete_callback(result, status_code) {
    if (status_code == SUCCESS_CODE){
        display_modal("delete_modal", "hide");
        location.reload();
    }
    else {
        console.error(result['msg'])
    }
}

function ms_delete_click_event(event, element) {
    const modal_cluster_name_element = document.getElementsByClassName("ms_detail_modal_main_pod_name_text")[0];
    const cluster_name = document.getElementById("ms_detail_cluster_name").textContent;
    const pod_name = document.getElementById("ms_datail_pod_name").textContent;

    if (!pod_name || !cluster_name) {
        alert("Pod 선택 후 삭제가 가능합니다.");
        return;
    }

    modal_cluster_name_element.textContent = pod_name;
    
    const modal_data = {
        "callback": delete_modal_confirm_button_click_event,
    };
    
    display_modal("delete_modal", "show", [], modal_data);
}

function delete_modal_confirm_button_click_event() {
    const client = new RestClientManager(null, ms_detail_delete_callback);

    const cluster_name = document.getElementById("ms_detail_cluster_name").textContent;
    const pod_name = document.getElementById("ms_datail_pod_name").textContent;

    client.send_request("DELETE", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/ms/' + pod_name)
}

function svc_detail_delete_callback(result, status_code) {
    if (status_code == SUCCESS_CODE){
        display_modal("delete_svc_modal", "hide");
        location.reload();
    }
    else {
        console.error(result['msg'])
    }
}

function svc_delete_modal_confirm_button_click_event() {
    const client = new RestClientManager(null, svc_detail_delete_callback);

    const cluster_name = document.getElementById("svc_cluster_name").textContent;
    const service_name = document.getElementById("svc_name").textContent;

    client.send_request("DELETE", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/service/' + service_name)
}

function svc_delete_click_event(event, element) {
    const modal_cluster_name_element = document.getElementsByClassName("ms_detail_modal_main_svc_name_text")[0];
    const cluster_name = document.getElementById("svc_cluster_name").textContent;
    const service_name = document.getElementById("svc_name").textContent;

    if (!service_name || !cluster_name) {
        alert("Service 선택 후 삭제가 가능합니다.");
        return;
    }

    modal_cluster_name_element.textContent = service_name;
    
    const modal_data = {
        "callback": svc_delete_modal_confirm_button_click_event,
    };
    
    display_modal("delete_svc_modal", "show", [], modal_data);
}