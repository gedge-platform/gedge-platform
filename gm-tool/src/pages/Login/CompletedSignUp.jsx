import React from "react";
import { Link } from "react-router-dom";

const CompletedSignUp = () => {
    return (
        <div className="contentsArea">
            <div className="lang">
                <select name="" className="select_login_s">
                    <option value="">kor</option>
                </select>
            </div>
            <div className="container">
                <div className="contents">
                    <div className="signup-step">
                        <div className="step">
                            <span className="ico terms">약관 및 동의</span>
                        </div>
                        <div className="arr"></div>
                        <div className="step">
                            <span className="ico register">정보 입력</span>
                        </div>
                        <div className="arr"></div>
                        <div className="step current">
                            <span className="ico complete">회원가입 완료</span>
                        </div>
                    </div>

                    <div className="signup-complete">
                        <p className="tit">
                            회원가입이 <strong>완료</strong>되었습니다.
                        </p>
                        <p>로그인하시면 서비스를 이용하실 수 있습니다.</p>
                    </div>
                    <div className="memberBtns">
                        <Link to="/Login" className="btn_contained submit">
                            로그인 페이지로 이동
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedSignUp;
