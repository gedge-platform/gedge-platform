import React from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import UserServiceListTab from "./Tablist/UserServiceListTab";

const Project = () => {
  const currentPageTitle = Title.Project;

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <div className="tabPanelContainer">
        <UserServiceListTab />
      </div>
    </Layout>
  );
};

export default Project;
