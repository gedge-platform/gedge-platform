import React from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import CertificationListTab from "./TabList/CertificationListTab";

const Certification = () => {
  const currentPageTitle = Title.Certification;

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <div className="tabPanelContainer">
        <CertificationListTab />
      </div>
    </Layout>
  );
};
export default Certification;
