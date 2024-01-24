import React from "react";
import Tabs from "@material-ui/core/Tabs";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(
	createStyles({
		tabs: {
			"& .MuiTabs-indicator": {
				backgroundColor: "#1890ff"
			},
			"&.Mui-selected": {
				color: "#fff"
			}
		},
		primary: {
				
		},
		secondary: {

		}
	})
)

const CSubTabs = (props) => {
  const {
    value,
    children,
    onChange,
    ...others
  } = props;
  const classes = useStyles();

  return (
    <Tabs
      {...others}
      value={value}
      style={{ alignSelf: "start" }}
      className={`${classes.tabs} ${classes.primary}`}
      onChange={onChange}
    >
      {children}
    </Tabs>
  );
};

export { CSubTabs };