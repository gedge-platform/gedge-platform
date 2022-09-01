import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton } from "@/components/buttons";
import { CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import certificationStore from "../../../store/Certification";
import Detail from "./Detail";
import Layout from "@/layout";
import { Title } from "@/pages";
import CreateCertification from "./Dialog/CreateCertification";
import CertificationListTab from "./TabList/CertificationListTab";

const Certification = observer(() => {
  const currentPageTitle = Title.Certification;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const {} = certificationStore;

  const [columDefs] = useState([
    {
      headerName: "Provider Name",
      field: "providerName",
      filter: true,
    },
    {
      headerName: "VPC Name",
      field: "VPCName",
      filter: true,
    },
    {
      headerName: "Security Name",
      field: "securityName",
      filter: true,
    },
    {
      headerName: "Key Pair Name",
      field: "KeyPairName",
      filter: true,
    },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {}, []);

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <CertificationListTab />
          {/* <div className="grid-height2">
                <AgGrid columDefs={columDefs} />
              </div> */}
        </CTabPanel>
      </div>
      <CreateCertification open={open} onClose={handleClose} />
    </Layout>
  );
});
export default Certification;
