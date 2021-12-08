var before_nic = null;
var nic_list = [];
var before_pod = null

var pod_list = [];
$("document").ready(function(){
    get_kube_info();
    get_nic_list();
    render_nic_list();
    get_pod_list();
    render_pod_list();
})

function get_kube_info(){
   var ajax = new AjaxManager()
    ajax.set_success(function(result){
        ret_data = JSON.parse(result);
        $("#tplg_plcy").text(ret_data.tplg_plcy);
        $("#base_network").text(ret_data.network);
        if(ret_data.network == 'cilium')
            $("#cilium").css("display","block");
    })
    ajax.send_request('GET',server_urls.KUBE_INIT_MANAGER);
}

function select_nic(self,nic_nm){
    if(before_nic == self)
        return
    if(before_nic != null){
        before_nic.src = get_img_base_path() + "btn-radio-inactive/btn-radio-inactive.png";
    }

    self.src= get_img_base_path() + "btn-radio-active/btn-radio-active.png";
    before_nic = self;
    $("#del_nic_nm").val(nic_nm);
}

function get_nic_list(){
    var ajax = new AjaxManager();
    ajax.set_success(function(result){
        nic_list = JSON.parse(result);
    })
    ajax.send_request("GET",server_urls.NIC_MANAGER,false)
}
function render_nic_list(){
    if(nic_list.length == 0)
        return;
    for(var i = 0 ; i < nic_list.length ; i++){
        var tag =
            '<tr class="none_tr"></tr>'+
            '<tr id="'+nic_list[i].nic_nm+'"><td class="nic_check"><img class="nic_check_radio" src="'+
            (i == 0 ? get_img_base_path() + 'btn-radio-active/btn-radio-active.png' :
            get_img_base_path() + 'btn-radio-inactive/btn-radio-inactive.png')+    
            '" onclick="select_nic(this,\''+nic_list[i].nic_nm+'\')" /></td>'+
            '<td class="plugin_nm">'+nic_list[i].plugin_nm+'</td>'+
            '<td class="nic_nm">'+nic_list[i].nic_nm+'</td>'+
            '<td class="nic_type">'+nic_list[i].type+'</td>'+
            '<td class="nic_subnet">'+nic_list[i].subnet+'</td></tr>'
        $("#nic_list_tbody").append(tag)
    }
    
    $("#del_nic_nm").val(nic_list[0].nic_nm);
    before_nic = document.getElementById("nic_list_tbody").childNodes[1].childNodes[0].childNodes[0]
}

function del_nic(){
    var nic_nm = $("#del_nic_nm").val();
    if(!nic_nm)
        return;
    var del_yn = confirm(nic_nm+" NIC를 삭제 하시겠습니까?")
    if(del_yn){
        var ajax = new AjaxManager("delete_nic_form")
        ajax.set_success(function(result){
            $("#"+nic_nm).prev().remove()
            $("#"+nic_nm).remove()
        })
        ajax.send_request('DELETE',server_urls.NIC_MANAGER);
    }
}

function del_plugin(type){
    $("#del_nic_plugin").val(type)
    var del_yn = confirm(type+" 플러그인을 초기화 하시겠습니까?")
    if(del_yn){
        var ajax = new AjaxManager("delete_nic_form")
        ajax.set_success(function(result){
            location.reload();    
        })
        ajax.send_request('DELETE',server_urls.NIC_MANAGER);
    }
}

