import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { observer } from "mobx-react";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {},
  })
);

const CReflexBox = observer((props) => {
  const { children } = props;

  if (children.length > 1) {
    return (
      <ReflexContainer orientation="horizontal">
        <ReflexElement minSize={190} className="paper_main">
          {children[0]}
        </ReflexElement>
        <ReflexSplitter />

        <ReflexElement minSize={190} className="paper_detail">
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
      </ReflexContainer>
    );
  }
});

export { CReflexBox };
