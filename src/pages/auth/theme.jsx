import React from 'react';

const fontSizes = {
    root: '12px',
    title: '14px',
    subtitle: '13px',
    paragraph: '13px',
}
const colors = {
    primary: '#1a5eda', // SideNav LogoArea
    primaryDark: '#1355ce', // SideNav UserArea
    navActive: '#1a5eda', // SideNav Nav Active
    primaryBtn: '#0090ff', // SideNav Nav Active
    defaultDark: '#071e3f',
    defaultBorder: '#e0e2e5',
    panelTit: '#f5f6f9',
}
const sizes = {
    sideNavWidth: '231px',
}
const mixins = {
    clearfix: `
    &::after {
      content: '';
      display: block;
      clear: both;
  `,
    flexCenter: `
    display: flex;
    justify-contents: center;
    align-items: center;
  `,
    ir: `
    position: absolute;
    top: auto;
    left: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
  `,
    ir_wa: `
    display: block;
    overflow: hidden;
    position: relative;
    z-index: -1;
  `,
    ir_btn: `
    display: block;
    height: 20px;
    color: transparent;
    white-space: nowrap;
    overflow: hidden;
  `
}

const theme = {
    fontSizes,
    colors,
    sizes,
    mixins,
}
export default theme;
