import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DragSizing } from "react-drag-sizing";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import Detail from "@/pages/Template/Detail/Detail";
import "react-reflex/styles.css";
import { observer } from "mobx-react";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {},
  })
);

const CReflexBox = observer((props) => {
  const { children } = props;

  // const classes = useStyles();
  // console.log(props, "CReflexBox.props")
  //   console.log(children.length);
  // console.log(shareStore.shareHeight)

  if (children.length > 1) {
    return (
      <ReflexContainer orientation="horizontal">
        <ReflexElement minSize={190} className="paper_main">
          {children[0]}
        </ReflexElement>
        <ReflexSplitter />

        <ReflexElement minSize={100} className="paper_detail">
          {children[1]}
        </ReflexElement>
      </ReflexContainer>
    );
  } else {
    return (
      <ReflexContainer orientation="horizontal">
        <ReflexElement minSize={190} className="paper_main">
          {children}
        </ReflexElement>
        {/* <ReflexSplitter />
        <ReflexElement minSize={100} size={400} className="paper_detail">
          
        </ReflexElement> */}
      </ReflexContainer>
    );
  }
});

export { CReflexBox };
