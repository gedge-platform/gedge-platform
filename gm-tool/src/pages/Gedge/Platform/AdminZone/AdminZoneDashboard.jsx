import React, { useState, useEffect, useLayoutEffect } from "react";

import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import Layout from "@/layout";
import { Title } from "@/pages";
import DeploymentAdminTab from "./Tablist/DeploymentAdminTab";
import ServiceAdminTab from "./Tablist/ServiceAdminTab";
import JobAdminTab from "./Tablist/JobAdminTab";
import CronJobAdminTab from "./Tablist/CronJobAdminTab";
import PodAdminTab from "./Tablist/PodAdminTab";
import StatefulSetAdminTab from "./Tablist/StatefulAdminTab";
import DaemonSetAdminTab from "./Tablist/DaemonSetAdminTab";
import StorageClassAdminTab from "./Tablist/StorageClassAdminTab";
import WorkspaceAdminTab from "./Tablist/WorkspaceAdminTab";
import ConfigmapsListTab from "./Tablist/ConfigmapsAdminTab";
import ServiceAccountAdminTab from "./Tablist/ServiceAccountAdminTab";
import CreateUserAdminTab from "./Tablist/CreateUserAdminTab";
import PlatfromServiceAdminTab from "./Tablist/PlatformServiceAdminTab";
import SecretAdminDetail from "./Detail/SecretAdminDetail";
import SecretAdminListTab from "./Tablist/SecretAdminTab";

const AdminZoneDashboard = observer(() => {
  const currentPageTitle = Title.AdminZone;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  // useLayoutEffect(() => {
  //   loadClusterList("edge");
  // }, []);

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Deployment" />
        <CTab label="Service" />
        <CTab label="Job" />
        <CTab label="CronJob" />
        <CTab label="Pod" />
        <CTab label="StatefulSet" />
        <CTab label="DaemonSet" />
        <CTab label="StorageClass" />
        <CTab label="Workspace" />
        <CTab label="Secret" />
        <CTab label="Configmaps" />
        <CTab label="Service Account" />
        <CTab label="Create User" />
        <CTab label="Platform Control" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <DeploymentAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <ServiceAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <JobAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={3}>
          <CronJobAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={4}>
          <PodAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={5}>
          <StatefulSetAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={6}>
          <DaemonSetAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={7}>
          <StorageClassAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={8}>
          <WorkspaceAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={9}>
          <SecretAdminListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={10}>
          <ConfigmapsListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={11}>
          <ServiceAccountAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={12}>
          <CreateUserAdminTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={13}>
          <PlatfromServiceAdminTab />
        </CTabPanel>
      </div>
    </Layout>
  );
});

export default AdminZoneDashboard;
