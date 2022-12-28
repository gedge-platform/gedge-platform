import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import { certificationStore } from "@/store";

const CreateAWS = observer(props => {
  const [inputs, setInputs] = useState({
    CredentialName: "",
    ProviderName: "AWS",
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
