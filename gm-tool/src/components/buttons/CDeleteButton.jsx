import React from "react";
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
        border: "1px solid #FF6C6C",
        borderRadius: "3px",
        background: `#FF6C6C`,

        "&:hover": {
          backgroundColor: "#FF6C6C",
          borderColor: "#FF6C6C",
        },
        "&.check .MuiButton-label::after": {
          backgroundImage: "url(../images/bullet/createBtn_check.png)",
        },
      },
    },
  })
);

const CDeleteButton = (props) => {
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
        className={`btn_delete ${icon}`}
        style={style}
        onClick={onClick}
        {...other}
      >
        {children}
      </Button>
    </>
  );
};

export { CDeleteButton };
