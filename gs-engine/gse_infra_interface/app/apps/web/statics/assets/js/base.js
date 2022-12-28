

function logout_request_callback(result, status_code) {
    move_to_page(LOGIN_URL);
}

function on_click_logout() {
    const client = new RestClientManager(null, logout_request_callback);
    client.send_request("POST", REQUEST_LOGOUT_URL);
}


function on_click_multi_cluster_list() {
    move_to_page(MULTI_CLUSTER_LIST_URL);
}

function on_click_multi_cluster_add() {
    move_to_page(MULTI_CLUSTER_ADD_URL);
}

function on_click_micro_service_detail() {
    move_to_page(MICRO_SERVICE_DETAIL_URL);
}

function on_click_micro_service_add() {
    move_to_page(MICRO_SERVICE_ADD_URL);
}

function on_click_multi_cluster_detail() {
    move_to_page(MULTI_CLUSTER_DETAIL_URL);
}