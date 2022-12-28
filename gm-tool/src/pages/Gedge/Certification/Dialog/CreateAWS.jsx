import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { swalError } from "@/utils/swal-utils";
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

const CreateAWS = observer(props => {
  // const { open } = props;
  const [inputs, setInputs] = useState({
    CredentialName: "",
    ProviderName: "OPENSTACK",
    ClientId: "",
    ClientSecret: "",
    Region: "",
    Zone: "",
  });

  const { CredentialName, ProviderName, ClientId, ClientSecret, Region, Zone } = inputs;

  const { postCredential, setCredentialName, setClientId, setClientSecret, setRegion, setZone } = certificationStore;

  const handleClose = () => {
    props.onClose && props.onClose();
    setInputs({
      CredentialName: "",
      ProviderName: "",
      ClientId: "",
      ClientSecret: "",
      Region: "",
      Zone: "",
    });
  };

  const onChange = e => {
    const { value, name } = e.target;
    if (name === "CredentialName") {
      setCredentialName(value);
      return;
    } else if (name === "ClientId") {
      setClientId(value);
      return;
    } else if (name === "ClientSecret") {
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

  const createCredential = async () => {
    const result = await postCredential(inputs);
    handleClose();
    props.reloadFunc && props.reloadFunc();
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
              Client Id
              <span className="required">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Client ID" className="form_fullWidth" name="ClientId" onChange={onChange} value={ClientId} />
            </td>
          </tr>
          <tr>
            <th>
              Client Secret
              <span className="required">*</span>
            </th>
            <td>
              <CTextField
                type="Password"
                placeholder="Clinet Secret"
                className="form_fullWidth"
                name="ClientSecret"
                onChange={onChange}
                value={ClientSecret}
              />
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
export default CreateAWS;
