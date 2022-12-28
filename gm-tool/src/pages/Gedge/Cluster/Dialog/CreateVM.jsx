import React, { useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import FormControl from "@material-ui/core/FormControl";
import styled from "styled-components";
import { clusterStore } from "@/store";
import CreateAWS from "./CreateAWS";
import CreateOPENSTACK from "./CreateOPENSTACK";

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

const CreateVM = observer(props => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);
  const { postVM, ProviderName, setProviderName } = clusterStore;

  const ProviderList = ["AWS", "OPENSTACK"];

  const [inputs, setInputs] = useState({
    name: "",
    config: "",
    image: "",
    flavor: "",
  });
  const { name, config, image, flavor } = inputs;

  const handleClose = () => {
    props.onClose && props.onClose();
    setInputs({
      name: "",
      config: "",
      image: "",
      flavor: "",
    });
  };

  const onClickStepTwo = () => {
    if (ProviderName === "") {
      swalError("Provider Name를 선택해주세요");
      return;
    }
    if (ProviderName === "AWS") {
      console.log(ProviderName);
      setStepValue(2);
    }
    if (ProviderName === "OPENSTACK") {
      console.log(ProviderName);
      setStepValue(2);
    } else {
      return;
    }
  };

  const verify = () => {
    if (ProviderName === "AWS") {
      if (name === "") {
        swalError("이름을 입력해주세요!");
        return;
      }
      if (config === "") {
        swalError("콘픽을 선택해주세요!");
        return;
      }
      if (image === "") {
        swalError("OS이미지를 선택해주세요!");
        return;
      }
      if (flavor === "") {
        swalError("사양을 선택해주세요!");
        return;
      }
    }
    if (ProviderName === "OPENSTACK") {
      if (name === "") {
        swalError("이름을 입력해주세요!");
        return;
      }
      if (config === "") {
        swalError("콘픽을 선택해주세요!");
        return;
      }
      if (image === "") {
        swalError("OS이미지를 선택해주세요!");
        return;
      }
      if (flavor === "") {
        swalError("사양을 선택해주세요!");
        return;
      }
    }
    createVM(body);
  };

  const createVM = async body => {
    const result = await postVM(body);
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const onChange = ({ target: { name, value } }) => {
    if (value === "AWS") setProviderName(value);
    else if (value === "OPENSTACK") setProviderName(value);
  };

  // useEffect(props => {
  //   console.log("props is ", props);
  // }, []);

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
                      {ProviderList.map(provider => (
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
    }
  };

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={"Create VM"} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreateVM;
