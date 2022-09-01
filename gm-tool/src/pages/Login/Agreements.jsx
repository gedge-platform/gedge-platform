import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { swalError } from "../../utils/swal-utils";

const Agreements = ({ setStep }) => {
  const [confirm, setConfirm] = useState(false);
  const [allCheck, setAllCheck] = useState(false);
  const [checkList, setCheckList] = useState({
    check1: false,
    check2: false,
  });
  const { check1, check2 } = checkList;
  const allCheckHandler = ({ target }) => {
    setAllCheck(!allCheck);
    setCheckList({
      check1: !allCheck,
      check2: !allCheck,
    });
  };
  const singleCheckHandler = ({ target }) => {
    const { name, checked } = target;
    setCheckList({
      ...checkList,
      [name]: checked,
    });
  };
  const nextStep = (e) => {
    e.preventDefault();
    if (!allCheck) {
      swalError("약관에 동의해주세요");
      setConfirm(true);
      return;
    }
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    setAllCheck(check1 && check2);
  }, [checkList]);
  return (
    <div className="contentsArea">
      <div className="container">
        <div className="contents">
          <div className="signup-step">
            <div className="step current">
              <span className="ico terms">약관 및 동의</span>
            </div>
            <div className="arr"></div>
            <div className="step">
              <span className="ico register">정보 입력</span>
            </div>
            <div className="arr"></div>
            <div className="step">
              <span className="ico complete">회원가입 완료</span>
            </div>
          </div>
          <form method="">
            <div className="terms-wrap">
              <div className="terms-chk chkAll">
                <span className="input_chk">
                  <input
                    type="checkbox"
                    id="termsAll"
                    name="termsAll"
                    checked={allCheck}
                    onChange={(e) => allCheckHandler(e)}
                  />
                  <label htmlFor="termsAll">전체 약관에 동의합니다.</label>
                </span>
              </div>
              <h3 className="tit_bullet">이용약관</h3>
              <div className="terms-box">
                <p className="tit">제1장 총 칙</p>
                <p className="tit">제1조 (목적)</p>
                <p>
                  본 약관은 주식회사 이노그리드(이하 "회사")가 운영하는 cloudit
                  서비스 및 관련 제반 서비스(Console 등)를 이용함에 있어 회사와
                  회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                  목적으로 합니다.
                </p>
                <p className="tit">제2조 (약관의 효력 및 변경)</p>
                <p>
                  ① 본 약관은 cloudit 및 관련 제반 서비스(Console등)의 웹회원에
                  대하여 그 효력을 발생합니다.
                </p>
                <p>
                  ② 본 약관의 내용은 서비스 사이트(http://www.cloudit.co.kr)에
                  게시하거나 기타의 방법으로 회원에게 공시하고, 이에 동의 한
                  회원이 서비스에 가입함으로써 효력이 발생합니다.
                </p>
                <p>
                  ③ 회사는 회원가입 시 본 약관의 내용과 회사의 상호, 영업소
                  소재지, 사업자 등록번호, 연락처 등을 이용자가 알 수 있도록
                  사이트의 서비스화면에 게시합니다.
                </p>
                <p>
                  ④ 본 약관은 회사가 필요하다고 인정되는 경우 대한민국 법령의
                  범위 내에서 개정할 수 있으며, 회사가 약관을 개정할 경우에는
                  적용예정일 및 개정사유를 명시하여 현행 약관과 함께 서비스
                  초기화면에 그 적용예정일 7일 전부터 공지합니다.
                  <br />
                  다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한
                  30일 이상의 사전 유예기간을 두고 공지하는 것 외에 이메일 발송
                  등 전자적 수단을 통해 별도로 통지합니다.
                </p>
                <p>
                  ⑤ 회원은 개정된 약관에 대해 동의하지 않을 권리가 있으며,
                  개정된 약관에 동의하지 않을 경우 이용계약을 해지할 수
                  있습니다. 회원이 회사의 전항 단서에 따른 약관의 불리한 변경에
                  대하여 적용예정일까지 회사에게 부동의 의사를 표시하지 않거나
                  이용계약을 해지하지 않은 경우 변경된 약관을 승인한 것으로
                  봅니다.
                </p>
              </div>
              <div className="terms-chk">
                <span className="input_chk">
                  <input
                    type="checkbox"
                    id="termsService"
                    name="check1"
                    checked={check1}
                    onChange={(e) => singleCheckHandler(e)}
                  />
                  <label htmlFor="termsService">
                    약관을 모두 확인하였으며, 이에 동의합니다.
                  </label>
                </span>
              </div>

              <h3 className="tit_bullet">개인정보처리방침</h3>
              <div className="terms-box">
                <p className="tit">제1장 총 칙</p>
                <p className="tit">제1조 (목적)</p>
                <p>
                  본 약관은 주식회사 이노그리드(이하 "회사")가 운영하는 cloudit
                  서비스 및 관련 제반 서비스(Console 등)를 이용함에 있어 회사와
                  회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                  목적으로 합니다.
                </p>
                <p className="tit">제2조 (약관의 효력 및 변경)</p>
                <p>
                  ① 본 약관은 cloudit 및 관련 제반 서비스(Console등)의 웹회원에
                  대하여 그 효력을 발생합니다.
                </p>
                <p>
                  ② 본 약관의 내용은 서비스 사이트(http://www.cloudit.co.kr/)에
                  게시하거나 기타의 방법으로 회원에게 공시하고, 이에 동의 한
                  회원이 서비스에 가입함으로써 효력이 발생합니다.
                </p>
                <p>
                  ③ 회사는 회원가입 시 본 약관의 내용과 회사의 상호, 영업소
                  소재지, 사업자 등록번호, 연락처 등을 이용자가 알 수 있도록
                  사이트의 서비스화면에 게시합니다.
                </p>
                <p>
                  ④ 본 약관은 회사가 필요하다고 인정되는 경우 대한민국 법령의
                  범위 내에서 개정할 수 있으며, 회사가 약관을 개정할 경우에는
                  적용예정일 및 개정사유를 명시하여 현행 약관과 함께 서비스
                  초기화면에 그 적용예정일 7일 전부터 공지합니다.
                  <br />
                  다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한
                  30일 이상의 사전 유예기간을 두고 공지하는 것 외에 이메일 발송
                  등 전자적 수단을 통해 별도로 통지합니다.
                </p>
                <p>
                  ⑤ 회원은 개정된 약관에 대해 동의하지 않을 권리가 있으며,
                  개정된 약관에 동의하지 않을 경우 이용계약을 해지할 수
                  있습니다. 회원이 회사의 전항 단서에 따른 약관의 불리한 변경에
                  대하여 적용예정일까지 회사에게 부동의 의사를 표시하지 않거나
                  이용계약을 해지하지 않은 경우 변경된 약관을 승인한 것으로
                  봅니다.
                </p>
              </div>
              <div className="terms-chk">
                <span className="input_chk">
                  <input
                    type="checkbox"
                    id="termsPrivacy"
                    name="check2"
                    checked={check2}
                    onChange={(e) => singleCheckHandler(e)}
                  />
                  <label htmlFor="termsPrivacy">
                    약관을 모두 확인하였으며, 이에 동의합니다.
                  </label>
                </span>
              </div>
              <div className="memberBtns">
                <Link to="/" className="btn_outlined">
                  로그인 페이지로 이동
                </Link>
                <button className="btn_outlined" onClick={(e) => nextStep(e)}>
                  <span className="ico next">다음</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        {confirm && (
          <div className="login-err">
            <p className="notice">약관에 동의해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agreements;
