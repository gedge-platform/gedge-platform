import React, { useState } from "react";
import { CDialog } from "@/components/dialogs";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import { CTextField } from "@/components/textfields";
import { CSelectButton } from "@/components/buttons";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { observer } from "mobx-react";
import userStore from "../../../store/UserStore";
import { SERVER_URL } from "@/config.jsx";
import axios from "axios";

const UserAdd = observer((props) => {
  const { open } = props;
  const { loadUserList } = userStore;
  const [value, setValue] = useState("false");
  const [isID, setIsID] = useState(false);
  const [inputs, setInputs] = useState({
    id: "",
    name: "",
    password: "",
    email: "",
    department: "",
    role: "",
  });

  const { id, name, password, email, department, role } = inputs;

  const validCheck = () => {
    const emailReg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (id === "") {
      swalError("아이디를 입력해주세요!");
      return false;
    }
    if (!isID) {
      swalError("아이디 중복확인을 해주세요!");
      return false;
    }
    if (name === "") {
      swalError("이름을 확인해주세요!");
      return false;
    }
    if (password === "") {
      swalError("패스워드를 확인해주세요!");
      return false;
    }
    if (email === "" || !emailReg.test(email)) {
      swalError("이메일을 확인해주세요!");
      return false;
    }
    if (department === "") {
      swalError("부서 이름을 확인해주세요!");
      return false;
    }
    return true;
  };

  const onChange = ({ target }) => {
    const { value, name } = target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const checkID = async () => {
    if (id === "") {
      swalError("아이디를 입력해주세요!");
      return;
    }
    await axios
      .get(`${SERVER_URL}/check/${id}`)
      .then(({ data: { status } }) => {
        if (status === "true") {
          setIsID(true);
          swalError("사용가능한 아이디입니다.");
        } else {
          setIsID(false);
          swalError("사용중인 아이디입니다.");
          return;
        }
      })
      .catch((e) => console.log(e));
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const createUser = async () => {
    if (validCheck()) {
      await axios
        .post(`${SERVER_URL}/users`, {
          id,
          name,
          password,
          email,
          department,
          role,
          enabled: parseInt(value),
        })
        .then(({ status }) => {
          if (status === 201) {
            swalError("User 생성이 완료되었습니다.");
            loadUserList();
            handleClose();
          } else {
            swalError("User 생성에 실패하였습니다..");
            return;
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const handleCreateAlert = () => {
    swalUpdate("추가하시겠습니까?", createUser);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const actionList = [
    {
      name: "사용자",
      onClick: () => {
        setInputs({
          ...inputs,
          role: "USER",
        });
      },
    },
    {
      name: "관리자",
      onClick: () => {
        setInputs({
          ...inputs,
          role: "ADMIN",
        });
      },
    },
  ];
  return (
    <CDialog
      id="myDialog"
      open={open}
      maxWidth="sm"
      title={`User 생성`}
      onClose={handleClose}
      onCustom={handleCreateAlert}
      modules={["custom", "close"]}
    >
      <table className="tb_data tb_write">
        <tbody>
          <tr>
            <th>User ID</th>
            <td>
              <CTextField
                id="template-name"
                type="text"
                name="id"
                onChange={onChange}
                value={id}
                placeholder="User Id"
                className="form_fullWidth"
              />
            </td>
            <td style={{ display: "flex" }}>
              <button
                type="button"
                style={{
                  width: "100%",
                  height: "30px",
                  backgroundColor: "#0a2348",
                  color: "white",
                  fontSize: "bold",
                  borderRadius: "2px",
                  fontSize: "13px",
                  border: "none",
                }}
                onClick={checkID}
              >
                중복확인
              </button>
            </td>
          </tr>
          <tr>
            <th>User 이름</th>
            <td>
              <CTextField
                id="template-name"
                type="text"
                name="name"
                onChange={onChange}
                value={name}
                placeholder="User 이름"
                className="form_fullWidth"
              />
            </td>
            <th>비밀번호</th>
            <td>
              <CTextField
                id="template-name"
                type="password"
                name="password"
                onChange={onChange}
                value={password}
                placeholder="User PW"
                className="form_fullWidth"
              />
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
              <CTextField
                id="template-mail"
                type="text"
                name="email"
                onChange={onChange}
                value={email}
                placeholder="User Email"
                className="form_fullWidth"
              />
            </td>
            <th>부서</th>
            <td>
              <CTextField
                id="template-mail"
                type="text"
                name="department"
                onChange={onChange}
                value={department}
                placeholder="부서를 입력해주세요."
                className="form_fullWidth"
              />
            </td>
          </tr>
          <tr>
            <th>역할</th>
            <td>
              <CSelectButton items={actionList}>
                {role === "" ? "역할 선택" : role}
              </CSelectButton>
            </td>
            <th>승인 여부</th>
            <td>
              <RadioGroup value={value} onChange={handleChange}>
                <FormControlLabel value="1" control={<Radio />} label="승인" />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="승인 대기"
                />
              </RadioGroup>
            </td>
          </tr>
          {/* <tr>
                        <th>API 설명</th>
                        <td colSpan="3"><textarea placeholder="내용을 입력하세요." rows="10"></textarea></td>
                    </tr> */}
        </tbody>
      </table>
    </CDialog>
  );
});
export default UserAdd;
