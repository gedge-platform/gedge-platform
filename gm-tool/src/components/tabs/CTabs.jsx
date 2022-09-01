import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import theme from "@/styles/theme";
import Tabs from "@material-ui/core/Tabs";
import tabBg from "@/images/component/tab_sprite_bg_dark.png";

const useStyles = makeStyles(() =>
  createStyles({
    tabs: {
      minHeight: 1,
      flexShrink: 0,
      "& .MuiTouchRipple-root, & .MuiTabs-indicator": { display: "none" },
    },
    primary: {
      "& .tabBtn": {
        position: "relative",
        opacity: 1,
        height: 33,
        minHeight: 33,
        padding: "0 40px",
        fontFamily: "inherit",
        fontSize: "12px",
        color: "#929da5",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 40,
          background: `url(${tabBg}) no-repeat left top`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 40,
          background: `url(${tabBg}) no-repeat right -100px`,
        },
        "&:not(:first-child)": {
          marginLeft: -40,
        },

        "& .MuiTab-wrapper": {
          display: "block",
          minWidth: 120,
          paddingTop: 7,
          height: "100%",
          background: `url(${tabBg}) repeat-x left -300px`,
          fontWeight: 400,
        },
        "&.Mui-selected": {
          height: 35,
          zIndex: "10 !important",
          fontSize: "13px",
          // color: `${theme.colors.defaultDark}`,
          color: `#fff`,
          "&::before": {
            backgroundPositionY: "-50px",
          },
          "&::after": {
            backgroundPositionY: "-150px",
          },
          "& .MuiTab-wrapper": {
            backgroundPositionY: "-349px",
            paddingTop: 9,
            fontWeight: "500",
          },
        },
        "&:first-child": {
          zIndex: 9,
          paddingLeft: 15,
          "&::before": {
            width: 15,
            backgroundPositionY: "-200px",
          },
          "&.Mui-selected::before": {
            backgroundPositionY: "-249px",
          },
        },
        "&:nth-child(2)": { zIndex: 8 },
        "&:nth-child(3)": { zIndex: 7 },
        "&:nth-child(4)": { zIndex: 6 },
        "&:nth-child(5)": { zIndex: 5 },
        "&:nth-child(6)": { zIndex: 4 },
        "&:nth-child(7)": { zIndex: 3 },
        "&:nth-child(8)": { zIndex: 2 },
        "&:nth-child(9)": { zIndex: 1 },
      },
      "& + .tabPanelContainer": {
        marginTop: "-2px",
      },
    },
    secondary: {
      "& .tabBtn": {
        position: "relative",
        opacity: 1,
        color: "#8390a4",
        minHeight: 42,
        minWidth: 1,
        padding: "0 11px",
        fontFamily: "inherit",
        fontSize: "12px",
        "& .MuiTab-wrapper": {
          display: "flex",
          height: "100%",
          padding: "0 1px",
          fontWeight: 400,
          fontSize: "12px",
          borderBottom: "3px solid transparent",
        },
        "&.Mui-selected": {
          zIndex: "1",
          color: "#0090ff",
          "& .MuiTab-wrapper": {
            // borderBottomColor: '#0090ff',
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            right: 11,
            left: 11,
            borderBottom: "3px solid #0090ff",
          },
        },
      },
    },
  })
);

const CTabs = (props) => {
  const {
    value,
    type,
    variant = "scrollable",
    children,
    onChange,
    ...others
  } = props;
  const classes = useStyles();

  const tabType =
    (type === "tab1" && classes.primary) ||
    (type === "tab2" && `${classes.secondary} panelTitBar`) ||
    classes.primary;

  return (
    <Tabs
      {...others}
      value={value}
      className={`${classes.tabs} ${tabType}`}
      variant={variant}
      scrollButtons="auto"
      onChange={onChange}
    >
      {children}
    </Tabs>
  );
};

export { CTabs };
