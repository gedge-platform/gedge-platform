import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

const PanelBoxM = styled.div`
    position: relative;
    background-color: #141a30;
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
    }
    &::after {
        right: 0;
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
export { PanelBoxM };
