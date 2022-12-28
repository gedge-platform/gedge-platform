import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@/styles/globalStyle";
import theme from "@/styles/theme";
import { ToastContainer } from "react-toastify";
import { SideNavbar } from "./SideNavbar";
import { MainContents } from "./MainContents";
import WebSocketContainer from "./WebSocket/WebSocketContainer";

export const Layout = props => {
  const currentPage = props.currentPage;
  const currentPageTitle = props.currentPageTitle;
  const resize = props.resize;

  return (
    <ThemeProvider theme={theme}>
      {/* <WebSocketContainer> */}
      <SideNavbar />
      <MainContents currentPage={currentPage} currentPageTitle={currentPageTitle} resize={resize}>
        {props.children}
        <ToastContainer position="top-right" autoClose={10000} />
      </MainContents>
      <GlobalStyles />
      {/* </WebSocketContainer> */}
    </ThemeProvider>
  );
};
export default Layout;
