import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { FormControl } from "@material-ui/core";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { userStore } from "@/store";
import { swalError } from "@/utils/swal-utils";

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

const UserInfo = observer((props) => {
  const { postUser, inputs, setInputs, inputsEdit, setInputsEdit } = userStore;

  const handleClose = () => {
    props.onClose && props.onClose();
    setInputs({
      memberId: "",
      memberName: "",
      password: "",
      email: "",
      contact: "",
      memberDescription: "",
      memberRole: "",
    });
  };

  const onChange = ({ target: { name, value } }) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickCreateUser = () => {
    if (memberId === "") {
      swalError("ID를 입력해주세요");
      return;
    }
    if (password === "") {
      swalError("Password를 입력해주세요");
      return;
    }
    if (memberName === "") {
      swalError("Name을 입력해주세요");
      return;
    }
    if (email === "") {
      swalError("Email을 입력해주세요");
      return;
    }
    if (contact === "") {
      swalError("Contact를 입력해주세요");
      return;
    } else {
      createUser();
    }
  };

  const createUser = async () => {
    const result = await postUser(inputs);
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  useEffect(() => {}, []);

  return (
    <>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Member Id
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Mermber Id"
                className="form_fullWidth"
                name="memberId"
                onChange={onChange}
                value={inputs.memberId}
              />
            </td>
          </tr>
          <tr>
            <th>
              Member Password
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="password"
                placeholder="Mermber Password"
                className="form_fullWidth"
                name="password"
                onChange={onChange}
                value={inputs.password}
              />
            </td>
          </tr>
          <tr>
            <th>
              Member Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Member Name"
                className="form_fullWidth"
                name="memberName"
                onChange={onChange}
                value={inputs.memberName}
              />
            </td>
          </tr>
          <tr>
            <th>
              Member Email
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Member Email"
                className="form_fullWidth"
                name="email"
                onChange={onChange}
                value={inputs.email}
              />
            </td>
          </tr>
          <tr>
            <th>
              Member Contact
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Member Contact"
                className="form_fullWidth"
                name="contact"
                onChange={onChange}
                value={inputs.contact}
              />
            </td>
          </tr>
          <tr>
            <th>
              Member Role <span className="requried">*</span>
            </th>
            <td style={{ width: "50%" }}>
              <FormControl className="form_fullWidth">
                <select name="memberRole" onChange={onChange}>
                  <option value={"PA"}>PA</option>
                  <option value={"SA"}>SA</option>
                </select>
              </FormControl>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});
export default UserInfo;
