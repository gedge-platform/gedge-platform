import React from "react";
import { includes } from "lodash";
import DialogActions from "@material-ui/core/DialogActions";
import { CButton } from "@/components/buttons/CButton";

const CDialogAction = (props) => {
  const { modules, onCreate, onUpdate, onClose, onCustom, ...other } = props;

  const createButton = includes(modules, "create") && (
    <CButton type="btn1" onClick={onCreate} buttonEventType="submit">
      확인
    </CButton>
  );

  const confirmButton = includes(modules, "confirm") && (
    <CButton type="btn1" onClick={onClose}>
      확인
    </CButton>
  );

  const customButton = includes(modules, "custom") && (
    // <div>
    //   <CButton type="btn1" onClick={onCustom} buttonEventType="submit">
    //     저장
    //   </CButton>
    // </div>
    <></>
  );

  const editButton = includes(modules, "update") && (
    <CButton type="btn1" onClick={onUpdate} buttonEventType="submit">
      변경
    </CButton>
  );

  const closeButton = includes(modules, "close") && (
    <CButton type="btn1" onClick={onClose}>
      닫기
    </CButton>
  );

  return (
    <DialogActions {...other}>
      {createButton}
      {customButton}
      {editButton}
      {closeButton}
      {confirmButton}
    </DialogActions>
  );
};

export { CDialogAction };
