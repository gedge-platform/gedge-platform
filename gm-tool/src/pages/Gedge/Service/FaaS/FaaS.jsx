import { useState } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import EnvironmentListTab from "./TabList/EnvironmentListTab";
import FunctionListTab from "./TabList/FunctionListTab";
import PackageListTab from "./TabList/PackageListTab";
import TriggerListTab from "./TabList/TriggerListTab";
import PoolSizeListTab from "./TabList/PoolSizeListTab";

const FaaS = () => {
  const currentPageTitle = Title.FaaS;
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <CTabs type="tab1" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Environment" />
        <CTab label="Function" />
        <CTab label="Package" />
        <CTab label="Trigger" />
        <CTab label="Pool Size" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <EnvironmentListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <FunctionListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <PackageListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={3}>
          <TriggerListTab />
        </CTabPanel>
        <CTabPanel value={tabvalue} index={4}>
          <PoolSizeListTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};
export default FaaS;
