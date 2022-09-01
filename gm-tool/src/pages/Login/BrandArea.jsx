import React from "react";
import logo from "./images/login_logo.png";
import { Link } from "react-router-dom";
import "./css/Login.css";

const BrandArea = () => {
  return (
    <div className="brandArea">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="HyperLedger" />
        </Link>
      </div>
      <div className="division-line"></div>
      <div className="description">
        <p>An Open Cloud Edge SW</p>
        <p>Platform to enable Intelligent</p>
        <p>Edge Service</p>
      </div>
      <div className="copyright">
        Copyright (C) 2022 innogrid. All rights reserved.
      </div>
    </div>
  );
};

export default BrandArea;
