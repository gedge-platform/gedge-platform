import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import theme from "@/styles/theme";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".btn_icon": {
        minWidth: 28,
        minHeight: 28,
        borderRadius: "3px",
        padding: 0,
        "&:hover": {
          backgroundColor: "transparent",
          "& .ico": {
            backgroundPositionY: "-20px",
          },
        },
        "&.Mui-disabled": {
          "& .ico": {
            opacity: "0.5",
          },
        },
        "& .": {
          width: "100%",
          height: "100%",
        },
        "& .ico": {
          width: 21,
          height: 20,
          background: "no-repeat",
        },
      },
      ".iconBtnGrope": {
        borderRadius: "3px",
        paddingLeft: 1,
        "&:not(:first-child)": {
          marginLeft: 6,
        },
        "& .btn_icon": {
          width: 30,
          height: 30,
          border: "1px solid #bec3ca",
          borderRadius: 0,
          marginLeft: "-1px",
          background: "linear-gradient(#fdfdfd,#f6f6f9)",
          boxShadow: "inset 0 0 1px #fff",
          "&:first-child": {
            borderTopLeftRadius: "3px",
            borderBottomLeftRadius: "3px",
          },
          "&:last-child": {
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
          },
        },
      },
    },
    textBtn: {},
    outlinedBtn: {
      transition: "border-color 0.2s",
      border: `1px solid ${theme.colors.defaultDark}`,
      "&:hover": {
        borderColor: `${theme.colors.primaryDark}`,
      },
      "&.Mui-disabled": {
        opacity: "0.4",
        "& .ico": {
          opacity: "1",
        },
      },
    },
  })
);

const CIconButton = (props) => {
  const {
    children,
    icon,
    style,
    type,
    buttonEventType = "button",
    tooltip = "",
    onClick,
    isPlay = false,
    ...other
  } = props;
  const classes = useStyles();

  const buttonType =
    (type === "text" && classes.textBtn) ||
    (type === "outlined" && classes.outlinedBtn);

  return (
    <Tooltip title={tooltip} arrow={true} placement="top">
      <IconButton
        {...other}
        className={`btn_icon ${buttonType}`}
        style={style}
        onClick={onClick}
        type={buttonEventType}
      >
        <span
          className="ico"
          style={{
            backgroundImage: `url(../images/ico-action/ico_${icon}.png)`,
            backgroundPositionY: `${isPlay ? "-20px" : "0px"}`,
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export { CIconButton };
