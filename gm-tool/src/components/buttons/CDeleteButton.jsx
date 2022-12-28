import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".btn_delete": {
        textAlign: "center",
        minWidth: 120,
        height: 30,
        font: "inherit",
        color: `#fff`,
        border: "1px solid #db007c",
        borderRadius: "3px",
        background: `#e50081`,

        "&:hover": {
          backgroundColor: "#cc0073",
          borderColor: "#db007c",
        },
        "&.check .MuiButton-label::after": {
          backgroundImage: "url(../images/bullet/createBtn_check.png)",
        },
      },
    },
  }),
);

const CDeleteButton = props => {
  const { children, type, style, icon, buttonEventType = "button", onClick, role = "ROLE_USER", ...other } = props;
  const classes = useStyles();

  return (
    <>
      <Button type={buttonEventType} className={`btn_delete ${icon}`} style={style} onClick={onClick} {...other}>
        {children}
      </Button>
    </>
  );
};

export { CDeleteButton };
