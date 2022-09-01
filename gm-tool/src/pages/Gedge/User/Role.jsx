import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import RoleListTab from "./TabList/RoleListTab";

const Role = (props) => {
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

  return (
    <Layout currentPageTitle={currentPageTitle} currentPage={currentPage}>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={1}>
          <RoleListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};

export default Role;
