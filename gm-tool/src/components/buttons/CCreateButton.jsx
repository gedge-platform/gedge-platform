import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

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
        background: `#0189f2`,

        "&:hover": {
          backgroundColor: "#0189f2",
          borderColor: "#0189f2",
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
