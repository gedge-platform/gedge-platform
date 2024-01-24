import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import StorageClassDetail from "../StorageClassDetail";
import ViewYaml from "../Dialog/ViewYaml";
import {
  converterCapacity,
  drawStatus,
} from "@/components/datagrids/AggridFormatter";
import { StorageClassStore } from "@/store";

const StorageClassListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [storageClassName, setStorageClassName] = useState("");

  const {
    loadStorageClasses,
    totalElements,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
    loadStorageClass,
    viewList,
    storageClassess,
    getYamlFile,
    loadStorageClassYaml,
  } = StorageClassStore;

  const [columDefs] = useState([
    {
      headerName: "Name",
      field: "name",
      filter: true,
    },
    {
      headerName: "Cluster",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "Reclaim Policy",
      field: "reclaimPolicy",
      filter: true,
    },
    {
      headerName: "Provisioner",
      field: "provisioner",
      filter: true,
    },
    {
      headerName: "VolumeBindingMode",
      field: "volumeBindingMode",
      filter: true,
    },
    {
      headerName: "AllowVolumeExpansion",
      field: "allowVolumeExpansion",
      filter: true,
      cellRenderer: ({ value }) => {
        return drawStatus(value);
      },
    },
    {
      headerName: "Created",
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

  const handleClick = (e) => {
    let fieldName = e.colDef.field;
    setStorageClassName(e.data.name);
    loadStorageClass(e.data.name, e.data.cluster);
    loadStorageClassYaml(e.data.name, e.data.cluster, "storageclasses");
    if (fieldName === "yaml") {
      handleOpenYaml();
    }
  };

  const handleOpenYaml = () => {
    setOpen(true);
  };

  const handleCloseYaml = () => {
    setOpen(false);
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadStorageClasses();
    return () => {
      setReRun(false);
    };
  }, [reRun]);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
            reloadFunc={reloadData}
            // isSearch={true}
            // isSelect={true}
            // keywordList={["이름"]}
          >
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  //  rowData={viewList}
                  rowData={storageClassess}
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
            open={open}
            yaml={getYamlFile}
            onClose={handleCloseYaml}
            reloadFunc={reloadData}
          />
        </PanelBox>
        <StorageClassDetail />
      </CReflexBox>
    </>
  );
});

export default StorageClassListTab;
