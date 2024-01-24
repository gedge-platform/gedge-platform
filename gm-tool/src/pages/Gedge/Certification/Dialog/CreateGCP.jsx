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

const CreateGCP = observer(props => {
  // const { open } = props;
  const [inputs, setInputs] = useState({
    credentialName: "",
    ProviderName: "GCP",
    ProjectID: "",
    ClientId: "",
    ClientSecret: "",
    Region: "",
    Zone: "",
  });

  const { CredentialName, ProviderName, ProjectID, ClientId, ClientSecret, Region, Zone } = inputs;

  const { setCredentialName, setProjectID, setClientId, setClientSecret, setRegion, setZone } =
    certificationStore;


  const onChange = e => {
    const { value, name } = e.target;
    if (name === "CredentialName") {
      setCredentialName(value);
      return;
    } else if (name === "ProjectID") {
      setProjectID(value);
      return;
    } else if (name === "ClientEmail") {
      setClientId(value);
      return;
    } else if (name === "PrivateKey") {
      setClientSecret(value);
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
              Project ID
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Project ID" className="form_fullWidth" name="ProjectID" onChange={onChange} value={ProjectID} />
            </td>
          </tr>
          <tr>
            <th>
              Client Email
              <span className="required">*</span>
            </th>
            <td>
            <CTextField type="text" placeholder="Client Email" className="form_fullWidth" name="ClientEmail" onChange={onChange} value={ClientId} />
            </td>
          </tr>
          <tr>
            <th>
              Private Key
              <span className="required">*</span>
            </th>
            <td>
            <CTextField type="text" placeholder="Private Key" className="form_fullWidth" name="PrivateKey" onChange={onChange} value={ClientSecret} />
            </td>
          </tr>
          <tr>
            <th>
              Region
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Region. ex) us-east1" className="form_fullWidth" name="Region" onChange={onChange} value={Region} />
            </td>
          </tr>
          <tr>
            <th>
              Zone
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Zone. ex) us-east1-b" className="form_fullWidth" name="Zone" onChange={onChange} value={Zone} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});
export default CreateGCP;