function select_plugin(self){
    if(self.id == "multus"){
        $(self).children("img").attr("src",get_img_base_path() + "btn-radio-active/btn-radio-active.png")
        $("#sriov img").attr("src",get_img_base_path() + "btn-radio-inactive/btn-radio-inactive.png")
        $("#plugin_nm").val("multus");
        $("#nic_type").text("host-local");
    }
    else if(self.id == "sriov"){
        $(self).children("img").attr("src",get_img_base_path() + "btn-radio-active/btn-radio-active.png")
        $("#multus img").attr("src",get_img_base_path() + "btn-radio-inactive/btn-radio-inactive.png")
        $("#plugin_nm").val("sriov");
        $("#nic_type").text("sriov");
    }
    else if(self.id == "flannel"){
        $(self).children("img").attr("src",get_img_base_path() + "btn-radio-active/btn-radio-active.png")
        $("#cilium img").attr("src",get_img_base_path() + "btn-radio-inactive/btn-radio-inactive.png")
        $("#network_type").val("flannel")
    }
    else if(self.id == "cilium"){
        $(self).children("img").attr("src",get_img_base_path() + "btn-radio-active/btn-radio-active.png")
        $("#flannel img").attr("src",get_img_base_path() + "btn-radio-inactive/btn-radio-inactive.png")
        $("#network_type").val("cilium")
    }
}
function create_nic(){
    var ajax = new AjaxManager("create_nic_form")
    ajax.set_success(function(result){
        nic_info = JSON.parse(result);
        var tag = 
            '<tr class="none_tr"></tr>'+
            '<tr id="'+nic_info.nic_nm+'"><td class="nic_check"><img class="nic_check_radio" src="'+
            ( $("#nic_list_tbody").children().length == 0 ? get_img_base_path() + 'btn-radio-active/btn-radio-active.png' :
            get_img_base_path() + 'btn-radio-inactive/btn-radio-inactive.png')+    
            '" onclick="select_nic(this,\''+nic_info.nic_nm+'\')" /></td>'+
            '<td class="plugin_nm">'+nic_info.plugin_nm+'</td>'+
            '<td class="nic_nm">'+nic_info.nic_nm+'</td>'+
            '<td class="nic_type">'+nic_info.type+'</td>'+
            '<td class="nic_subnet">'+nic_info.subnet+'</td></tr>'
        $("#nic_list_tbody").append(tag)
        if($("#nic_list_tbody").children().length == 2){
            $("#del_nic_nm").val(nic_info.nic_nm);
            before_nic = document.getElementById("nic_list_tbody").childNodes[1].childNodes[0].childNodes[0]
        }
    })
    ajax.send_request('POST',server_urls.NIC_MANAGER);
}

function get_pod_list(){
    var ajax = new AjaxManager();
    ajax.set_success(function(result){
        pod_json = JSON.parse(result);
        pod_list = pod_json['pod_list'];
    })
    ajax.send_request("GET",server_urls.POD_MANAGER,false)
}
function render_pod_list(){
    for(var i = 0 ; i < pod_list.length ; i++){
        var tag = 
            '<tr class="none_tr"></tr>'+
            '<tr><td class="table_cell_left_radius pod_check">'+
            '<div class="form-check d-inline">'+
            '<input type="checkbox" class="form-check-input pod_check_box" id="'+pod_list[i]+'" onchange="select_pod(this,\''+pod_list[i]+'\')"/>'+
            '<label class="form-check-label pod_check_label" for="'+pod_list[i]+'"></label></div></td>'+
            '<td class="pod_nm">'+pod_list[i]+'</td></tr>'
        $("#pod_list_tbody").append(tag);
    }
    $("#pod_nm").val(pod_list[0]);
    if(document.getElementById("pod_list_tbody").childNodes.length > 0)
        before_pod = document.getElementById("pod_list_tbody").childNodes[1].childNodes[0].childNodes[0]
}
var select_sriov_cnt = 0;
function select_pod(self,pod_nm){
    if(self.checked){
        $("#cilium_plcy_form").append(
            '<input type="hidden" id="select_'+pod_nm+'" name="pod_list" value="'+pod_nm+'">'
        )
    }
    else{
         $("#select_"+pod_nm).remove();
    }
}
function select_type(self, target){
    $("#"+target+" .dropdown-toggle").text($(self).text());
    $("#"+target+" input[type=hidden]").val($(self).attr("value"));
    if($(self).attr("value") == "static"){
        $("#nic_subnet").val("");
        $("#nic_subnet").attr("readOnly",true);
    }
    else{
        $("#nic_subnet").attr("readOnly",false);
    }
}

var timeid = null;
function kube_reset(){
    var reset_yn = confirm("초기화를 진행하시겠습니까?");
    if(reset_yn){
        var ajax = new AjaxManager("kube_reset_form")
        ajax.set_success(function(result){
        })
        ajax.send_request('POST',server_urls.KUBE_INIT_MANAGER,true,true);
        get_reset_status();
        timeid = setInterval(get_reset_status,10000);
    }
}

