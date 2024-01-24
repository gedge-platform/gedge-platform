import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { CDialogNew } from "@/components/dialogs";
import { swalError } from "../../../../../utils/swal-utils";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FaasStore from "../../../../../store/Faas";
import { useEffect } from "react";

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

const CreateTrigger = observer((props) => {
  const { open, reloadFunc } = props;
  const triggerType = ["HTTP", "KafkaQueue"];
  const [postType, setPostType] = useState("");

  const {
    loadFuncionsListAPI,
    functionsList,
    createTrigger,
    setTriggerHttpInputs,
    triggerHttpInputs,
    triggerKatkaQueue,
    setTriggerKatkaQueue,
    resetTriggerHttpInputs,
    resetTriggerKatkaQueue,
  } = FaasStore;

  useEffect(() => {
    loadFuncionsListAPI();
  }, []);

  const handleClose = () => {
    props.onClose && props.onClose();
    resetTriggerHttpInputs();
    resetTriggerKatkaQueue();
    setPostType("");
  };

  const postTrigger = async () => {
    const checkRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])*$/;
    const checkNum = /^[0-9]*$/;
    if (postType === "HTTP") {
      if (triggerHttpInputs.trig_name === "") {
        swalError("Trigger 이름을 입력해주세요");
        return;
      } else if (!checkRegex.test(triggerHttpInputs.trig_name)) {
        swalError("영어소문자와 숫자만 입력해주세요.");
        return;
      } else if (triggerHttpInputs.function === "") {
        swalError("function 이름을 선택해주세요");
        return;
      } else if (triggerHttpInputs.method === "") {
        swalError("method를 입력해주세요");
        return;
      } else if (triggerHttpInputs.url === "") {
        swalError("url을 입력해주세요");
        return;
      } else {
        await createTrigger(triggerHttpInputs);
      }
    } else if (postType === "KafkaQueue") {
      if (triggerKatkaQueue.trig_name === "") {
        swalError("Trigger 이름을 입력해주세요");
        return;
      } else if (!checkRegex.test(triggerKatkaQueue.trig_name)) {
        swalError("영어소문자와 숫자만 입력해주세요.");
        return;
      } else if (triggerKatkaQueue.function === "") {
        swalError("function 이름을 선택해주세요");
        return;
      } else if (triggerKatkaQueue.mqtype === "") {
        swalError("KafkaQueue Type을 입력해주세요");
        return;
      } else if (triggerKatkaQueue.mqtkind === "") {
        swalError("KafkaQueue kind를 입력해주세요");
        return;
      } else if (triggerKatkaQueue.topic === "") {
        swalError("topic을 입력해주세요");
        return;
      } else if (triggerKatkaQueue.resptopic === "") {
        swalError("response topic을 입력해주세요");
        return;
      } else if (triggerKatkaQueue.errortopic === "") {
        swalError("error topic을 입력해주세요");
        return;
      } else if (triggerKatkaQueue.maxretries === "") {
        swalError("max retries을 입력해주세요");
        return;
      } else if (triggerKatkaQueue.cooldownperiod === "") {
        swalError("cooldown period를 입력해주세요");
        return;
      } else if (triggerKatkaQueue.pollinginterval === "") {
        swalError("polling interval를 입력해주세요");
        return;
      } else if (triggerKatkaQueue.metadata.length === 0) {
        swalError("metadata를 입력해주세요");
        return;
      } else if (triggerKatkaQueue.secret === "") {
        swalError("secret를 입력해주세요");
        return;
      } else {
        await createTrigger(triggerKatkaQueue);
      }
    } else {
      swalError("Trigger Type을 선택해주세요");
      return;
    }

    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
    resetTriggerHttpInputs();
    resetTriggerKatkaQueue();
    setPostType("");
  };

  const onChangeTrigger = (e) => {
    const { name, value } = e.target;
    setPostType(value);
    if (value === "HTTP") {
      setTriggerHttpInputs({
        ...triggerHttpInputs,
        [name]: "httptrigger",
      });
    } else {
      setTriggerKatkaQueue({
        ...triggerKatkaQueue,
        [name]: "mqtrigger",
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (postType === "HTTP") {
      setTriggerHttpInputs({
        ...triggerHttpInputs,
        [name]: value,
      });
    } else {
      setTriggerKatkaQueue({
        ...triggerKatkaQueue,
        [name]: value,
      });
    }
  };

  const onChangeMetadata = (e) => {
    const { name, value } = e.target;
    const metadata = value.split(", ");
    if (postType === "HTTP") {
      setTriggerHttpInputs({
        ...triggerHttpInputs,
        [name]: metadata,
      });
    } else {
      setTriggerKatkaQueue({
        ...triggerKatkaQueue,
        [name]: metadata,
      });
    }
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Trigger`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Trigger Type <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="trig_type" onChange={onChangeTrigger}>
                  <option value={""}>Select Post type</option>
                  {triggerType.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>
          <tr>
            <th>
              Trigger Name <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Trigger Name"
                className="form-fullWidth"
                name="trig_name"
                onChange={onChange}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <th>
              Function <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="function" onChange={onChange}>
                  <option value={""}>Select Post type</option>
                  {functionsList.map((item) => (
                    <option value={item.func_name}>{item.func_name}</option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>
          {postType === "HTTP" ? (
            <>
              <tr>
                <th>
                  Method <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Method"
                    className="form-fullWidth"
                    name="method"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Url <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Url"
                    className="form-fullWidth"
                    name="url"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
            </>
          ) : null}
          {postType === "KafkaQueue" ? (
            <>
              <tr>
                <th>
                  KafkaQueue Type <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="KafkaQueue Type"
                    className="form-fullWidth"
                    name="mqtype"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  KafkaQueue Kind <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="KafkaQueue Kind"
                    className="form-fullWidth"
                    name="mqtkind"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Topic <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Topic"
                    className="form-fullWidth"
                    name="topic"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Response Topic <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Response Topic"
                    className="form-fullWidth"
                    name="resptopic"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Error Topic <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Error Topic"
                    className="form-fullWidth"
                    name="errortopic"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Max Retries <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Max Retries"
                    className="form-fullWidth"
                    name="maxretries"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Cooldown Period <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Cooldown Period"
                    className="form-fullWidth"
                    name="cooldownperiod"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Polling Interval <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Pooling Interval"
                    className="form-fullWidth"
                    name="pollinginterval"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Metadata <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Metadata"
                    className="form-fullWidth"
                    name="metadata"
                    onChange={onChangeMetadata}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Secret <span className="requried">*</span>
                </th>
                <td>
                  <CTextField
                    type="text"
                    placeholder="Secret"
                    className="form-fullWidth"
                    name="secret"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </td>
              </tr>
            </>
          ) : null}
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
          <ButtonNext onClick={postTrigger}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});

export default CreateTrigger;
