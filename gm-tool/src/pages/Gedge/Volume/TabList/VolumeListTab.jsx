import React, { useState, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import VolumeDetail from "../VolumeDetail";
import volumeStore from "@/store/Volume";
import ViewYaml from "../Dialog/ViewYaml";
import {
  converterCapacity,
  drawStatus,
} from "@/components/datagrids/AggridFormatter";
import { SearchV1 } from "@/components/search/SearchV1";
import CreateVolume from "../Dialog/CreateVolume";

const VolumeListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openYaml, setOpenYaml] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    pVolume,
    totalElements,
    pVolumeMetadata,
    loadPVolumes,
    loadPVolume,
    loadVolumeYaml,
    getYamlFile,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = volumeStore;

  const [columDefs] = useState([
    {
      headerName: "Name",
      field: "name",
      filter: true,
      getQuickFilterText: (params) => {
        return params.value.name;
      },
    },
    {
      headerName: "Capacity",
      field: "capacity",
      filter: true,
      valueFormatter: ({ value }) => {
        return converterCapacity(value);
      },
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
      headerName: "Storage Class",
      field: "storageClass",
      filter: true,
    },
    {
      headerName: "Volume Mode",
      field: "volumeMode",
      filter: true,
    },
    {
      headerName: "Cluster",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "Claim",
      field: "claim.name",
      filter: true,
    },
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
    loadPVolume(e.data.name, e.data.cluster);
    loadVolumeYaml(e.data.name, e.data.cluster, null, "persistentvolumes");
    if (fieldName === "yaml") {
      handleOpenYaml();
    }
  };

  const handleOpenYaml = () => {
    setOpenYaml(true);
  };

  const handleCloseYaml = () => {
    setOpenYaml(false);
  };

  const history = useHistory();

  useLayoutEffect(() => {
    loadPVolumes();
  }, []);

  const handleCreateOpen = () => {
    // setWorkspace("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
          // reloadFunc={loadPVolumes}
          // isSearch={true}
          // isSelect={true}
          // keywordList={["이름"]}
          >
            {/* <CCreateButton onClick={handleCreateOpen}>생성</CCreateButton> */}
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
          <ViewYaml
            open={openYaml}
            yaml={getYamlFile}
            onClose={handleCloseYaml}
          />
          <CreateVolume
            open={open}
            onClose={handleClose}
            reloadFunc={loadPVolumes}
          />
        </PanelBox>
        <VolumeDetail pVolume={pVolume} metadata={pVolumeMetadata} />
      </CReflexBox>
    </>
  );
});
export default VolumeListTab;
