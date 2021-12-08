class AjaxManager{
    constructor(form_id=null){
        if(!form_id)
            this.data=''
        else
            this.data = $("#" + form_id).serializeObject();
    }

    add_data(key,value){
        this.data[key] = value;
    }

    add_param(key, value){
        this.url_param += "&" + key + "=" + value;
    }
    set_success(func){
        this.success = function(result){
            if(func(result) == 'reset')
                return;
            spinner_manager('hide');
        };
        this.error = function(error){
            console.log("error : " + JSON.stringify(error));
        };
    }

    send_request(action,url,async=true, log=false){
        this.ajax = jQuery.ajax({
            type: action,
            url: url+'?'+this.url_param,
            data: JSON.stringify(this.data),
            contentType:"application/json",
            async: async,
            success: this.success,
            error: this.error
        })
        if(!log)
            spinner_manager('show');
    }
}