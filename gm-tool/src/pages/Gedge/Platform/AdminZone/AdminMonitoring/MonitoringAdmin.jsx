import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import ClusterOverviewAdminTab from "./ClusterOverviewAdminTab";
import PsysicalResourceAdminTab from "./PhysicalResourceAdminTab";
import APIServerAdminTab from "./APIServerAdminTab";
import SchedulerAdminTab from "./SchedulerAdminTab";

const AdminMonitoring = () => {
  const currentPageTitle = Title.Monitoring;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Zone Overview" />
        <CTab label="Psysical Resource" />
        <CTab label="API Server" />
        <CTab label="Scheduler" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <ClusterOverviewAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <PsysicalResourceAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <APIServerAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={3}>
          <SchedulerAdminTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};

export default AdminMonitoring;
