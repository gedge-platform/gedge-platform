import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";
import theme from "@/styles/theme";

const CloseBtn = styled.button`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 37px;
  height: 32px;
  border: 0;
  background: transparent;
  .btnLabel_icon.close {
    background-image: url(../images/bullet/dailog_close.png);
  }
`;

const CDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      <div>{children}</div>
      <CloseBtn onClick={onClose}>
        <span className="btnLabel_icon close">Close</span>
      </CloseBtn>
    </DialogTitle>
  );
};

export { CDialogTitle };
