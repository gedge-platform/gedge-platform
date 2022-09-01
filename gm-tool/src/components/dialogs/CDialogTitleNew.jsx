import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";
import theme from "@/styles/theme";

const CloseBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  width: 37px;
  height: 32px;
  border: 0;
  background: transparent;
  img {
    width: 18px;
  }
`;

const CDialogTitleNew = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      <div>{children}</div>
      <CloseBtn onClick={onClose}>
        <img src="../../images/bullet/close.png" alt="" />
        {/* <span className="btnLabel_icon close">Close</span> */}
      </CloseBtn>
    </DialogTitle>
  );
};

export { CDialogTitleNew };
