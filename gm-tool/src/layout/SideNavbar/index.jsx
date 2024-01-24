import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import theme from "@/styles/theme";
import SideUser from "./SideUser";
import SideMenu from "./SideMenu";
// import sideLogo from '@/images/layout/logo.png';
import sideLogo from "@/images/layout/new_logo.png";
import axios from "axios";
import { SERVER_URL } from "@/config";
import { getItem, setItem } from "@/utils/sessionStorageFn";

const SidebarArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${theme.sizes.sideNavWidth};
  display: flex;
  flex-direction: column;
  background-color: #0a2348;
  box-shadow: inset -1px 0 0 #04102d;
`;

const LogoArea = styled.div`
  height: 70px !important;
  background-color: ${theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  text-align: center;
  color: white;
`;

const SideNavbar = () => {
  const userRole = getItem("userRole");

  return (
    <>
      {userRole === "PA" ? (
        <SidebarArea>
          <LogoArea>
            <Link to="/total">
              <img src={sideLogo} alt="GEdge Cloud" />
            </Link>
          </LogoArea>
          <SideUser />
          <SideMenu />
        </SidebarArea>
      ) : (
        <SidebarArea>
          <LogoArea>
            <Link to="/service">
              <img src={sideLogo} alt="GEdge Cloud" />
            </Link>
          </LogoArea>
          <SideUser />
          <SideMenu />
        </SidebarArea>
      )}
    </>
  );
};

export { SideNavbar };
