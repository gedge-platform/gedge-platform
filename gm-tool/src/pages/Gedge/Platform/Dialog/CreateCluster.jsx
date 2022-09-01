import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "../../../../components/dialogs";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import clusterStore from "../../../../store/Cluster";

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
  const { loadClusterList, clusterList } = clusterStore;

  const handleClose = () => {
    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
  };

  const onChange = ({ target: { value } }) => {
    console.log(value);
  };

  useEffect(() => {}, []);

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
              <FormControl className="form_fullWidth">
                <select name="type" onChange={onChange}>
                  <option value={"core"}>Core</option>
                  <option value={"edge"}>Edge</option>
                </select>
              </FormControl>
            </td>
          </tr>
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
                value={""}
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
                name="clusterEnpoint"
                onChange={onChange}
                value={""}
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
                name="token"
                onChange={onChange}
                value={""}
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
          <ButtonNext onClick={handleClose}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});
export default CreateCluster;
