import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import theme from "@/styles/theme";

const useStyles = makeStyles(() =>
  createStyles({
    primary: {
      backgroundColor: `${theme.colors.primaryBtn}`,
      color: "#fff",
      fontWeight: "300",
      "&:hover": {
        backgroundColor: `${theme.colors.primaryDark}`,
        color: "#fff",
      },
      "&:disabled": {
        backgroundColor: "#8a9aab",
        color: "#fff",
      },
    },
    comm: {
      color: `${theme.colors.defaultDark}`,
      "&:disabled": {
        opacity: 0.5,
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: 10,
        height: 10,
        right: 9,
        top: "50%",
        transform: "translateY(-50%)",
        background: "url(../images/bullet/createBtn_add.png) no-repeat right top",
      },
    },
    outlined: {
      color: `${theme.colors.defaultDark}`,
      "&:hover": {
        color: `${theme.colors.primaryDark}`,
        backgroundColor: "transparent",
      },
      "&:disabled": {},
    },
    "@global": {
      ".btn_common": {
        minWidth: 80,
        height: 38,
        padding: "0 10px",
        fontFamily: "inherit",
        fontSize: "13px",
        transition: "0.2s",
        textAlign: "left",
        borderRadius: "0px !important",
      },
    },
    datepicker: {
      minWidth: 50,
      height: 30,
      margin: "0 10px 0 3px",
      padding: 0,
      textAlign: "center",
      background: "linear-gradient(#fdfdfd,#f6f6f9);",
      border: "1px solid #bec3ca",
      borderRadius: "3px !important",
      color: `${theme.colors.defaultDark}`,
      "&:hover": {
        color: `${theme.colors.primaryDark}`,
        backgroundColor: "transparent",
      },
    },
  }),
);

const CButton = props => {
  const { children, type, style, className, buttonEventType = "button", onClick, role = "ROLE_USER", ...other } = props;
  const classes = useStyles();

  const buttonType =
    (type === "btn1" && classes.primary) ||
    (type === "btn2" && classes.comm) ||
    (type === "btn3" && classes.outlined) ||
    (type === "btn4" && classes.datepicker) ||
    classes.outlined;

  return (
    <Button type={buttonEventType} className={`btn_common ${buttonType} ${className}`} style={style} onClick={onClick} {...other}>
      {children}
    </Button>
  );
};

export { CButton };
