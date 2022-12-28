import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import EdgeZoneDashboard from "./EdgeZone/EdgeZoneDashboard";
import CloudZoneDashboard from "./CloudZone/CloudZoneDashboard";

const PlatformDashboard = () => {
  const currentPageTitle = Title.Dashboard;
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="EdgeZone" />
        <CTab label="CloudZone" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <EdgeZoneDashboard />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <CloudZoneDashboard />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default PlatformDashboard;
