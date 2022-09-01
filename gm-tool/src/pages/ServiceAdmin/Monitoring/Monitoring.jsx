import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import ApplicationResource from "./TabList/ApplicationResourceTab";

const Monitoring = () => {
  const currentPageTitle = Title.Monitoring;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Application Resource" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <ApplicationResource />
        </CTabPanel>
      </div>
    </Layout>
  );
};

export default Monitoring;
