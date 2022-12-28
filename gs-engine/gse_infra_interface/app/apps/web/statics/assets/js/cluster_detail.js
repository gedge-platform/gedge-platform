function add_strgclass_dropdown_menu(strgclass_data) {
    for(let i = 0; i<strgclass_data.length; i++) {
        const strgclass_name = strgclass_data[i]['strgclass_name'];

        const tag = 
        '<li>' + 
        '<a class="dropdown-item" href="#" onclick="set_dropdown_item_value(\'pvc_strgclass_dropdown\', this)" value="' + strgclass_name + '">' + strgclass_name + '</a>' +
        '</li>'

        $("#pvc_strgclass_dropdown_menu").append(tag);
    }
}

function render_pvc_list(pvc_data) {
    for(let i = 0; i<pvc_data.length; i++) {
        if(!pvc_data[i]['pvc_status'] != "Pending") {
            const pvc_name = pvc_data[i]['pvc_name'];
            const pvc_size = pvc_data[i]['pvc_size'];
            const strgclass_name = pvc_data[i]['strgclass_name'];

            const tag = 
            '<tr class="none_tr"></tr>'+
            '<tr>'+ 
            '<td class="table_cell_left_radius table_check">'+
            '<div class="form-check d-flex align-items-center justify-content-center common_checkbox_container">'+
            '<input type="radio" class="form-check-input d-none common_checkbox_input" id="'+pvc_name+'" name="pvc_name_radio" onchange="select_pvc(this,\''+pvc_name+'\')"/>'+
            '<label class="form-check-label common_checkbox_label" for="'+pvc_name+'"></label>' +
            '</div>' + 
            '</td>' +
            '<td class="table_td_text" style="width: 200px;">'+pvc_name+'</td>'+
            '<td class="table_td_text" style="width: 200px;">'+pvc_size+'</td>'+
            '<td class="table_td_text table_cell_right_radius" style="width: 200px;">'+strgclass_name+'</td>'

            $("#pvc_list_tbody").append(tag)
        }
    }
}

function select_pvc(self, pvc_name){
    const select_pvc_div = document.getElementById("select_pvc_name");

    if(self.checked){
        select_pvc_div.value = pvc_name
    }
}

function render_cni_list(cni_data) {
    for(let i = 0 ; i < cni_data.length ; i++) {
        const cni_name = cni_data[i]['cni_name'];
        const cni_type = cni_data[i]['cni_config']['ipam']['type'];
        let cni_ip_range = cni_data[i]['cni_config']['ipam']['range'];
        if (!cni_ip_range) {
            cni_ip_range = cni_data[i]['cni_config']['ipam']['subnet'];
        }
        let cni_plugin_name = null;

        if (cni_data[i]['cni_config']['cniVersion'] == '0.3.0') {
            cni_plugin_name = "Multus"
        }
        else {
            cni_plugin_name = "SR-IOV"
        }
        const tag = 
            '<tr class="none_tr"></tr>'+
            '<tr>'+ 
            '<td class="table_cell_left_radius table_check">'+
            '<div class="form-check d-flex align-items-center justify-content-center common_checkbox_container">'+
            '<input type="radio" class="form-check-input d-none common_checkbox_input" id="'+cni_name+'" name="cni_name_radio" onchange="select_nic(this,\''+cni_plugin_name+'\',\''+cni_name+'\')"/>'+
            '<label class="form-check-label common_checkbox_label" for="'+cni_name+'"></label>' +
            '</div>' + 
            '</td>' +
            '<td class="table_td_text" style="width: 80px;">'+cni_plugin_name+'</td>'+
            '<td class="table_td_text" style="width: 210px;">'+cni_name+'</td>'+
            '<td class="table_td_text" style="width: 150px;">'+cni_type+'</td>'+
            '<td class="table_td_text table_cell_right_radius" style="width: 152px;">'+cni_ip_range+'</td>'

        $("#nic_list_tbody").append(tag)
    }
}

function select_nic(self, plugin_nm, nic_nm){
    const select_cni_name = document.getElementById("select_cni_name");
    const select_cni_type = document.getElementById("select_cni_type");

    if(self.checked){
        select_cni_name.value = nic_nm;
        select_cni_type.value = plugin_nm;
    }
}

function cluster_resource_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        const cni = result['cni'];
        render_cni_list(cni);

        const pvc = result['pvc'];
        render_pvc_list(pvc);

        const strgclass = result['strgclass'];
        add_strgclass_dropdown_menu(strgclass);
    }
}

function cluster_detail_dropdown_menu_item_click_event(event, item) {
    set_dropdown_item_value("select_cluster_dropdown", item);
    event.preventDefault();

    const cluster_name = item.getAttribute("value");
    const client = new RestClientManager(null, cluster_resource_callback);

    client.send_request("GET", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name)
}

function pvc_delete_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        alert("선택된 PVC가 삭제되었습니다. 페이지가 새로고침 됩니다.");
        location.reload();
    }
}

function del_pvc() {
    const cluster_name = document.getElementsByClassName("select_cluster_dropdown")[0].value;
    if (!cluster_name) {
        alert("클러스터를 선택해주세요.");
        return;
    }
    const client = new RestClientManager(null, pvc_delete_callback);

    const select_pvc_name = document.getElementById("select_pvc_name").value;
    if (!select_pvc_name) {
        alert("PVC를 선택해주세요.");
        return;
    }
    const del_yn = confirm(select_pvc_name + " PVC를 삭제 하시겠습니까?");
    if(del_yn) {
        client.send_request("DELETE", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/pvc/' + select_pvc_name);
    }
}

function pvc_create_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        alert("PVC가 생성 되었습니다.");
        location.reload();
    }
}
function create_pvc() {
    const cluster_name = document.getElementsByClassName("select_cluster_dropdown")[0].value;

    if (!cluster_name) {
        alert("클러스터를 선택해주세요.");
        return;
    }

    const client = new RestClientManager("create_pvc_form", pvc_create_callback);
    
    client.set_param("cluster_name", cluster_name);
    client.send_request("POST", REQUEST_PVC_ADD_URL);
}

function cni_delete_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        alert("CNI가 삭제 되었습니다. 페이지 새로고침 합니다.");
        location.reload();
    }
}

function del_nic(){
    const cluster_name = document.getElementsByClassName("select_cluster_dropdown")[0].value;
    if (!cluster_name) {
        alert("클러스터를 선택해주세요.");
        return;
    }
    const client = new RestClientManager(null, cni_delete_callback);

    const select_cni_name = document.getElementById("select_cni_name").value;
    if (!select_cni_name) {
        alert("CNI를 선택해주세요.");
        return;
    }
    const del_yn = confirm(select_cni_name + " CNI를 삭제 하시겠습니까?");
    if(del_yn) {
        client.send_request("DELETE", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name + '/cni/' + select_cni_name);
    }
}

function cni_create_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        alert("CNI가 생성 되었습니다. 페이지 새로고침합니다.");
        location.reload();
    }
}
function create_nic() {
    const cluster_name = document.getElementsByClassName("select_cluster_dropdown")[0].value;
    
    if (!cluster_name) {
        alert("클러스터를 선택해주세요.");
        return;
    }
    const client = new RestClientManager("create_nic_form", cni_create_callback);
    
    client.set_param("cluster_name", cluster_name);
    client.send_request("POST", REQUEST_CNI_ADD_URL);
}
