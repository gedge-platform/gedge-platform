import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { CDialogNew } from "@/components/dialogs";
import styled from "styled-components";
import { swalError } from "@/utils/swal-utils";
import { certificationStore } from "@/store";
import SelectProvider from "./SelectProvider";
import CreateAWS from "./CreateAWS";
import CreateOPENSTACK from "./CreateOPENSTACK";
import CreateGCP from "./CreateGCP";
import { Domain } from "@mui/icons-material";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
`;

const ButtonNext = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
`;

const CreateCertification = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const {
    CredentialName,
    ProviderName,
    ClientId,
    ClientSecret,
    IdentityEndPoint,
    Username,
    Password,
    DomainName,
    ProjectID,
    Region,
    Zone,
  } = certificationStore;

  const { postCredential } = certificationStore;

  const handleClose = () => {
    props.onClose && props.onClose();
    setStepValue(1);
  };

  const onClickStepTwo = () => {
    if (ProviderName === "") {
      swalError("Provider Name를 선택해주세요");
      return;
    } else if (ProviderName === "AWS") {
      setStepValue(2);
    } else if (ProviderName === "OPENSTACK") {
      setStepValue(2);
    } else if (ProviderName === "GCP") {
      setStepValue(2);
    } else {
      return;
    }
  };

  const onClickCreateOPENSTACK = () => {
    if (CredentialName === "") {
      swalError("Name을 입력해주세요");
      return;
    }
    if (DomainName === "") {
      swalError("DomainName를 입력해주세요");
      return;
    }
    if (IdentityEndPoint === "") {
      swalError("Identity Endpoint을 입력해주세요");
      return;
    }
    if (Password === "") {
      swalError("Password를 입력해주세요");
      return;
    }
    if (ProjectID === "") {
      swalError("projectID를 입력해주세요");
      return;
    }
    if (Username === "") {
      swalError("Username를 입력해주세요");
      return;
    }
    if (Region === "") {
      swalError("Region을 입력해주세요");
      return;
    } else {
      createCredential();
    }
  };

  const onClickCreateAWS = () => {
    if (CredentialName === "") {
      swalError("Name을 입력해주세요");
      return;
    }
    if (ClientId === "") {
      swalError("ClientId를 입력해주세요");
      return;
    }
    if (ClientSecret === "") {
      swalError("Client Secert을 입력해주세요");
      return;
    }
    if (Region === "") {
      swalError("Region을 입력해주세요");
      return;
    }
    if (Zone === "") {
      swalError("Zone을 입력해주세요");
      return;
    } else {
      createCredential();
    }
  };

  const onClickCreateGCP = () => {
    if (CredentialName === "") {
      swalError("Name을 입력해주세요");
      return;
    }
    if (ProjectID === "") {
      swalError("ProjectID를 입력해주세요");
      return;
    }
    if (ClientId === "") {
      swalError("ClientEmail를 입력해주세요");
      return;
    }
    if (ClientSecret === "") {
      swalError("PrivateKey을 입력해주세요");
      return;
    }
    if (Region === "") {
      swalError("Region을 입력해주세요");
      return;
    }
    if (Zone === "") {
      swalError("Zone을 입력해주세요");
      return;
    } else {
      createCredential();
    }
  };

  const createCredential = async () => {
    if (ProviderName === "OPENSTACK") {
      const inputs = {
        CredentialName: CredentialName,
        ProviderName: ProviderName,
        IdentityEndPoint: IdentityEndPoint,
        Username: Username,
        Password: Password,
        ProjectID: ProjectID,
        Region: Region,
        DomainName: DomainName,
        Zone: Zone,
      };
      const result = await postCredential(inputs);
    } else if (ProviderName === "AWS") {
      const inputs = {
        CredentialName: CredentialName,
        ProviderName: ProviderName,
        ClientId: ClientId,
        ClientSecret: ClientSecret,
        Region: Region,
        Zone: Zone,
      };
      const result = await postCredential(inputs);
    } else if (ProviderName === "GCP") {
      const inputs = {
        CredentialName: CredentialName,
        ProviderName: ProviderName,
        ProjectID: ProjectID,
        ClientId: ClientId,
        ClientSecret: ClientSecret,
        Region: Region,
      };
      const result = await postCredential(inputs);
    }
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <SelectProvider />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "240px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={() => onClickStepTwo()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2 && ProviderName == "AWS") {
      return (
        <>
          <CreateAWS />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "300px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={onClickCreateAWS}>생성</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2 && ProviderName == "OPENSTACK") {
      return (
        <>
          <CreateOPENSTACK />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "240px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={onClickCreateOPENSTACK}>생성</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2 && ProviderName == "GCP") {
      return (
        <>
          <CreateGCP />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "240px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={onClickCreateGCP}>생성</ButtonNext>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Create Credential"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreateCertification;
