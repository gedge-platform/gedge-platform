function on_click_expand_cluster_list_element_detail(event, element){
    event.preventDefault();
    expand_element = element.getElementsByClassName("cluster_list_element_bottom_expand")[0];
    display_container(expand_element, "toggle", true);
}

function cluster_delete_callback(result, status_code) {
    
    if (status_code == SUCCESS_CODE) {
        location.reload();
    }
    else if(result['status_code'] == FAIL_CODE){
        console.error(result['msg']);
    }
}
function delete_modal_confirm_button_click_event() {
    const modal_cluster_name_element = document.getElementsByClassName("cluster_list_modal_main_cluster_name_text")[0];
    const cluster_name = modal_cluster_name_element.textContent;

    const client = new RestClientManager(null, cluster_delete_callback);
    client.send_request("DELETE", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name);
    display_modal("delete_modal","hide");
}

function on_click_delete_cluster(event, element) {
    event.stopPropagation();
    const cluster_name = element.getAttribute("value");
    const modal_cluster_name_element = document.getElementsByClassName("cluster_list_modal_main_cluster_name_text")[0];
    modal_cluster_name_element.textContent = cluster_name;
    
    const modal_data = {
        "callback": delete_modal_confirm_button_click_event,
    };
    
    display_modal("delete_modal", "show", [], modal_data);
}

function on_click_move_kiali(event, element){
    event.stopPropagation();
    const kiali_ip = element.getAttribute("data_value");
    const kiali_url = "http://" + kiali_ip + ":20001";
    window.open(kiali_url,"Cluster_Kiali");
}

function cluster_reset_callback(result, status_code){
    if (status_code == SUCCESS_CODE) {
        location.reload();
    }
    else {
        console.error(result['msg']);
    }
}

function reset_modal_confirm_button_click_event() {
    const client = new RestClientManager(null, cluster_reset_callback);
    client.send_request("DELETE", REQUEST_MULTI_CLUSTER_ADD_URL);
    display_modal("reset_modal","hide");
}

function on_click_reset_all(event, element){
    const modal_data = {
        "callback": reset_modal_confirm_button_click_event
    };
    display_modal("reset_modal", "show", [], modal_data);
}