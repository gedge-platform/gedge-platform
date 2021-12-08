var pod_list = [];
var pod_info = {};
var timeid = null;

$("document").ready(function(){
    get_pod_list();
    render_pod_list()
    if(pod_list.length > 0){
        $("#form_pod_nm").val(pod_list[0]);
        load_pod(pod_list[0]);
    }
})

function get_pod_list(){
    var ajax = new AjaxManager();
    ajax.set_success(function(result){
        pod_json = JSON.parse(result);
        pod_list = pod_json['pod_list'];
    })
    ajax.send_request("GET",server_urls.POD_MANAGER,false)
}

function load_pod(pod_nm){
    if(timeid != null)
        clearInterval(timeid);
    $("#log_div").empty();
    $("#form_pod_nm").val(pod_nm);
    var ajax = new AjaxManager();
    ajax.add_param("pod_nm",pod_nm)
    ajax.set_success(function(result){
        pod_info = JSON.parse(result);
        render_pod_info();
        get_pod_log(pod_nm);
        timeid = setInterval(get_pod_log,5000,pod_nm)
        
        render_pod_info();
        render_nic_list();
    })
    ajax.send_request("GET",server_urls.POD_MANAGER,false)
}

function render_pod_list(){
    for(var i = 0 ; i < pod_list.length ; i++){
        var tag = '<span class="pod_list_pod_nm" onclick="load_pod(\''+pod_list[i]+'\')">'+pod_list[i]+'</span>'
        $("#pod_list_scroll").append(tag);
    }
}
function render_pod_log(pod_log){
    $("#log_div").empty();
    $("#log_div").append("<pre>"+pod_log+"</pre>");
    
    var log_div = document.getElementById("log_div");
    log_div.scrollTop = log_div.scrollHeight;

}
function get_pod_log(pod_nm){
    var ajax = new AjaxManager();
    ajax.add_param("pod_nm",pod_nm)
    ajax.set_success(function(result){
        pod_log = JSON.parse(result);
        render_pod_log(pod_log);
    })
    ajax.send_request("GET",server_urls.RESPONSE_ANALYSIS_MANAGER,true, true);    
}

function render_pod_info(){
    $("#pod_info_pod_nm").text(pod_info['pod']['pod_nm']);
    $("#pod_info_node_nm").text(pod_info['node']['node_nm']);
    $("#pod_info_img_nm").text(pod_info['image']['image_nm']);

    $("#cpu_lmt").text(pod_info['pod']['cpu']['limits']);
    $("#cpu_req").text(pod_info['pod']['cpu']['requests']);

    if(pod_info['pod']['mem']['limits'] == '0')
        $("#mem_lmt").text('0GB');    
    else
        $("#mem_lmt").text(pod_info['pod']['mem']['limits'].slice(0,pod_info['pod']['mem']['limits'].length-2)+'GB');
    
    if(pod_info['pod']['mem']['requests'] == '0')
        $("#mem_req").text('0GB');
    else
        $("#mem_req").text(pod_info['pod']['mem']['requests'].slice(0,pod_info['pod']['mem']['requests'].length-2)+'GB');

    $("#gpu_lmt").text(pod_info['pod']['gpu']['limits']);
    $("#gpu_req").text(pod_info['pod']['gpu']['requests']);
}

function render_nic_list(){
    var net_list = pod_info['network']
    $("#nic_list_tbody").empty();
    if(net_list.length == 0){
        var tag=  
            '<tr class="none_tr"></tr>'+
            '<tr><td id="nic_error" class="table_cell_left_radius table_cell_right_radius"colspan="3">NIC 오류가 발생하였습니다. 삭제 후 다시 진행해주세요.</td></tr>'
        $("#nic_list_tbody").append(tag);
    }
    else{
        for(var i = 0 ; i < net_list.length ; i++){
            var tag =
                '<tr class="none_tr"></tr>'+
                '<tr><td class="plugin_nm table_cell_left_radius">'+net_list[i].plugin_nm+'</td>'+
                '<td class="nic_nm">'+
                (net_list[i].nic_nm == '' ?  '기본 네트워크' : net_list[i].nic_nm)+'</td>'+
                '<td class="nic_ip">'+net_list[i].ip+'</td></tr>'
            $("#nic_list_tbody").append(tag);
        }
    }
}

function delete_pod(){
    var pod_nm = $("#form_pod_nm").val();
    var del_yn = confirm(pod_nm+" Pod를 삭제 하시겠습니까?")
    if(del_yn){
        var ajax = new AjaxManager();
        ajax.add_param("pod_nm",pod_nm);
        ajax.set_success(function(result){
        })
        ajax.send_request("DELETE",server_urls.POD_MANAGER,false)
    }
}
