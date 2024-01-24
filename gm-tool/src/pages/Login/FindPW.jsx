import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandArea from "./BrandArea";
import "./css/Login.css";
import tit_findPW from "./images/tit_findPw.png";

const FindPW = () => {
  const [confirm, setConfirm] = useState(false);

  const [inputs, setInputs] = useState({
    username: "",
    id: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const { username, id, phone, password, passwordConfirm } = inputs;

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const nextSteps = () => {
    if (username === "") {
      swalError("이름을 입력해주세요!");
      return;
    }
    if (id === "") {
      swalError("아이디를 입력해주세요!");
      return;
    }
    if (phone === "") {
      swalError("핸드폰 번호를 입력해주세요!");
      return;
    }
  };

  return (
    <div id="login" className="wrap">
      <BrandArea />
      <div className="contentsArea">
        <div className="container">
          <div className="header">
            <div className="title">
              <img src={tit_findPW} alt="Find Password" />
            </div>
            <div className="txt">회원가입시 등록한 정보를 입력해주세요.</div>
          </div>
          {confirm ? (
            <div className="contents">
              <form method="">
                <ul className="inputList_form">
                  <li>
                    <label className="tit">새 비밀번호</label>
                    <div className="data">
                      <input
                        type="password"
                        placeholder="새 비밀번호를 입력해 주세요."
                        name="password"
                        value={password}
                        className="input_login"
                        onChange={handleChange}
                      />
                    </div>
                  </li>
                  <li>
                    <label className="tit">새 비밀번호 확인</label>
                    <div className="data">
                      <input
                        type="password"
                        placeholder="새 비밀번호를 다시 한번 입력해 주세요."
                        name="passwordConfirm"
                        value={passwordConfirm}
                        className="input_login"
                        onChange={handleChange}
                      />
                    </div>
                  </li>
                </ul>
                <div className="memberBtns">
                  <button
                    type="button"
                    className="btn_contained submit"
                    onClick={finalSteps}
                  >
                    <Link className="btn_contained submit" to="/Login">
                      확인
                    </Link>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="contents">
              <form method="">
                <ul className="inputList_form">
                  <li>
                    <label className="tit">이름</label>
                    <div className="data">
                      <input
                        type="text"
                        placeholder="이름을 입력해 주세요."
                        name="username"
                        value={username}
                        onChange={onChange}
                        className="input_login"
                      />
                    </div>
                  </li>
                  <li>
                    <label className="tit">아이디</label>
                    <div className="data">
                      <input
                        type="text"
                        placeholder="아이디를 입력해 주세요."
                        name="id"
                        value={id}
                        onChange={onChange}
                        className="input_login"
                      />
                    </div>
                  </li>
                  <li>
                    <label className="tit">핸드폰</label>
                    <div className="data">
                      <div className="wrap_inputBtn">
                        <input
                          type="text"
                          placeholder="핸드폰 번호를 입력해 주세요."
                          name="phone"
                          value={phone}
                          onChange={onChange}
                          className="input_login"
                        />
                        <button type="button" className="btn_outlined">
                          인증하기
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <label className="tit"></label>
                    <div className="data">
                      <input
                        type="text"
                        placeholder="인증번호를 입력해 주세요."
                        name=""
                        className="input_confirm"
                      />
                    </div>
                  </li>
                </ul>
                <div className="memberBtns">
                  <button
                    type="button"
                    className="btn_contained"
                    onClick={() => history.back()}
                  >
                    취소
                  </button>
                  <button type="submit" className="btn_contained submit">
                    확인
                  </button>
                </div>
              </form>
            </div>
          )}

          {false && (
            <div className="login-err">
              <p className="notice">일치하는 사용자 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPW;
