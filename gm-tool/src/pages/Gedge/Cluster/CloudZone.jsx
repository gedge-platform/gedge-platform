import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import CloudClusterListTab from "./TabList/CloudClusterListTab";
import CloudVMListTab from "./TabList/CloudVMListTab";

const CloudZone = () => {
  const currentPageTitle = Title.CloudZone;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="클러스터" />
        <CTab label="VM" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <CloudClusterListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <CloudVMListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default CloudZone;
