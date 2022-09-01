import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import PlatfromServiceListTab from "./Tablist/PlatfromServiceListTab";

const PlatformProject = () => {
  const currentPageTitle = Title.PlatformProject;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <PlatfromServiceListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};

export default PlatformProject;
