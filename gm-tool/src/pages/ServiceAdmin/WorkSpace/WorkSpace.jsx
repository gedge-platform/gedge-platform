import React from "react";
import Layout from "@/layout";
import WorkspaceListTab from "./TabList/APIListTab";
import { Title } from "@/pages";

const WorkSpace = () => {
  const currentPageTitle = Title.WorkSpace;
  return (
    <Layout currentPageTitle={currentPageTitle}>
      <div className="tabPanelContainer">
        <WorkspaceListTab />
      </div>
    </Layout>
  );
};

export default WorkSpace;
