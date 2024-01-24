import React from "react";
import Tab from "@material-ui/core/Tab";

const CSubTab = (props) => {
  const { label, ...other } = props;

  return (
    <Tab
      label={label}
      {...other}
    />
  );
};

export { CSubTab };
