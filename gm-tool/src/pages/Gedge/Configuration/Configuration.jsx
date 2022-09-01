import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import ConfigmapsListTab from "./TabList/ConfigmapsListTab";
import SecretListTab from "./TabList/SecretListTab";
import ServiceAccountListTab from "./TabList/ServiceAccountListTab";

const Configuration = () => {
  const currentPageTitle = Title.Configuration;
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Secrets" />
        <CTab label="Configmaps" />
        <CTab label="Service Accounts" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <SecretListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <ConfigmapsListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <ServiceAccountListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default Configuration;
