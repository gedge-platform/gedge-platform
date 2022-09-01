import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import theme from "@/styles/theme";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".btn_create": {
        textAlign: "center",
        minWidth: 120,
        height: 30,
        font: "inherit",
        color: `#fff`,
        border: "1px solid #0189f2",
        borderRadius: "3px",
        background: `${theme.colors.primaryBtn}`,

        "&:hover": {
          backgroundColor: "#008aff",
          borderColor: "#007cdb",
        },
        "&.check .MuiButton-label::after": {
          backgroundImage: "url(../images/bullet/createBtn_check.png)",
        },
      },
    },
  })
);

const CCreateButton = (props) => {
  const {
    children,
    type,
    style,
    icon,
    buttonEventType = "button",
    onClick,
    role = "ROLE_USER",
    ...other
  } = props;
  const classes = useStyles();

  return (
    <>
      <Button
        type={buttonEventType}
        className={`btn_create ${icon}`}
        style={style}
        onClick={onClick}
        {...other}
      >
        {children}
      </Button>
    </>
  );
};

export { CCreateButton };
