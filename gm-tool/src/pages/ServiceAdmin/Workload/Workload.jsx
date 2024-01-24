import React, { useState } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import DeploymentListTab from "./Tablist/DeploymentListTab";
import ServiceListTab from "./Tablist/ServiceListTab";
import JobListTab from "./Tablist/JobListTab";
import CronJobListTab from "./Tablist/CronJobListTab";
import PodListTab from "./Tablist/PodListTab";
import StatefulSetListTab from "./Tablist/StatefulSetListTab";
import DaemonSetListTab from "./Tablist/DaemonSetListTab";
import RequestStatusTab from "./Tablist/RequestStatusTab";
import SchedulerListTab from "./Tablist/SchedulerListTab";
import HPAListTab from "./Tablist/HPAListTab";
import LogListTab from "./Tablist/LogListTab";

const Workload = () => {
  const currentPageTitle = Title.Workload;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

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
        <CTab label="Load YAML" />
        <CTab label="Request Status" />
        <CTab label="HPA" />
        <CTab label="Log" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <DeploymentListTab style={{ height: 500 }} />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <ServiceListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <JobListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={3}>
          <CronJobListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={4}>
          <PodListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={5}>
          <StatefulSetListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={6}>
          <DaemonSetListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={7}>
          <SchedulerListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={8}>
          <RequestStatusTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={9}>
          <HPAListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={10}>
          <LogListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default Workload;
