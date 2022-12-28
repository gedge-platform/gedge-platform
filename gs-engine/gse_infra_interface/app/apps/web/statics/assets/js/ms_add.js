let select_sriov_cnt = 0;
document.addEventListener("DOMContentLoaded", on_ms_add_page_show_event)

function on_ms_add_page_show_event() {
    cloned_ports_elements = $("#ms_port_inputs").clone();
    container_info_box = $("#container_info_box").clone();
}

function render_pvc_list(pvc_data) {
    for(let i = 0; i<pvc_data.length; i++) {
        if(!pvc_data[i]['pvc_status'] != "Pending") {
            const pvc_name = pvc_data[i]['pvc_name'];
            const pvc_size = pvc_data[i]['pvc_size'];

            const tag = 
            '<tr class="none_tr"></tr>'+
            '<tr>'+ 
            '<td class="table_cell_left_radius table_check">'+
            '<div class="form-check d-flex align-items-center justify-content-center common_checkbox_container">'+
            '<input type="radio" class="form-check-input d-none common_checkbox_input" id="'+pvc_name+'" name="pvc_name_radio" onchange="select_pvc(this,\''+pvc_name+'\')"/>'+
            '<label class="form-check-label common_checkbox_label" for="'+pvc_name+'"></label>' +
            '</div>' + 
            '</td>' +
            '<td class="table_td_text" style="width: 300px;">'+pvc_name+'</td>'+
            '<td class="table_td_text table_cell_right_radius" style="width: 300px;">'+pvc_size+'</td>'

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
            '<input type="checkbox" class="form-check-input d-none common_checkbox_input" id="'+cni_name+'" onchange="select_nic(this,\''+cni_plugin_name+'\',\''+cni_name+'\')"/>'+
            '<label class="form-check-label common_checkbox_label" for="'+cni_name+'"></label>' +
            '</div>' + 
            '</td>' +
            '<td class="table_td_text" style="width: 95px;">'+cni_plugin_name+'</td>'+
            '<td class="table_td_text" style="width: 205px;">'+cni_name+'</td>'+
            '<td class="table_td_text" style="width: 150px;">'+cni_type+'</td>'+
            '<td class="table_td_text table_cell_right_radius" style="width: 177px;">'+cni_ip_range+'</td>'

        $("#nic_list_tbody").append(tag)
    }
}

function select_nic(self, plugin_nm, nic_nm){
    if(self.checked){
        $("#network_list").append(
            '<input type="hidden" class="network_list_data" id="select_'+nic_nm+'" value="'+nic_nm+'" type-value="'+plugin_nm+'">'
        )
        if(plugin_nm == 'SR-IOV'){
            const sriov_max = Number($("#alctb_sriov").text());
            
            select_sriov_cnt += 1
            if(select_sriov_cnt > sriov_max){
                alert("최대 허용 SR-IOV NIC 수를 넘어 갈 수 없습니다.");
                select_sriov_cnt -=1;
                self.checked = false;
                $("#select_"+nic_nm).remove();
                return;
            }
            $("#select_sriov_cnt").text(select_sriov_cnt);
        }
    }
    else{
        $("#select_"+nic_nm).remove();
        if(plugin_nm == 'sriov'){
            select_sriov_cnt-=1;
            $("#select_sriov_cnt").text(select_sriov_cnt);
        }
    }
}

function cluster_resource_callback(result, status_code) {
    if(status_code == SUCCESS_CODE) {
        const cpu_resource_input = document.getElementById("ms_add_computing_resource_cpu_allocatable_input");
        const mem_resource_input = document.getElementById("ms_add_computing_resource_memory_allocatable_input");
        const gpu_resource_input = document.getElementById("ms_add_computing_resource_gpu_allocatable_input");
        const sriov_resource_input = document.getElementById("alctb_sriov");

        const resource = result['resources'];
        cpu_resource_input.value = resource['cpu'];
        mem_resource_input.value = resource['mem'];
        gpu_resource_input.value = resource['gpu'];
        sriov_resource_input.textContent = resource['sriov'];

        const cni = result['cni'];
        render_cni_list(cni);

        const pvc = result['pvc']
        render_pvc_list(pvc);
    }
}

function ms_add_dropdown_menu_item_click_event(event, item){
    set_dropdown_item_value("ms_add_cluster_dropdown", item);
    event.preventDefault();

    const cluster_name = item.getAttribute("value");
    const client = new RestClientManager(null, cluster_resource_callback);

    client.send_request("GET", REQUEST_MULTI_CLUSTER_LIST_URL + '/' + cluster_name)
}

function ms_add_type_dropdown_menu_item_click_event(event, item){
    set_dropdown_item_value("ms_add_type_dropdown", item);
    event.preventDefault();
}

function service_port_type_dropdown_menu_item_click_event(event, item){
    const dropdown_item = item.closest("div").getElementsByClassName('ms_add_port_protocol_type_dropdown')[0];
    set_dropdown_item_value(dropdown_item, item);
    event.preventDefault();
}

// Pod
function ms_add_request_callback(result, status_code) {
    if (result['status_code'] == SUCCESS_CODE) {
        alert("생성에 성공했습니다.");
    }
    else{
        console.error(result['msg']);
        alert("생성 실패");
    }
}

function ms_add_request() {
    const client = new RestClientManager("ms_add_form", ms_add_request_callback);
    const cluster_name = document.getElementsByClassName("ms_add_cluster_dropdown")[0].getAttribute("data-value");
    const image_name = document.getElementById("ms_pod_image");
    const service_type = document.getElementsByClassName("ms_add_type_dropdown")[0].getAttribute("data-value");
    const network_list = document.getElementsByClassName("network_list_data")

    if (!cluster_name) {
        alert("클러스터를 선택하세요.");
        return;
    }

    if (!image_name.value) {
        alert("Image 이름을 입력하세요.")
        return;
    }

    if (service_type != '') {
        const service_port_containers = document.getElementsByClassName("service_port_container");
        const service_ports = [];
        for(let i=0; i < service_port_containers.length; i++) {
            if(service_port_containers[i]){
                service_ports.push({
                    // TODO: Container 여러개일 경우 동작하게 하기
                    "protocol": service_port_containers[i].getElementsByClassName("ms_add_port_protocol_type_dropdown")[0].getAttribute("data-value"),
                    "containerPort": service_port_containers[i].getElementsByClassName("ms_add_port_container_port")[0].value,
                    "externalPort": service_port_containers[i].getElementsByClassName("ms_add_port_external_port")[0].value,
                });
            }
        };
        client.set_param("service_ports", JSON.stringify(service_ports));
    }

    if (network_list.length > 0) {
        const network_list_data = [];
        for(let i=0; i < network_list.length; i++) {
            if(network_list[i]) {
                network_list_data.push({
                    "name": network_list[i].value,
                    "type": network_list[i].getAttribute('type-value')
                })
            }
        }
        client.set_param("cni_list", JSON.stringify(network_list_data));
    }
    
    client.send_request("POST", REQUEST_MICRO_SERVICE_ADD_URL);
}

function ms_add_click_event(event, element) {
    if(confirm("파드를 생성합니다.")) {
        ms_add_request();
    }
}

// Service
function service_add_request() {
    const client = new RestClientManager("ms_add_form", ms_add_request_callback);
    const cluster_name = document.getElementsByClassName("ms_add_cluster_dropdown")[0].getAttribute("data-value");
    const service_type = document.getElementsByClassName("ms_add_type_dropdown")[0].getAttribute("data-value");
    
    if (!cluster_name) {
        alert("클러스터를 선택하세요.");
        return;
    }
    
    if (!service_type) {
        alert("서비스 종류를 선택하세요.")
        return;
    }
    
    const service_port_containers = document.getElementsByClassName("service_port_container");
    const service_ports = [];
    for(let i=0; i < service_port_containers.length; i++) {
        if(service_port_containers[i]){
            service_ports.push({
                "protocol": service_port_containers[i].getElementsByClassName("ms_add_port_protocol_type_dropdown")[0].getAttribute("data-value"),
                "containerPort": service_port_containers[i].getElementsByClassName("ms_add_port_container_port")[0].value,
                "externalPort": service_port_containers[i].getElementsByClassName("ms_add_port_external_port")[0].value,
            });
        }
    };
    client.set_param("service_ports", JSON.stringify(service_ports));

    
    client.send_request("POST", REQUEST_SERVICE_ADD_URL);
}

function service_add_click_event(event, element) {
    if(confirm("서비스를 생성합니다.")) {
        service_add_request();
    }
}

// Port Container
function port_add_btn_click_event() {
    const cloned_port_inputs = cloned_ports_elements.clone();
    $(".ms_add_ports").append(cloned_port_inputs);
}

function port_del_btn_click_event() {
    const ms_add_ports_list = document.getElementsByClassName('ms_add_ports')[0];
    if(ms_add_ports_list.childElementCount == 1){
        return;
    }
    else {
        ms_add_ports_list.lastChild.remove();
    }
}
