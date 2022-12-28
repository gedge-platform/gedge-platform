document.addEventListener("keyup", on_keyup_event);

function on_keyup_event(event) {
    if(event.key == "Enter"){
        on_click_login();
    }
}

function login_request_callback(result, status_code) {
    if (status_code == 200) {
        move_to_page(MULTI_CLUSTER_LIST_URL);
    } else{
        error_message_block = document.getElementsByClassName("login-invaild")[0];
        error_message = document.getElementById("login_fail_text");
        error_message.innerHTML = result['desc'];
        error_message.style.visibility = "visible";
    }
    
}

function on_click_login() {
    const user_name = document.getElementById("login_user_id_input").value.trim();
    const user_passwd = document.getElementById("login_password_input").value.trim();
    
    if (!user_name || !user_passwd) {
        return ;
    }
    
    const client = new RestClientManager("login_form", login_request_callback);
    client.send_request("POST", REQUEST_LOGIN_URL);
}