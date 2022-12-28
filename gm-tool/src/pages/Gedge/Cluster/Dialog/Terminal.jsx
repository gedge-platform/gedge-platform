import React from "react";
import { CDialogNew } from "@/components/dialogs";
import styled from "styled-components";
import { observer } from "mobx-react";
import { TerminalUI } from "./TerminalUI";

const Button = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
`;

const Terminal = observer(props => {
  const { open } = props;
  // const { getYamlFile } = volumeStore;
  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const ViewOfComponent = () => {
    return (
      <>
        <TerminalUI />
        {/* <TerminalUI2 /> */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={"CMD"} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      {ViewOfComponent()}
    </CDialogNew>
  );
});
export default Terminal;
