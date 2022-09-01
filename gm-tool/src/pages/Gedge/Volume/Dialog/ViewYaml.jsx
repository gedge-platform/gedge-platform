import React, { useState, useEffect, useLayoutEffect } from "react";
import { CDialog } from "@/components/dialogs";
import { CDialogNew } from "../../../../components/dialogs";
import { swalUpdate } from "@/utils/swal-utils";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import { SERVER_URL } from "@/config.jsx";
import axios from "axios";
import { CButton } from "@/components/buttons";
import styled from "styled-components";
import { observer } from "mobx-react";
import VolumeYaml from "./VolumeYaml";
import volumeStore from "@/store/Volume";

const Button = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
`;

const ViewDialog = observer((props) => {
  const { open, yaml } = props;
  const { getYamlFile } = volumeStore;
  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const ViewOfComponent = () => {
    return (
      <>
        <VolumeYaml content={yaml} />
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
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Volume Yaml"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {ViewOfComponent()}
    </CDialogNew>
  );
});
export default ViewDialog;
