var node_list = [];
var nic_list = [];
var tplg_plcy = ''
$("document").ready(function(){
    get_kube_info();

    get_node_list()
    render_node_list()
    
    get_nic_list();
    render_nic_list();
})

function select_node(target,self,idx){
    var hidden_tag_nm = $("#"+target).attr("value")
    
    $("#"+target+" .dropdown-toggle").text($(self).text());
    $("#"+hidden_tag_nm).val($(self).attr("value"));
    change_node_info(idx);
}

function get_kube_info(){
   var ajax = new AjaxManager()
    ajax.set_success(function(result){
        ret_data = JSON.parse(result);
        tplg_plcy = ret_data.tplg_plcy;
    })
    ajax.send_request("GET",server_urls.KUBE_INIT_MANAGER, false);
}
function get_node_list(){
    var ajax = new AjaxManager();
    ajax.set_success(function(result){
        node_list = JSON.parse(result);
    })
    ajax.send_request("GET",server_urls.NODE_MANAGER,false)
}

function change_node_info(idx){
    $("#node .dropdown-toggle").attr("disabled",false);
    $("input").attr("disabled",false);
    $("#resource_div input").attr("disabled",false);
    
    
    $("#create_pod_form")[0].reset();
    $("#node_nm").val(node_list[idx]['node']['node_nm'])
    if(node_list[idx]['resource']['alctb_cpu'] == 0){
        $("#cpu_lmt").attr("readonly",true);
        $("#cpu_req").attr("readonly",true);
    }
    else{
        $("#cpu_lmt").attr("readonly",false);
        $("#cpu_req").attr("readonly",false);
    }
    $("#alctb_cpu_limit").text("최대 "+node_list[idx]['resource']['alctb_cpu']);
    $("#alctb_cpu_request").text("최대 "+node_list[idx]['resource']['alctb_cpu']);
    
    if(node_list[idx]['resource']['alctb_mem'] == 0){
        $("#mem_lmt").attr("readonly",true);
        $("#mem_req").attr("readonly",true);
    }
    else{
        $("#mem_lmt").attr("readonly",false);
        $("#mem_req").attr("readonly",false);
    }
    $("#alctb_mem_limit").text("최대 "+node_list[idx]['resource']['alctb_mem']);
    $("#alctb_mem_request").text("최대 "+node_list[idx]['resource']['alctb_mem']);

    if(node_list[idx]['resource']['alctb_gpu'] == 0){
        $("#gpu_lmt").attr("readonly",true);
        $("#gpu_req").attr("readonly",true);
    }
    else{
        $("#gpu_lmt").attr("readonly",false);
        $("#gpu_req").attr("readonly",false);
    }
    $("#alctb_gpu_limit").text("최대 "+node_list[idx]['resource']['alctb_gpu']);
    $("#alctb_gpu_request").text("최대 "+node_list[idx]['resource']['alctb_gpu']);
    
    $("#alctb_sriov").text(node_list[idx]['resource']['alctb_sriov']);

    if(tplg_plcy != "None"){
        $("#cpu_req").attr("readonly",true);
        $("#mem_req").attr("readonly",true);
    }
}
function render_node_list(){
    $("#node .dropdown-toggle").text(node_list[0]['node']['node_nm']);
    
    for(var i = 0 ; i < node_list.length ; i++)
        $("#node .dropdown-menu").append(
            '<a role="presentation" class="dropdown-item" value="'+node_list[i]['node']['node_nm']+'" onclick="select_node(\'node\',this,\''+i+'\')">'+node_list[i]['node']['node_nm']+'</a>')
    change_node_info(0);
}

