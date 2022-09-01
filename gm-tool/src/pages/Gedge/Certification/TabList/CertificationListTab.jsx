import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import Layout from "@/layout";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton } from "@/components/buttons";
import { CIconButton } from "@/components/buttons";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import { Title } from "@/pages";
import certificationStore from "../../../../store/Certification";
import Terminal from "../Dialog/Terminal";
import CreateCluster from "../Dialog/CreateCluster";
import CreateCertification from "../Dialog/CreateCertification";

const CertificationListTab = observer(() => {
  const currentPageTitle = Title.Certification;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };
  const [openTerminal, setOpenTerminal] = useState(false);
  const {
    loadCredentialList,

    credential,
    clusterDetail,
    clusterList,
    loadClusterList,
    loadCluster,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
    totalElements,
  } = certificationStore;

  const [columDefs] = useState([
    {
      headerName: "CredentialName",
      field: "CredentialName",
      filter: true,
    },
    {
      headerName: "DomainName",
      field: "DomainName",
      filter: true,
      cellRenderer: function ({ data: { KeyValueInfoList } }) {
        return `<span>${KeyValueInfoList[0].Value}</span>`;
      },
    },
    {
      headerName: "IdentityEndpoint",
      field: "IdentityEndpoint",
      filter: true,
      cellRenderer: function ({ data: { KeyValueInfoList } }) {
        if (KeyValueInfoList[1])
          return `<span>${KeyValueInfoList[1].Value}</span>`;
        else return `<span>no data</span>`;
      },
    },
    {
      headerName: "Password",
      field: "Password",
      filter: true,
      cellRenderer: function ({ data: { KeyValueInfoList } }) {
        if (KeyValueInfoList[2])
          return `<span>${KeyValueInfoList[2].Value}</span>`;
        else return `<span>no data</span>`;
      },
    },
    {
      headerName: "ProjectID",
      field: "ProjectID",
      filter: true,
      cellRenderer: function ({ data: { KeyValueInfoList } }) {
        if (KeyValueInfoList[3])
          return `<span>${KeyValueInfoList[3].Value}</span>`;
        else return `<span>no data</span>`;
      },
    },
    {
      headerName: "Username",
      field: "Username",
      filter: true,
      cellRenderer: function ({ data: { KeyValueInfoList } }) {
        if (KeyValueInfoList[4])
          return `<span>${KeyValueInfoList[4].Value}</span>`;
        else return `<span>no data</span>`;
      },
    },
    {
      headerName: "ProviderName",
      field: "ProviderName",
      filter: true,
    },
    // {
    //   headerName: "생성날짜",
    //   field: "created_at",
    //   filter: "agDateColumnFilter",
    //   filterParams: agDateColumnFilter(),
    //   minWidth: 150,
    //   maxWidth: 200,
    //   cellRenderer: function (data) {
    //     return `<span>${dateFormatter(data.value)}</span>`;
    //   },
    // },
    // {
    //   headerName: "",
    //   field: "terminal",
    //   minWidth: 100,
    //   maxWidth: 100,
    //   cellRenderer: function () {
    //     // return `<span class="state_ico_new terminal" onClick></span> `;
    //     return `<button class="tb_volume_yaml" onClick>Terminal</button>`;
    //   },
    //   cellStyle: { textAlign: "center" },
    // },
  ]);

  const history = useHistory();

  const handleClick = (e) => {
    let fieldName = e.colDef.field;
    loadCluster(e.data.clusterName);
    if (fieldName === "terminal") {
      handleOpenTerminal();
    }
  };

  const handleOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenTerminal = () => {
    setOpenTerminal(true);
  };

  const handleCloseTerminal = () => {
    setOpenTerminal(false);
  };

  useLayoutEffect(() => {
    // loadClusterList("core");
    loadCredentialList();
  }, []);

  return (
    // con/so/le.log(CredentialName),
    <CReflexBox>
      <PanelBox>
        <CommActionBar
        // reloadFunc={() => loadClusterList("core")}
        // isSearch={true}
        // isSelect={true}
        // keywordList={["이름"]}
        >
          <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          {/* <CSelectButton items={[]}>{"All Cluster"}</CSelectButton> */}
        </CommActionBar>

        <div className="tabPanelContainer">
          {/* <CTabPanel value={tabvalue} index={0}> */}
          <div className="grid-height2">
            <AgGrid
              rowData={viewList}
              columnDefs={columDefs}
              isBottom={false}
              onCellClicked={handleClick}
              totalElements={totalElements}
              totalPages={totalPages}
              currentPage={currentPage}
              goNextPage={goNextPage}
              goPrevPage={goPrevPage}
            />
          </div>
          {/* </CTabPanel> */}
        </div>
        {/* <Terminal
          open={openTerminal}
          // yaml={getYamlFile}
          onClose={handleCloseTerminal}
        /> */}
        <CreateCertification open={open} onClose={handleClose} />
      </PanelBox>
    </CReflexBox>
  );
});
export default CertificationListTab;