function get_reset_status(){
    $("#spinner_div").show();
    var ajax = new AjaxManager()
    ajax.set_success(function(result){
        reset_status = JSON.parse(result)["reset_status"];
        if(reset_status == "END"){
            if(timeid != null)
                clearInterval(timeid);
            location.reload();
        }
        return 'reset';
    })
    ajax.send_request('GET',server_urls.KUBE_INIT_MANAGER,true,true);
}
function deploy_plcy(){
    if($("input[name=pod_list]").length == 0){
        alert("적용할 Pod를 선택해주세요.");
        return;
    }
    var ajax = new AjaxManager("cilium_plcy_form")
    delete ajax.data.pod_list
    
    var pid_tag_list = $("input[name='pod_list']")
    var pod_list = []
    for(var i = 0 ; i < pid_tag_list.length ; i++){
        pod_list.push(pid_tag_list[i].value)
    }
    ajax.add_data("pod_list",pod_list);
        
    ajax.data.select_in_type = ajax.data.select_in_type == 'true' ? true : false;
    ajax.data.select_out_type = ajax.data.select_in_type == 'true' ? true : false;
    
    ajax.set_success(function(result){
    })
    ajax.send_request('POST',server_urls.CILIUM_PLCY_MANAGER);
}
function delete_plcy(){
    var ajax = new AjaxManager("cilium_plcy_form")
    
    delete ajax.data.pod_list
    
    var pid_tag_list = $("input[name='pod_list']")
    var pod_list = []
    for(var i = 0 ; i < pid_tag_list.length ; i++){
        pod_list.push(pid_tag_list[i].value)
    }
    ajax.add_data("pod_list",pod_list);
    
    ajax.data.select_in_type = ajax.data.select_in_type == 'true' ? true : false;
    ajax.data.select_out_type = ajax.data.select_in_type == 'true' ? true : false;
    
    ajax.set_success(function(result){
    })
    ajax.send_request('DELETE',server_urls.CILIUM_PLCY_MANAGER);
}
function active_plcy(self,plcy){
    if(self.checked){
        $("#"+plcy+" input").attr("readOnly",false);
        $("#"+plcy+" button").attr("disabled",false);
        $("#select_"+plcy).val(true);
    }
    else{
        $("#"+plcy+" input").attr("readOnly",true);
        $("#"+plcy+" button").attr("disabled",true);
        $("#select_"+plcy).val(false);
    }
}

function add_port(self,type){
    var tag = ''
    var next_cnt = Number($(self).attr("value"))+1;
    $(self).attr("value",next_cnt);
    if(type == "in_type"){
        tag =
        '<div id="ingress_port_'+next_cnt+'" ><div class="plcy_port"><span class="nic_add_title">Port</span>'+
        '<input type="text" class="form-control input_text" id="in_port" name="in_port" readonly="true" /></div>'+
        '<div class="plcy_porotocol"><span class="nic_add_title">Protocol</span>'+
        '<div class="dropdown" value="node_nm"><button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button" disabled="true">TCP</button>'+
        '<div role="menu" class="dropdown-menu">'+
        '<a role="presentation" class="dropdown-item" value="TCP" onclick="select_type(this,\'ingress_port_'+next_cnt+'\')">TCP</a>'+
        '<a role="presentation" class="dropdown-item" value="UDP" onclick="select_type(this,\'ingress_port_'+next_cnt+'\')">UDP</a>'+
        '<a role="presentation" class="dropdown-item" value="ANY" onclick="select_type(this,\'ingress_port_'+next_cnt+'\')">ANY</a>'+
        '</div></div><input type="hidden" class="form-control" name="in_type" value="TCP" /></div></div>'
         $("#in_type").append(tag)
    }
    else if(type == "out_type"){
        tag =
        '<div id="egress_port_'+next_cnt+'"><div class="plcy_port"><span class="nic_add_title">Port</span>'+
        '<input type="text" class="form-control input_text" id="out_port" name="out_port" readonly="true" /></div>'+
        '<div class="plcy_porotocol"><span class="nic_add_title">Protocol</span>'+
        '<div class="dropdown" value="node_nm"><button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button" disabled="true">TCP</button>'+
        '<div role="menu" class="dropdown-menu">'+
        '<a role="presentation" class="dropdown-item" value="TCP" onclick="select_type(this,\'egress_port_'+next_cnt+'\')">TCP</a>'+
        '<a role="presentation" class="dropdown-item" value="UDP" onclick="select_type(this,\'egress_port_'+next_cnt+'\')">UDP</a>'+
        '<a role="presentation" class="dropdown-item" value="ANY" onclick="select_type(this,\'egress_port_'+next_cnt+'\')">ANY</a>'+
        '</div></div><input type="hidden" class="form-control" name="out_type" value="TCP" /></div></div>'
        $("#out_type").append(tag)

    }
}
