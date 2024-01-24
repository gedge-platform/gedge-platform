import React, { useState } from "react";
import BrandArea from "./BrandArea";
import "./css/Login.css";
import tit_welcome from "./images/tit_welcome.png";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "@/config.jsx";
import { setItem } from "@/utils/sessionStorageFn";
import { swalError } from "@/utils/swal-utils";
import jwtDecode from "jwt-decode";
import { userStore } from "@/store";

const Login = () => {
  const [inputs, setInputs] = useState({
    id: "",
    password: "",
  });
  const [check, setCheck] = useState(false);
  const { id, password } = inputs;
  const { setUser, updateUser } = userStore;

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const login = async (e) => {
    e.preventDefault();
    if (id === "") {
      setCheck(true);
      return;
    }
    if (password === "") {
      setCheck(true);
      return;
    }
    setCheck(false);

    await axios
      .post(`${SERVER_URL}/auth`, inputs)

      .then(({ data }) => {
        const { accessToken, status } = data;
        if (status === 200) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          setItem("user", jwtDecode(accessToken));
          setItem("userRole", jwtDecode(accessToken).role);
          setItem("token", accessToken);
          setUser(jwtDecode(accessToken));
          setTimeout;

          const userRoles = jwtDecode(accessToken).role;

          if (userRoles === "PA") {
            swalError("로그인 되었습니다.", () => {
              window.location.replace("/total");
            });
          } else {
            swalError("로그인 되었습니다.", () => {
              window.location.replace("/service");
            });
          }

          const logined_at = {
            logined_at: new Date(),
          };
          updateUser(logined_at);
        } else {
          swalError("로그인 정보를 확인해주세요.", () => setCheck(true));
          setInputs({
            id: "",
            password: "",
          });
          return;
        }
      })
      .catch((e) => {
        swalError("로그인에 실패했습니다. 다시 시도해주세요.");
        console.log(e.response);
      });
  };

  return (
    <div id="login" className="wrap">
      <BrandArea />
      <div className="contentsArea">
        <div className="container">
          <div className="header">
            <div className="title">
              <img src={tit_welcome} alt="Welcome" />
            </div>
            <div className="txt">서비스를 이용하시려면 로그인해주세요.</div>
          </div>
          <div className="contents">
            <form method="">
              <ul className="inputList">
                <li>
                  <input
                    type="text"
                    placeholder="아이디"
                    name="id"
                    className="input_login"
                    onChange={onChange}
                    value={id}
                  />
                </li>
                <li>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    className="input_login"
                    onChange={onChange}
                    value={password}
                  />
                </li>
              </ul>
              <div className="loginBtns">
                <button
                  type="submit"
                  className="btn_contained primary"
                  onClick={login}
                >
                  로그인
                </button>
              </div>
            </form>
          </div>

          {check && (
            <div className="login-err">
              <p className="notice">
                가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
