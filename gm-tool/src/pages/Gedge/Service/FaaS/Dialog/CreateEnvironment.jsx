import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { CDialogNew } from "@/components/dialogs";
import { swalError } from "../../../../../utils/swal-utils";
import { FormControl } from "@material-ui/core";
import FaasStore from "../../../../../store/Faas";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

const ButtonNext = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

const CreateEnvironment = observer((props) => {
  const { open } = props;
  const { envName, setEnvName, envImage, setEnvImage, PostEnvAPI } = FaasStore;

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "envName") {
      setEnvName(value);
    }

    if (name === "envImage") {
      setEnvImage(value);
    }
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const postEnvironment = () => {
    PostEnvAPI(envName, envImage);

    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
  };

  // const onChange = ({ target }) => {
  //   const { value, name } = target;
  //   setInputs({
  //     ...inputs,
  //     [name]: value,
  //   });
  // };

  // const checkID = async () => {
  //   if (id === "") {
  //     swalError("아이디를 입력해주세요!");
  //     return;
  //   }
  //   await axios
  //     .get(`${SERVER_URL}/check/${id}`)
  //     .then(({ data: { status } }) => {
  //       if (status === "true") {
  //         setIsID(true);
  //         swalError("사용가능한 이름입니다.");
  //       } else {
  //         setIsID(false);
  //         swalError("사용중인 이름입니다.");
  //         return;
  //       }
  //     })
  //     .catch(e => console.log(e));
  // };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Environment`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Name <span className="requried">*</span>
            </th>
            <td style={{ width: "50%" }}>
              <CTextField
                type="text"
                placeholder="Environment Name"
                className="form-fullWidth"
                name="envName"
                value={envName}
                onChange={onChange}
                style={{ width: "100%" }}
              />
            </td>
            <td style={{ display: "flex" }}>
              <button
                type="button"
                style={{
                  width: "60%",
                  height: "30px",
                  backgroundColor: "#0a2348",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  fontSize: "13px",
                  border: "none",
                }}
                // onClick={checkID}
              >
                중복확인
              </button>
            </td>
          </tr>
          <tr>
            <th>
              Image <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="envImage" value={envImage} onChange={onChange}>
                  <optgroup label="Node.js">
                    <option value={"fission/node-env"}>fission/node-env</option>
                    <option value={"fission/node-env-16"}>
                      fission/node-env-16
                    </option>
                    <option value={"fission/node-env-14"}>
                      fission/node-env-14
                    </option>
                    <option value={"fission/node-env-12"}>
                      fission/node-env-12
                    </option>
                    <option value={"fission/node-env-debian"}>
                      fission/node-env-debian
                    </option>
                  </optgroup>
                  <optgroup label="Go">
                    <option value={"fission/go-env"}>fission/go-env</option>
                    <option value={"fission/go-env-1.17"}>
                      fission/go-env-1.17
                    </option>
                    <option value={"fission/go-env-1.16"}>
                      fission/go-env-1.16
                    </option>
                    <option value={"fission/go-env-1.15"}>
                      fission/go-env-1.15
                    </option>
                    <option value={"fission/go-env-1.14"}>
                      fission/go-env-1.14
                    </option>
                    <option value={"fission/go-env-1.13"}>
                      fission/go-env-1.13
                    </option>
                    <option value={"fission/go-env-1.12"}>
                      fission/go-env-1.12
                    </option>
                    <option value={"fission/go-env-1.11.4"}>
                      fission/go-env-1.11.4
                    </option>
                    <option value={"fission/go-env-1.11.4-1.12"}>
                      fission/go-env-1.11.4-1.12
                    </option>
                    <option value={"fission/go-build-env"}>
                      fission/go-build-env
                    </option>
                  </optgroup>
                  <optgroup label="Python">
                    <option value={"fission/pyton3-env"}>
                      fission/pyton3-env
                    </option>
                    <option value={"fission/pyton3-env-3.10"}>
                      fission/pyton3-env-3.10
                    </option>
                  </optgroup>
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
          <ButtonNext onClick={postEnvironment}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});

export default CreateEnvironment;
