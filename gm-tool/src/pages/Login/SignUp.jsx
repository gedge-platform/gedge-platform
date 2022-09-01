import React, { useEffect, useState } from "react";
import Agreements from "./Agreements";
import BrandArea from "./BrandArea";
import CompletedSignUp from "./CompletedSignUp";
import "./css/Login.css";
import EnterInfo from "./EnterInfo";

const SignUp = () => {
  const [step, setStep] = useState(0);

  const setComponent = () => {
    switch (step) {
      case 0:
        return <Agreements setStep={setStep} />;
      case 1:
        return <EnterInfo setStep={setStep} />;
      case 2:
        return <CompletedSignUp setStep={setStep} />;
      default:
        break;
    }
  };
  useEffect(() => {
    document.body.style.zoom = "100%";
  }, []);

  return (
    <div id="login" className="wrap">
      <BrandArea />
      {setComponent()}
    </div>
  );
};

export default SignUp;
