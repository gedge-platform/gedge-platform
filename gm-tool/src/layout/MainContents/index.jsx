import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import theme from "@/styles/theme";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import {
  CCreateButton,
  CIconButton,
  CSelectButton,
} from "@/components/buttons";
import CreateDialog from "@/pages/Template/Dialog/CreateDialog";
import { AgGrid } from "@/components/datagrids";
import Detail from "@/pages/Template/Detail/Detail";
import "react-reflex/styles.css";

const ContainerArea = styled.div`
  position: absolute;
  top: 4px;
  right: 0;
  bottom: 0;
  left: ${theme.sizes.sideNavWidth};
  display: flex;
  flex-direction: column;
  padding: 0 10px 10px;
  border-top-left-radius: 7px;
  background-color: #141a30;
  overflow-y: auto;
`;

const HeaderArea = styled.div`
  display: flex;
  justify-content: flex-start;
  min-height: 64px;
  max-height: 64px;
  flex-basis: 64px;
  padding-top: 10px;
`;
const BreadcrumbsArea = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 44px;
  position: relative;
  margin-left: 9px;
  padding-left: 17px;
  color: #fff;
  font-size: 18px;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    height: 16px;
    margin-top: -8px;
    border-left: 3px solid #fff;
  }
  span {
    text-decoration: none;
    padding-right: 22px;
    margin-right: 15px;
    font-weight: 400;
    /* background: url(../images/bullet/breadcrumbs_arr.png) no-repeat right center; */
  }
`;
const ContArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MainContents = (props) => {
  return (
    <ContainerArea>
      <HeaderArea>
        <BreadcrumbsArea aria-label="breadcrumb">
          {/* <Link to="/">{props.currentPageTitle}</Link> */}
          <span>{props.currentPageTitle}</span>
        </BreadcrumbsArea>
      </HeaderArea>
      <ContArea>{props.children}</ContArea>
    </ContainerArea>
  );
};

export { MainContents };
