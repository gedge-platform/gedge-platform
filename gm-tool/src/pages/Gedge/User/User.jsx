import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import UserListTab from "./TabList/UserListTab";
import RoleListTab from "./TabList/RoleListTab";
// import APIAppTab from './APIAppTab'

const User = () => {
  const currentPageTitle = Title.User;
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const actionList = [
    {
      name: "승인",
      onClick: () => {
        alert("승인하시겠습니까?");
      },
    },
    {
      name: "반려",
      onClick: () => {
        alert("반려하시겠습니까?");
      },
    },
    {
      name: "강제중지",
      onClick: () => {
        alert("강제중지 하시겠습니까?");
      },
    },
  ];

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="사용자 목록" />
        {/* <CTab label="사용자 역할 목록" /> */}
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <UserListTab />
        </CTabPanel>
        {/* <CTabPanel value={tabvalue} index={1}>
          <RoleListTab />
        </CTabPanel> */}
      </div>
    </Layout>
  );
};

export default User;
