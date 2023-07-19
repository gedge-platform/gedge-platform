const openNotificationWithIcon = (api, type, data) => {
    api[type](data);
  };

const openSuccessNotificationWithIcon = (api, message, description) => {
    openNotificationWithIcon(api, "success", {message : message, description : description});
}

const openErrorNotificationWithIcon = (api, message, description) => {
    openNotificationWithIcon(api, "error", {message : message, description : description});
}

export {openNotificationWithIcon, openErrorNotificationWithIcon, openSuccessNotificationWithIcon}