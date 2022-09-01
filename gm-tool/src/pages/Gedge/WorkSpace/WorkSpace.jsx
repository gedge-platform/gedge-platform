import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import APIListTab from "./TabList/APIListTab";

const WorkSpace = () => {
  const currentPageTitle = "워크스페이스";
  // const currentPageTitle = Title.WorkSpace;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}></CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <APIListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default WorkSpace;
