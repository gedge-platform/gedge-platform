import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandArea from "./BrandArea";
import "./css/Login.css";
import tit_findId from "./images/tit_findId.png";

const FindID = () => {
  const [userId, setUserId] = useState("");
  const [isResult, setIsResult] = useState(false);
  const [inputs, setInputs] = useState({
    id: "",
    username: "",
    phone: "",
  });
  const { username, phone } = inputs;

  const onChange = e => {
    // console.log(e.target.value);
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
    if (phone === "") {
      swalError("핸드폰 번호를 입력해주세요!");
      return;
    }
  };

  // const findIdCheck = async (e) => {
  //   e.preventDefault();
  //   nextSteps();
  //   // console.log("tt");
  //   await axios
  //     .post(`${SERVER_URL}/user/search/id`, {
  //       username,
  //       phone,
  //     })
  //     .then((res) => {
  //       // console.log(res.data);
  //       if (res.data) {
  //         setUserId(res.data.id);
  //         setIsResult(true);
  //         // swal(`아이디는 ${res.data.id}입니다.`);
  //       } else {
  //         swal("일치하는 정보가 없습니다.");
  //       }
  //     })
  //     .catch((e) => console.log(e));
  // };

  return (
    <div id="login" className="wrap">
      <BrandArea />
      <div className="contentsArea">
        <div className="lang">
          <select name="" className="select_login_s">
            <option value="">kor</option>
          </select>
        </div>
        <div className="container">
          <div className="header">
            <div className="title">
              <img src={tit_findId} alt="Find ID" />
            </div>
            <div className="txt">회원가입시 등록한 정보를 입력해주세요.</div>
          </div>
          {isResult ? (
            <div className="contents">
              <div className="find-result">
                <p className="find-result-id">
                  아이디는 <strong>{userId}</strong> 입니다.
                </p>
                <p className="find-result-txt">로그인하시면 서비스를 이용하실 수 있습니다.</p>
              </div>
              <div className="memberBtns">
                <Link className="btn_contained submit" to="/Login">
                  로그인 페이지로 이동
                </Link>
              </div>
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
                    <label className="tit">&nbsp;</label>
                    <div className="data">
                      <input type="text" placeholder="인증번호를 입력하세요." name="" className="input_confirm" />
                    </div>
                  </li>
                </ul>
                <div className="memberBtns">
                  <button type="button" className="btn_contained" onClick={() => history.back()}>
                    취소
                  </button>
                  <button
                    type="submit"
                    className="btn_contained submit"
                    // onClick={findIdCheck}
                    // setIsResult(true);
                  >
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

export default FindID;
