import React from "react";
import Tab from "@material-ui/core/Tab";

const CTab = (props) => {
  const { label, type, width, children, role = "ROLE_USER", ...other } = props;

  return (
    <Tab
      label={label}
      style={{ textTransform: "none" }}
      className="tabBtn"
      {...other}
    />
  );
};

export { CTab };
