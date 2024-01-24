import axios from "axios";
import React, { useEffect, useState } from "react";
import { swalError } from "@/utils/swal-utils";
import { SERVER_URL } from "@/config.jsx";

const EnterInfo = ({ setStep }) => {
  const [inputs, setInputs] = useState({
    id: "",
    name: "",
    password: "",
    passwordConfirm: "",
    email: "",
    department: "",
  });
  const { id, name, password, passwordConfirm, email, department } = inputs;
  const [isID, setIsID] = useState(false);
  const onChange = (e, type) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

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
    if (
      password === "" ||
      passwordConfirm === "" ||
      password !== passwordConfirm
    ) {
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

  const nextStep = async (e) => {
    e.preventDefault();
    if (validCheck()) {
      await axios
        .post(`${SERVER_URL}/users`, {
          id,
          name,
          password,
          email,
          department,
          role: "USER",
        })
        .then(({ status }) => {
          if (status === 201) {
            setStep((prev) => prev + 1);
          } else {
            swal("회원가입에 실패하였습니다.");
            return;
          }
        })
        .catch((e) => console.log(e));
    }
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

  return (
    <div className="contentsArea">
      <div className="container">
        <div className="contents">
          <div className="signup-step">
            <div className="step">
              <span className="ico terms">약관 및 동의</span>
            </div>
            <div className="arr"></div>
            <div className="step current">
              <span className="ico register">정보 입력</span>
            </div>
            <div className="arr"></div>
            <div className="step">
              <span className="ico complete">회원가입 완료</span>
            </div>
          </div>
          <ul className="inputList_form" style={{ paddingTop: "20px" }}>
            <li>
              <label className="tit">아이디</label>
              <div className="data">
                <div className="wrap_inputBtn">
                  <input
                    type="text"
                    placeholder="아이디를 입력해 주세요."
                    name="id"
                    value={id}
                    onChange={onChange}
                    className="input_login"
                  />
                  <button
                    type="button"
                    className="btn_outlined"
                    onClick={checkID}
                  >
                    중복확인
                  </button>
                </div>
              </div>
            </li>
            <li>
              <label className="tit">이름</label>
              <div className="data">
                <input
                  type="text"
                  placeholder="이름을 입력해 주세요."
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="input_login"
                />
              </div>
            </li>
            <li>
              <label className="tit">비밀번호</label>
              <div className="data">
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="input_login"
                />
              </div>
            </li>
            <li>
              <label className="tit">비밀번호 확인</label>
              <div className="data">
                <input
                  type="password"
                  placeholder="비밀번호를 한번 더 입력해주세요."
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={onChange}
                  className="input_login"
                />
              </div>
            </li>
          </ul>

          <ul className="inputList_form">
            <li>
              <label className="tit">이메일</label>
              <div className="data">
                <input
                  type="email"
                  placeholder="이메일을 입력해 주세요."
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="input_login"
                />
              </div>
            </li>
            <li>
              <label className="tit">부서</label>
              <div className="data">
                <div className="wrap_inputBtn">
                  <input
                    type="text"
                    placeholder="핸드폰 번호를 입력해 주세요."
                    name="department"
                    value={department}
                    onChange={onChange}
                    className="input_login"
                  />
                </div>
              </div>
            </li>
          </ul>

          <div className="memberBtns">
            <button
              type="submit"
              className="btn_outlined"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <span className="ico prev">이전</span>
            </button>

            <button className="btn_outlined" onClick={(e) => nextStep(e)}>
              <span className="ico next">다음</span>
            </button>
          </div>
        </div>
        {false && (
          <div className="login-err">
            <p className="notice">에러 메세지.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterInfo;
