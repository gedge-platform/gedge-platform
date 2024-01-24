import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import EdgeZoneDashboard from "./EdgeZone/EdgeZoneDashboard";
import CloudZoneDashboard from "./CloudZone/CloudZoneDashboard";
import ClusterOverviewAdminTab from "./AdminZone/AdminMonitoring/ClusterOverviewAdminTab";
import PsysicalResourceAdminTab from "./AdminZone/AdminMonitoring/PhysicalResourceAdminTab";
import APIServerAdminTab from "./AdminZone/AdminMonitoring/APIServerAdminTab";
import SchedulerAdminTab from "./AdminZone/AdminMonitoring/SchedulerAdminTab";

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
        <CTab label="Zone Overview" />
        <CTab label="Psysical Resource" />
        <CTab label="API Server" />
        <CTab label="Scheduler" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <EdgeZoneDashboard />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <CloudZoneDashboard />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <ClusterOverviewAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={3}>
          <PsysicalResourceAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={4}>
          <APIServerAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={5}>
          <SchedulerAdminTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default PlatformDashboard;
