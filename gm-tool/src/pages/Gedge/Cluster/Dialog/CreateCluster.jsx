import React, { useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { clusterStore, addressStore } from "@/store";
import { swalError } from "@/utils/swal-utils";
import SearchAddress from "../Dialog/SearchAddress";

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

const CreateCluster = observer((props) => {
  const { open } = props;
  const [openAddress, setOpenAddress] = useState(false);
  const { postCluster } = clusterStore;
  const { loadAddress, clusterAddress } = addressStore;

  const [inputs, setInputs] = useState({
    clusterName: "",
    clusterEndpoint: "",
    clusterToken: "",
  });
  const { clusterName, clusterEndpoint, clusterToken } = inputs;

  const clusterType = props.type;

  const handleClose = () => {
    props.onClose && props.onClose();
    setInputs({
      clusterName: "",
      clusterEndpoint: "",
      clusterToken: "",
    });
  };

  const onClickCreateCluster = () => {
    const endpointReg =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;

    if (clusterName === "") {
      swalError("이름을 입력해주세요!");
      return;
    }
    if (clusterEndpoint === "" || !endpointReg.test(clusterEndpoint)) {
      swalError("엔드포인트를 입력해주세요!");
      return;
    }
    if (clusterToken === "") {
      swalError("토큰을 입력해주세요!");
      return;
    }
    if (clusterAddress === "") {
      swalError("주소를 입력해주세요!");
      return;
    } else {
      const body = {
        clusterType: clusterType,
        clusterName: clusterName,
        clusterEndpoint: clusterEndpoint,
        token: clusterToken,
        address: clusterAddress,
      };
      createCluster(body);
    }
  };

  const createCluster = async (body) => {
    const result = await postCluster(body);
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const searchAddressOpen = () => {
    setOpenAddress(true);
  };

  const searchAddressClose = () => {
    setOpenAddress(false);
  };

  const onChange = ({ target }) => {
    const { value, name } = target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Cluster`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Type <span className="requried">*</span>
            </th>
            <td style={{ width: "50%" }}>
              <CTextField
                type="text"
                className="form_fullWidth"
                name="clusterType"
                value={clusterType}
                disabled
              />
            </td>
          </tr>
          {props.type == "cloud" && (
            <>
              <tr>
                <th>
                  Cloud Type
                  <span className="requried">*</span>
                </th>
                <td>
                  <FormControl className="form_fullWidth">
                    <select name="cloudType" onChange={onChange}>
                      <option value="aws">AWS</option>
                      <option value="openstack">OpenStack</option>
                    </select>
                  </FormControl>
                </td>
              </tr>
            </>
          )}
          <tr>
            <th>
              Cluster Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Cluster Name"
                className="form_fullWidth"
                name="clusterName"
                onChange={onChange}
                value={clusterName}
              />
            </td>
          </tr>
          <tr>
            <th>
              Cluster Endpoint
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Cluster Endpoint"
                className="form_fullWidth"
                name="clusterEndpoint"
                onChange={onChange}
                value={clusterEndpoint}
              />
            </td>
          </tr>
          <tr>
            <th>
              Token
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Token"
                className="form_fullWidth"
                name="clusterToken"
                onChange={onChange}
                value={clusterToken}
              />
            </td>
          </tr>
          <tr>
            <th>
              Address
              <span className="requried">*</span>
            </th>
            {clusterAddress == "" && (
              <>
                <td>
                  <CTextField
                    type="text"
                    placeholder="address"
                    className="form_fullWidth"
                    name="address"
                    onClick={searchAddressOpen}
                  />
                </td>
              </>
            )}
            {clusterAddress != "" && (
              <>
                <td>
                  <CTextField
                    type="text"
                    placeholder="address"
                    className="form_fullWidth"
                    name="clusterAddress"
                    onChange={onChange}
                    value={clusterAddress}
                  />
                </td>
              </>
            )}
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
          <ButtonNext onClick={onClickCreateCluster}>생성</ButtonNext>
        </div>
      </div>
      <SearchAddress open={openAddress} onClose={searchAddressClose} />
    </CDialogNew>
  );
});
export default CreateCluster;
