import React, { useState, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
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
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [volumeName, setVolumeName] = useState("");
  const [openYaml, setOpenYaml] = useState(false);

  const {
    pVolume,
    totalElements,
    pVolumeMetadata,
    loadPVolumes,
    loadPVolume,
    loadVolumeYaml,
    deleteVolume,
    getYamlFile,
    currentPage,
    totalPages,
    viewList,
    pVolumesLists,
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
      cellRenderer: function ({ data: { storageClass } }) {
        return `<span>${storageClass ? storageClass : "-"}`;
      },
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
      cellRenderer: function ({ data: { claim } }) {
        return `<span>${claim.name ? claim.name : "-"}`;
      },
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

  const handleClick = (e) => {
    let fieldName = e.colDef.field;
    setVolumeName(e.data.name);
    loadPVolume(e.data.name, e.data.cluster);
    loadVolumeYaml(e.data.name, e.data.cluster, "persistentvolumes");
    // loadVolumeYaml(e.data.name, e.data.cluster, null, "persistentvolumes");
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (volumeName === "") {
      swalError("Volume을 선택해주세요!");
    } else {
      swalUpdate(volumeName + "를 삭제하시겠습니까?", () =>
        deleteVolume(volumeName, reloadData)
      );
    }
    setVolumeName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useLayoutEffect(() => {
    loadPVolumes();
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
            {/* <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={pVolumesLists}
                columnDefs={columDefs}
                isBottom={false}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={currentPage}
                goNextPage={goNextPage}
                goPrevPage={goPrevPage}
              />
            </div>
          </div>
          <ViewYaml
            open={openYaml}
            yaml={getYamlFile}
            onClose={handleCloseYaml}
          />
          {/* <CreateVolume open={open} onClose={handleClose} reloadFunc={reloadData} /> */}
        </PanelBox>
        <VolumeDetail pVolume={pVolume} metadata={pVolumeMetadata} />
      </CReflexBox>
    </>
  );
});
export default VolumeListTab;
