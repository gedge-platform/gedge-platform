import React from "react";
import { includes } from "lodash-es";
import DialogActions from "@material-ui/core/DialogActions";
import { CButton } from "@/components/buttons/CButton";

const CDialogTopAction = (props) => {
  const { topModules, onUpdate, onDelete, ...other } = props;

  const editButton = includes(topModules, "update") && (
    <CButton type="btn1" onClick={onUpdate} buttonEventType="submit">
      수정
    </CButton>
  );

  const deleteButton = includes(topModules, "delete") && (
    <CButton type="btn1" onClick={onDelete}>
      삭제
    </CButton>
  );

  return (
    <DialogActions {...other}>
      {editButton}
      {deleteButton}
    </DialogActions>
  );
};

export { CDialogTopAction };
