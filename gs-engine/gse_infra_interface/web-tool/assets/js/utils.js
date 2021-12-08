jQuery.fn.serializeObject = function() { 
  var obj = null; 
  if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) { 
      var arr = this.serializeArray(); 
      if(arr){ obj = {}; 
      jQuery.each(arr, function() { 
          obj[this.name] = this.value; }); 
      } 
  } 
  return obj; 
}



function get_img_base_path(){
    return 'assets/img/';
}

window.onbeforeunload = function(e){
    spinner_manager('show');
}

document.onreadystatechange = function(){
    spinner_manager('hide');
}
function spinner_manager(type){
    var spinner_display = $("#spinner_div").css("display");
    if(type == 'show' && spinner_display == 'none'){
        $("#spinner_div").show();
    }
    else{
        setTimeout(function(){$("#spinner_div").hide()}, 1000);
    }
}