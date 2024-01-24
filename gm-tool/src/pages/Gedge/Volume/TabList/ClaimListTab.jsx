import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import claimStore from "@/store/Claim";
import ViewYaml from "../Dialog/ViewYaml";
import ClaimDetail from "../ClaimDetail";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import CreateClaim from "../ClaimDialog/CreateClaim";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const ClaimListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [claimName, setClaimName] = useState("");
  const [openYaml, setOpenYaml] = useState(false);
  const {
    pvClaim,
    totalElements,
    pvClaimAnnotations,
    pvClaimLables,
    loadClaimYaml,
    deletePvClaim,
    getYamlFile,
    loadPVClaims,
    loadPVClaim,
    currentPage,
    totalPages,
    pvClaimLists,
    goPrevPage,
    goNextPage,
  } = claimStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "namespace",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "clusterName",
      filter: true,
    },
    {
      headerName: "용량",
      field: "capacity",
      filter: true,
    },
    {
      headerName: "접근모드",
      field: "accessMode",
      filter: true,
    },
    {
      headerName: "상태",
      field: "status",
      filter: true,
      cellRenderer: ({ value }) => {
        return drawStatus(value);
      },
    },
    {
      headerName: "볼륨",
      field: "volume",
      filter: true,
      cellRenderer: function ({ data: { volume } }) {
        return `<span>${volume ? volume : "-"}`;
      },
    },
    {
      headerName: "스토리지클래스",
      field: "storageClass",
      filter: true,
      cellRenderer: function ({ data: { storageClass } }) {
        return `<span>${storageClass ? storageClass : "-"}`;
      },
    },
    {
      headerName: "생성일",
      field: "createAt",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
      // sort: "desc",
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
    setClaimName(e.data.name);
    loadPVClaim(e.data.name, e.data.clusterName, e.data.namespace);
    loadClaimYaml(
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
    if (claimName === "") {
      swalError("Claim를 선택해주세요!");
    } else {
      swalUpdate(claimName + "를 삭제하시겠습니까?", () =>
        deletePvClaim(claimName, reloadData)
      );
    }
    setClaimName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadPVClaims();
    return () => {
      setReRun(false);
    };
  }, [reRun]);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={reloadData}>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={pvClaimLists}
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
          <CreateClaim
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
        </PanelBox>
        <ClaimDetail
          pvClaim={pvClaim}
          metadata={pvClaimAnnotations}
          lables={pvClaimLables}
        />
      </CReflexBox>
    </>
  );
});
export default ClaimListTab;
