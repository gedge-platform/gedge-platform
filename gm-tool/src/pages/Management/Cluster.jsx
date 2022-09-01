import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import UserListTab from "./UserListTab";
import ClusterInfoTab from "./ClusterCont/ClusterInfoTab";
// import APIAppTab from './APIAppTab'

const Cluster = (props) => {
  const currentPageTitle = Title.Management;
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };
  console.log("aa");
  return (
    <Layout currentPageTitle={currentPageTitle} currentPage={currentPage}>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <ClusterInfoTab />
        </CTabPanel>
      </div>
    </Layout>
  );
};

export default Cluster;
