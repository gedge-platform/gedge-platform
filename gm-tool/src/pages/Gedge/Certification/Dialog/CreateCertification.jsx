import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "../../../../components/dialogs";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { swalError } from "../../../../utils/swal-utils";
import certificationStore from "../../../../store/Certification";

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
  const [inputs, setInputs] = useState({
    CredentialName: "",
    ProviderName: "",
    IdentityEndPoint: "",
    Username: "",
    Password: "",
    DomainName: "",
    ProjectID: "",
  });
  // const {
  //   CredentialName,
  //   ProviderName,
  //   IdentityEndPoint,
  //   Username,
  //   Password,
  //   DomainName,
  //   ProjectID,
  //   setContent,
  // } = certificationStore;

  // const template = {
  //   CredentialName: CredentialName,
  //   ProviderName: ProviderName,
  //   KeyValueInfoList: [
  //     {
  //       Key: "IdentityEndPoint",
  //       Value: IdentityEndPoint,
  //     },
  //     {
  //       Key: "Username",
  //       Value: Username,
  //     },
  //     {
  //       Key: "Password",
  //       Value: Password,
  //     },
  //     {
  //       Key: "DomainName",
  //       Value: DomainName,
  //     },
  //     {
  //       Key: "ProjectID",
  //       Value: ProjectID,
  //     },
  //   ],
  // };

  const {
    CredentialName,
    DomainName,
    IdentityEndPoint,
    Password,
    ProjectID,
    Username,
    ProviderName,
  } = inputs;

  const { postCredential, setDomainName, setCredentialName, setProviderName } =
    certificationStore;

  const handleClose = () => {
    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
  };

  const onChange = ({ target: { name, value } }) => {
    // const { value, name } = e.target;
    // switch (name) {
    //   case "CredentialName":
    //     setCredentialName(value);
    //   case "Domainame":
    //     setDomainName(value);
    //   case "ProviderName":
    //     setProviderName(value);
    // }
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickCreateCertification = () => {
    if (CredentialName === "") {
      swalError("Name을 입력해주세요");
      return;
    }
    if (DomainName === "") {
      swalError("password를 입력해주세요");
      return;
    }
    if (IdentityEndPoint === "") {
      swalError("domain Name을 입력해주세요");
      return;
    }
    if (Password === "") {
      swalError("projectID를 입력해주세요");
      return;
    }
    if (ProjectID === "") {
      swalError("endpoint address를 입력해주세요");
      return;
    }
    if (Username === "") {
      swalError("endpoint address를 입력해주세요");
      return;
    }
    if (ProviderName === "") {
      swalError("endpoint address를 입력해주세요");
      return;
    } else {
      createCredential();
    }
  };

  const createCredential = async () => {
    // postCredential(require("json-to-pretty-yaml").stringify(template));
    // console.log(
    //   postCredential(require("json-to-pretty-yaml").stringify(template))
    // );
    const result = await postCredential(inputs);
  };

  useEffect(() => {
    // const YAML = require("json-to-pretty-yaml");
    // setContent(YAML.stringify(template));
  });

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Credential`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Credential Name
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Credential Name"
                className="form_fullWidth"
                name="CredentialName"
                onChange={onChange}
                value={CredentialName}
              />
            </td>
          </tr>
          <tr>
            <th>
              Domain Name
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Domain Name"
                className="form_fullWidth"
                name="DomainName"
                onChange={onChange}
                value={DomainName}
              />
            </td>
          </tr>
          <tr>
            <th>
              IdentityEndPoint
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="IdentityEndPoint"
                className="form_fullWidth"
                name="IdentityEndPoint"
                onChange={onChange}
                value={IdentityEndPoint}
              />
            </td>
          </tr>
          <tr>
            <th>
              Password
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="password"
                placeholder="Password"
                className="form_fullWidth"
                name="Password"
                onChange={onChange}
                value={Password}
              />
            </td>
          </tr>
          <tr>
            <th>
              ProjectID
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="ProjectID"
                className="form_fullWidth"
                name="ProjectID"
                onChange={onChange}
                value={ProjectID}
              />
            </td>
          </tr>
          <tr>
            <th>
              Username
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="USername"
                className="form_fullWidth"
                name="Username"
                onChange={onChange}
                value={Username}
              />
            </td>
          </tr>
          <tr>
            <th>
              ProviderName
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="ProviderName"
                className="form_fullWidth"
                name="ProviderName"
                onChange={onChange}
                value={ProviderName}
              />
            </td>
          </tr>
        </tbody>
      </table>
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
          <ButtonNext onClick={onClickCreateCertification}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});
export default CreateCertification;
