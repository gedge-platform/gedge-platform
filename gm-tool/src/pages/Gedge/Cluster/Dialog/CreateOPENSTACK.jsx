import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { certificationStore } from "@/store";

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

const CreateOPENSTACK = observer(props => {
  // const { open } = props;
  const [inputs, setInputs] = useState({
    credentialName: "",
    ProviderName: "OPENSTACK",
    IdentityEndPoint: "",
    Username: "",
    Password: "",
    DomainName: "",
    ProjectID: "",
    Region: "",
    Zone: "",
  });
  // const [input, setInput] = useState({
  //   CredentialName: "",
  //   ProviderName: "",
  //   CliendId: "",
  //   ClientSecret: "",
  //   Region: "",
  //   Zone: "",
  // });
  const { CredentialName, ProviderName, IdentityEndPoint, Username, Password, DomainName, ProjectID, Region, Zone } = inputs;

  // const{
  //   CredentialName,
  //   ProviderName,
  //   CliendId,
  //   ClientSecret,
  //   Region,
  //   Zone,
  // } = input;

  const { postCredential, setCredentialName, setIdentityEndPoint, setUsername, setPassword, setProjectID, setDomainName, setRegion, setZone } =
    certificationStore;

  // const onChange = ({ target: { name, value } }) => {
  //   console.log(name, value);
  //   setInputs({
  //     ...inputs,
  //     [name]: value,
  //   });
  // };

  // const onChange = (e) => {
  //   const { value, name } = e.target;
  //   switch (name) {
  //     case "CredentialName":
  //       setCredentialName(value);
  //       break;
  //     case "IdentityEndPoint":
  //       setIdentityEndPoint(value);
  //       break;
  //     case "Username":
  //       setUsername(value);
  //       break;
  //     case "Password":
  //       setPassword(value);
  //       break;
  //     case "DomainName":
  //       setDomainName(value);
  //       break;
  //     case "ProjectID":
  //       setProjectID(value);
  //       break;
  //     case "Region":
  //       setRegion(value);
  //       break;
  //     case "Zone":
  //       setZone(value);
  //       break;
  //   }
  // };

  const onChange = e => {
    const { value, name } = e.target;
    if (name === "CredentialName") {
      setCredentialName(value);
      return;
    } else if (name === "IdentityEndPoint") {
      setIdentityEndPoint(value);
      return;
    } else if (name === "Username") {
      setUsername(value);
      return;
    } else if (name === "Password") {
      setPassword(value);
      return;
    } else if (name === "DomainName") {
      setDomainName(value);
      return;
    } else if (name === "ProjectID") {
      setProjectID(value);
      return;
    } else if (name === "Region") {
      setRegion(value);
      return;
    } else if (name === "Zone") {
      setZone(value);
      return;
    }
  };

  useEffect(() => {});

  return (
    <>
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
              <CTextField type="text" placeholder="Domain Name" className="form_fullWidth" name="DomainName" onChange={onChange} value={DomainName} />
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
              <CTextField type="password" placeholder="Password" className="form_fullWidth" name="Password" onChange={onChange} value={Password} />
            </td>
          </tr>
          <tr>
            <th>
              ProjectID
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="ProjectID" className="form_fullWidth" name="ProjectID" onChange={onChange} value={ProjectID} />
            </td>
          </tr>
          <tr>
            <th>
              Username
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Username" className="form_fullWidth" name="Username" onChange={onChange} value={Username} />
            </td>
          </tr>
          <tr>
            <th>
              Region
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Region" className="form_fullWidth" name="Region" onChange={onChange} value={Region} />
            </td>
          </tr>
          <tr>
            <th>
              Zone
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Zone" className="form_fullWidth" name="Zone" onChange={onChange} value={Zone} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});
export default CreateOPENSTACK;
