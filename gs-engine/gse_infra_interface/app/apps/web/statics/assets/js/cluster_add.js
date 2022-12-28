document.addEventListener("DOMContentLoaded", on_cluster_page_show_event)

function on_cluster_page_show_event() {
    cloned_node_ip_textbox_elements = $("#cluster_add_worker_node_info_ip_input").clone();
}

function cluster_add_callback(result, status_code) {
    if(status_code == CREATE_CODE) {
        alert("클러스터가 추가되었습니다.");
    }
    else if(status_code == EXIST_CODE) {
        alert(result['msg']);
    }
    else if(status_code == NOTCONNECTED) {
        alert("Kubernetes API 연결이 실패했습니다.");
    }
    else {
        console.error(result['error']);
        alert("등록에 실패했습니다.");
    } 
}

function cluster_add_btn_click_event() {
    const client = new RestClientManager("cluster_add_form", cluster_add_callback);

    const node_list = document.getElementsByClassName("node_ip_input");
    const master_ip = document.getElementById("cluster_add_master_node_info_ip_input");

    if(!ValidateIPaddress(master_ip.value)) {
        alert("Master IP 입력 오류");
        return;
    }

    const node_ips = [];
    for(let i=0; i < node_list.length; i++) {
        if(node_list[i].value){
            if(!ValidateIPaddress(node_list[i].value)) {
                alert("Node IP 입력 오류");
                return;
            }
            node_ips.push(node_list[i].value);
        }
    };
    client.set_param("node_ips", node_ips);
    client.send_request("POST", REQUEST_MULTI_CLUSTER_ADD_URL);
}

function cluster_init_type_click_event(element) {
    const api_key_box = document.getElementById("cluster_add_node_info_apikey_input");

    if (element.value == "init") {
        api_key_box.disabled = 'true';
        api_key_box.value = '';
    }
    else {
        api_key_box.disabled = null;
    }

}

function node_ip_add_btn_click_event() {
    const cloned_ip_textbox = cloned_node_ip_textbox_elements.clone();
    $(".cluster_add_box_data_inputs").append(cloned_ip_textbox);
}

function node_ip_del_btn_click_event() {
    const ip_textbox_list = document.getElementsByClassName('cluster_add_box_data_inputs')[0];
    if(ip_textbox_list.childElementCount == 1){
        return;
    }
    else {
        ip_textbox_list.lastChild.remove();
    }
}