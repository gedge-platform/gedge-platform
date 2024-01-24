import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".btn_edit": {
        textAlign: "center",
        minWidth: 120,
        height: 30,
        font: "inherit",
        color: `#fff`,
        border: "1px solid #0BB8DB",
        borderRadius: "3px",
        background: `#0BB8DB`,

        "&:hover": {
          backgroundColor: "#0BB8DB",
          borderColor: "#0BB8DB",
        },
        "&.check .MuiButton-label::after": {
          backgroundImage: "url(../images/bullet/createBtn_check.png)",
        },
      },
    },
  })
);

const CEditButton = (props) => {
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
        className={`btn_edit ${icon}`}
        style={style}
        onClick={onClick}
        {...other}
      >
        {children}
      </Button>
    </>
  );
};

export { CEditButton };
