import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getItem } from "@/utils/sessionStorageFn";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 64px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  background-color: #141a30;

  a {
    padding-top: 12px;
    font-size: 24px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const NotFound = () => {
  const userRole = getItem("userRole");

  return (
    <>
      <Container>
        <p>404 Not Found</p>
        <NavLink to="/">메인페이지로</NavLink>
      </Container>
    </>
    // <>
    //   {userRole === "PA" ? (
    //     <Container>
    //       <p>404 Not Found</p>
    //       <NavLink to="/">PA 메인페이지로</NavLink>
    //     </Container>
    //   ) : (
    //     <Container>
    //       <p>404 Not Found</p>
    //       <NavLink to="/service">SA 메인페이지로</NavLink>
    //     </Container>
    //   )}
    // </>
  );
};

export default NotFound;
