import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import axios from "axios";
// import { BASIC_AUTH, SERVER_URL } from "../../../../config";
// import VolumeDetail from "../VolumeDetail";
import claimStore from "@/store/Claim";
import ViewYaml from "../Dialog/ViewYaml";
import ClaimDetail from "../ClaimDetail";
import {
  converterCapacity,
  drawStatus,
} from "@/components/datagrids/AggridFormatter";
import CreateVolume from "../Dialog/CreateVolume";
import CreateClaim from "../ClaimDialog/CreateClaim";

const ClaimListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openYaml, setOpenYaml] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    pvClaims,
    pvClaim,
    totalElements,
    pvClaimEvents,
    pvClaimYamlFile,
    pvClaimAnnotations,
    pvClaimLables,
    loadVolumeYaml,
    getYamlFile,
    // pvClaimEvents,
    loadPVClaims,
    loadPVClaim,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = claimStore;

  const [columDefs] = useState([
    {
      headerName: "Name",
      field: "name",
      filter: true,

    },
    {
      headerName: "Namespace",
      field: "namespace",
      filter: true,
    },
    {
      headerName: "Cluster",
      field: "clusterName",
      filter: true,
    },
    {
      headerName: "Capacity",
      field: "capacity",
      filter: true,
    },
    {
      headerName: "Access Mode",
      field: "accessMode",
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      cellRenderer: ({ value }) => {
        return drawStatus(value);
      },
    },
    {
      headerName: "Volume",
      field: "volume",
      filter: true,
    },
    {
      headerName: "StorageClass",
      field: "storageClass",
      filter: true,
    },
    // {
    //   headerName: "Cluster Name",
    //   field: "clusterName",
    //   filter: true,
    // },
    {
      headerName: "Create At",
      field: "createAt",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "Yaml",
      field: "yaml",
      maxWidth: 150,
      cellRenderer: function () {
        return `<button class="tb_volume_yaml" onClick>View</button>`;
      },
      cellStyle: { textAlign: "center" },
    },
  ]);

  const handleOpen = (e) => {
    let fieldName = e.colDef.field;
    loadPVClaim(e.data.name, e.data.clusterName, e.data.namespace);
    loadVolumeYaml(
      e.data.name,
      e.data.clusterName,
      e.data.namespace,
      "persistentvolumeclaims"
    );
    if (fieldName === "yaml") {
      handleOpenYaml();
    }
  };

  const handleOpenYaml = () => {
    setOpenYaml(true);
  };

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleCloseYaml = () => {
    setOpenYaml(false);
  };

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    loadPVClaims();
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
          // reloadFunc={loadPVClaims}
          // isSearch={true}
          // isSelect={true}
          // keywordList={["이름"]}
          >
            <CCreateButton onClick={handleCreateOpen}>생성</CCreateButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleOpen}
                  rowData={viewList}
                  columnDefs={columDefs}
                  isBottom={false}
                  totalElements={totalElements}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                />
              </div>
            </CTabPanel>
          </div>
          <ViewYaml open={openYaml} yaml={getYamlFile} onClose={handleCloseYaml} />
          <CreateClaim open={open} onClose={handleClose} reloadFunc={loadPVClaim} />
        </PanelBox>
        <ClaimDetail
          pvClaim={pvClaim}
          metadata={pvClaimAnnotations}
          lables={pvClaimLables}
          // events={pvClaimEvents}
        />
      </CReflexBox>
    </>
  );
});
export default ClaimListTab;
