
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
        setTimeout(function(){$("#spinner_div").hide()}, 100);
    }
}

function move_to_page(url) {
    location.href = url;
}

function display_container(container, action, is_flex){
    if(!container){
        return;
    }

    if(action == "show"){
        if(container.classList.contains("d-none")){
            container.classList.remove("d-none");
            if(is_flex){
                container.classList.add("d-flex");
            }
        }
    }
    else if(action == "hide"){
        if(!container.classList.contains("d-none")){
            container.classList.add("d-none");
            if(is_flex){
                container.classList.remove("d-flex");
            }
        }
    }
    else if(action == "toggle"){
        if(container.classList.contains("d-none")){
            container.classList.remove("d-none");
            if(is_flex){
                container.classList.add("d-flex");
            }
        }
        else{
            container.classList.add("d-none");
            if(is_flex){
                container.classList.remove("d-flex");
            }
        }
    }
    else{
        console.error("Invalid action type : " + action);
    }
}

function get_dropdown_item(id_or_element){
    let dropdown_input;

    if(typeof id_or_element == "string"){
        // for id (class name)
        const dropdown_input_elements = document.getElementsByClassName(id_or_element);
        if(dropdown_input_elements.length == 0){
            console.error("Not found dropdown input elements, " + id_or_element);
            return;
        }
        else if(dropdown_input_elements.length > 1){
            console.error("Dropdown input element must be only one, " + id_or_element);
            return;
        }

        dropdown_input = dropdown_input_elements[0];
    }
    else{
        if(id_or_element.classList.contains("dropdown")){
            dropdown_input = id_or_element.getElementsByTagName("input")[0];
        }
        else if(id_or_element.classList.contains("dropdown-toggle")){
            dropdown_input = id_or_element;
        }
        else if(id_or_element.classList.contains("dropdown-item")){
            const dropdown = id_or_element.closest(".dropdown");
            dropdown_input = dropdown.getElementsByTagName("input")[0];
        }
        else{
            console.error("Not dropdown element, " + id_or_element);
            return;
        }
    }

    return dropdown_input;
}

function set_dropdown_item_value(id_or_element, item=null){
    const dropdown = get_dropdown_item(id_or_element);

    if(item){
        dropdown.setAttribute("value", item.textContent);
        dropdown.setAttribute("data-value", item.getAttribute("value"));
    }
    else{
        dropdown.setAttribute("value", "");
        dropdown.removeAttribute("data-value");
    }
}

function get_dropdown_item_value(id_or_element){
    const dropdown = get_dropdown_item(id_or_element);
    return dropdown.getAttribute("data-value");
}

function get_dropdown_item_text(id_or_element){
    const dropdown = get_dropdown_item(id_or_element);
    return dropdown.textContent;
}


// Modal Function 
function display_modal(modal_id, action, messages=[], modal_data=null){
    const modal = document.getElementById(modal_id);
    let modal_text, modal_target_list, target;

    if(modal){
        modal_target_list = modal.getElementsByClassName("modal_target_list")[0];
        if(modal_id == "confirm_cancel_modal" || modal_id == "confirm_modal" || modal_id == "delete_confirm_cancel_modal"
            || modal_id == "confirm_not_cancel_modal"){
            if(action == "show"){
                for(let i=0; i<messages.length; i++){
                    modal_text = modal.getElementsByClassName("modal_fixed_text")[i];
                    modal_text.innerHTML = messages[i];
                }
            }
        }
        else if(modal_id == "change_confirm_cancel_modal" || modal_id == "many_change_confirm_cancel_modal" || modal_id == "many_delete_confirm_cancel_modal"){
            if(action == "show"){
                for(let i=0; i<messages.length; i++){
                    modal_text = modal.getElementsByClassName("modal_fixed_text")[i];
                    modal_text.innerHTML = messages[i];
                }

                if(modal_data){
                    target = modal_data["target"];
                    if(target){
                        modal_target_list.innerHTML = "";
                        for(const text of target){
                            modal_target_list.insertAdjacentHTML("beforeend", "<span>" + text + "</span>");
                        }
                    }
                }
            }
        }

        $("#" + modal_id).data(modal_data);
        $("#" + modal_id).modal(action);
    }
    else{
        console.error("Not found modal : " + modal_id);
    }
}

function modal_confirm_button_click_event(modal_id){
    const modal = $("#" + modal_id);
    const modal_callback = modal.data("callback");

    if(modal_callback){
        modal_callback(modal);
    }
    else{
        $("#" + modal_id).modal("hide");
    }
}

function modal_cancel_button_click_event(modal_id){
    $("#" + modal_id).modal("hide");
}

function ValidateIPaddress(ipaddress) 
{
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true
    }
    return false
}