function select_option(target,self){
    var hidden_tag_nm = $("#"+target).attr("value")
    
    $("#"+target+" .dropdown-toggle").text($(self).text());
    $("#"+hidden_tag_nm).val($(self).attr("value"));
}