function get_nic_list(){
    var ajax = new AjaxManager();
    ajax.set_success(function(result){
        nic_list = JSON.parse(result);
    })
    ajax.send_request("GET",server_urls.NIC_MANAGER,false)
}
function render_nic_list(){
    for(var i = 0 ; i < nic_list.length ; i++){
        var tag = 
            '<tr class="none_tr"></tr>'+
            '<tr><td class="table_cell_left_radius nic_check">'+
            '<div class="form-check d-inline">'+
            '<input type="checkbox" class="form-check-input nic_check_box" id="'+nic_list[i]['nic_nm']+'" onchange="select_nic(this,\''+nic_list[i]['plugin_nm']+'\',\''+nic_list[i]['nic_nm']+'\',\''+nic_list[i]['type']+'\')"/>'+
            '<label class="form-check-label nic_check_label" for="'+nic_list[i]['nic_nm']+'"></label></div></td>'+
            '<td class="plugin_nm">'+nic_list[i]['plugin_nm']+'</td>'+
            '<td class="nic_nm">'+nic_list[i]['nic_nm']+'</td>'+
            '<td class="nic_type">'+nic_list[i]['type']+'</td>'+
            '<td class="nic_subnet">'+nic_list[i]['subnet']+'</td>'+
            '<td class="table_cell_right_radius nic_ip">'+
            (nic_list[i].type == 'static' ? 
             '<input type="text" class="form-control input_text" id="'+nic_list[i].nic_nm+'_ip" name="'+nic_list[i].nic_nm+'" placeholder="STATIC IP를 입력해주세요." />':
             '-')+
            '</td></tr>'
        $("#nic_list_tbody").append(tag)
    }
}
var select_sriov_cnt = 0;
var static_nic = {}
function select_nic(self,plugin_nm,nic_nm,nic_type){
    var ip_field = $(self).parent().parent().parent().children().eq(5).children("input")

    if(self.checked){
        $("#network").append(
            '<input type="hidden" id="select_'+nic_nm+'" name="nic_list" value="'+nic_nm+'">'
        )
        if(nic_type == 'static'){
            static_nic[nic_nm] = true;
        }
        if(plugin_nm == 'sriov'){
            var sriov_max = Number($("#alctb_sriov").text());
            
            select_sriov_cnt+=1
            if(select_sriov_cnt > sriov_max){
                alert("최대 허용 SR-IOV NIC 수를 넘어 갈 수 없습니다.");
                select_sriov_cnt -=1;
                self.checked = false;
                return;
            }
            $("#select_sriov_cnt").text(select_sriov_cnt);
        }
    }
    else{
         $("#select_"+nic_nm).remove();
        if(nic_type == 'static'){
            delete static_nic[nic_nm];
        }
        if(plugin_nm == 'sriov'){
            select_sriov_cnt-=1;
            $("#select_sriov_cnt").text(select_sriov_cnt);
        }
    }
}
function empty_check(){
    
    var micro_img_list = ['iperf-cli-mul','iperf-cli-sriov','iperf-cli','iperf-mul','iperf-sriov','iperf','micro','micro-gpu'];
    var img_nm = $("#img_nm").val();
    
    if(micro_img_list.indexOf(img_nm,0) != -1){
        return true;
    }
    
    if(!$("#pod_nm").val()){
        alert("Pod명을 입력해주세요.");
        $("#pod_nm").focus();
        return false;
    }
    
    for(key in static_nic){
        if(!$("#"+key+"_ip").val()){
            alert("STATIC IP를 입력해주세요.");
            $("#"+key+"_ip").focus();
            return false;
        }
    }
    return true;
}
function create_pod(){
    $("#sriov_cnt").val(select_sriov_cnt);
    if(!empty_check())
        return;
    var ajax = new AjaxManager("create_pod_form");
    ajax.add_data("mem_lmt",$("#mem_lmt").val()+'Gi');
    ajax.add_data("mem_req",$("#mem_req").val()+'Gi');
    
    delete ajax.data.nic_list;
    
    var nic_tag_list = $("input[name='nic_list']")
    var nic_list = []
    for(var i = 0 ; i < nic_tag_list.length ; i++){
        nic_nm = nic_tag_list[i].value;
        if($("#"+nic_nm+"_ip").length == 0){
            nic_list.push({"name":nic_tag_list[i].value})
        }
        else{
            nic_list.push({"name":nic_tag_list[i].value,"ip":$("#"+nic_nm+"_ip").val()});
        }
    }
    
    ajax.add_data("nic_list",nic_list);
    
    ajax.set_success(function(result){
        if(typeof(result) == "object"){
            alert("Pod 생성을 실패하였습니다. 입력 정보를 확인해주세요.");
        }
        else
            location.reload();
    })
    ajax.send_request("POST",server_urls.POD_MANAGER)
}

function add_command(){
    var tag = '<div class="input_field"><span class="resource_input_div_input_title">명령어</span><input type="text" class="form-control input_text command" name="cmd" placeholder="명령어를 입력해주세요." /></div>'
    $("#command_div").append(tag);
}

function req_check(self,target){
    var lmt = Number($("#"+target).val());
    var req = Number($(self).val())
    if(lmt < req){
        alert("Limit 값을 확인해주세요.");
        $(self).val("0")
        $(self).focus();
    }
}
function lmt_check(self, type){
    if(tplg_plcy != "None"){
        $("#"+type+"_req").val($(self).val());
    }
    
    var alctb_lmt = Number($("#alctb_"+type+"_limit").text().split(" ")[1]);
    var lmt = Number($(self).val());
    if(lmt > alctb_lmt){
        alert("최대 자원량을 확인해주세요.");
        $(self).val("0")
        $(self).focus();
        
        if(tplg_plcy != "None"){
            $("#"+type+"_req").val($(self).val("0"));
        }
    }
}
function img_check(self){
    var img_nm = $(self).val();
    var none_computing = ['iperf-cli-mul','iperf-cli-sriov','iperf-mul','iperf-sriov','iperf'];
    var computing = ['micro','micro-gpu']
    if(img_nm == "iperf-cli"){
        $("#node .ropdown-toggle").attr("disabled",true);
        $("input").attr("disabled",true);
        $("#args").attr("disabled",false);
    }
    else if(none_computing.indexOf(img_nm,0) != -1){
        $("#node .dropdown-toggle").attr("disabled",true);
        $("input").attr("disabled",true);
    }
    else if(computing.indexOf(img_nm,0) != -1){
        $("#node .dropdown-toggle").attr("disabled",false);
        $("input").attr("disabled",true);
        $("#resource_div input").attr("disabled",false);
    }
    else{
        $("#node .dropdown-toggle").attr("disabled",false);
        $("input").attr("disabled",false);
        $("#resource_div input").attr("disabled",false);
    }
    $(self).attr("disabled",false);
}
