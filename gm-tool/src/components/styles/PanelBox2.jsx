import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

const PanelBox2 = styled.div`
  position: relative;
  background-color: #27324e;
  border-top: 1px solid ${theme.colors.defaultDark};
  border-bottom: 1px solid #232f47;
  padding: 0 1px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
  }
  &::before {
    left: 0;
    border-left: 1px solid #232f47;
  }
  &::after {
    right: 0;
    border-right: 1px solid #232f47;
  }
  .panelTitBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47px;
    padding: 0 8px;
    border: 1px solid #2f3855;
    border-bottom-color: #232f47;
    background-color: ${theme.colors.panelTit};
    .tit {
      padding-left: 12px;
      color: #071e3f;
      font-size: 13px;
      strong {
        color: #0090ff;
      }
    }
    .date {
      color: #fff;
      padding: 0 8px;
    }
  }
`;
export { PanelBox2 };
