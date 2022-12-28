class RestClientManager {
    constructor(form_id=null, callback=null){
        let form;

        if(form_id){
            form = document.getElementById(form_id);
            if(!form){
                console.error("Not found form : " + form_id);
                return;
            }
            
            this.data = $("#" + form_id).serializeArray();
        } else {
            this.data = {}
        }
        
        this.callback = callback;
        this.success = this.default_success;
        this.error = this.default_error;
 
 
    }

    set_param(key, value) {
        if (key in this.data) {
            this.data[key].value = value;
        } else {
            this.data.push({
                "name": key,
                "value": value
            })
        }
    }

    default_success(result) {
        if (this.callback) {
            this.callback(result, result.status_code);
        }
    }

    default_error(error) {
        console.error("Error : " + error.statusText + "(" + error.status + ")");
        this.callback(JSON.parse(error.responseText), error.status);
    }

    send_request(method="POST", url=null) {
        if (url == null) {
            url = location.href;
        } else {
            url = location.protocol + "//" + location.host + url;
        }


        this.rest_api = jQuery.ajax({
            type: method,
            url: url,
            data: this.data,
            async: true,
            context: this,
            success: this.success,
            error: this.error
        });
    }

}