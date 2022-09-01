import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";

const Infra = () => {
  const currentPageTitle = Title.Infra;

  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="코어 클라우드" />
        <CTab label="클라우드 엣지" />
        <CTab label="자격 증명" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default Infra;
