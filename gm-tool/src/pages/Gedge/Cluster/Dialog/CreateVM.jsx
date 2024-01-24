import React, { useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import FormControl from "@material-ui/core/FormControl";
import styled from "styled-components";
import { clusterStore } from "@/store";
import { certificationStore } from "@/store";
import CreateAdvanced from "./CreateAdvanced";
import { swalError, swalLoading } from "@/utils/swal-utils";

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

const CreateVM = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);
  const { postVM, ProviderName, setProviderName, vmBody, setVMBody } =
    clusterStore;

  const ProviderList = ["AWS", "OPENSTACK", "GCP"];

  const handleClose = () => {
    props.onClose && props.onClose();
    setVMBody("name", "");
    setVMBody("config", "");
    setVMBody("image", "");
    setVMBody("flavor", "");
    setVMBody("disk", "50");
    setProviderName("");
    setStepValue(1);
  };

  const onClickStepOne = () => {
    if (ProviderName === "") {
      swalError("Provider Name를 선택해주세요");
      return;
    } else {
      setVMBody("provider", ProviderName);
      setStepValue(2);
      return;
    }
  };

  const verify = () => {
    if (vmBody.name === "") {
      swalError("이름을 입력해주세요!");
      return;
    }
    if (vmBody.config === "") {
      swalError("콘픽을 선택해주세요!");
      return;
    }
    if (vmBody.image === "") {
      swalError("OS이미지를 선택해주세요!");
      return;
    }
    if (vmBody.flavor === "" || vmBody.flavor === undefined) {
      swalError("사양을 선택해주세요!");
      return;
    }
    if (vmBody.disk === "") {
      swalError("Disk 용량을 입력해주세요!");
      return;
    }
    if (vmBody.provider === "") {
      swalError("provider를 입력해주세요!");
      return;
    }

    createVM(vmBody);
  };

  const createVM = async (body) => {
    swalLoading(
      "VM 생성중..",
      1000000,
      "이 창은 VM 생성이 완료되면 사라집니다.",
      props.onClose && props.onClose()
    );
    const result = await postVM(body);
    props.reloadFunc && props.reloadFunc();
  };

  const onChange = ({ target: { name, value } }) => {
    setProviderName(value);
  };

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <table className="tb_data_new tb_write">
            <tbody>
              <tr>
                <th>
                  Select Provider Name
                  <span className="requried">*</span>
                </th>
                <td>
                  <FormControl className="form_fullWidth">
                    <select name="ProviderName" onChange={onChange}>
                      <option value={""}>Select Provider</option>
                      {ProviderList.map((provider) => (
                        <option value={provider}>{provider}</option>
                      ))}
                    </select>
                  </FormControl>
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
              <ButtonNext onClick={(e) => onClickStepOne(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <CreateAdvanced provider={ProviderName} />
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
              <ButtonNext onClick={verify}>생성</ButtonNext>
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
      title={"Create VM"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreateVM;
