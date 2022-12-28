import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import { certificationStore } from "@/store";
import CreateCertification from "../Dialog/CreateCertification";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import { AgGrid2 } from "@/components/datagrids/AgGrid2";

const CertificationListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [certName, setCertName] = useState("");

  const {
    deleteCredential,
    loadCredentialList,
    credential,
    clusterDetail,
    clusterList,
    loadEdgeClusterList,
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
      headerName: "이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "타입",
      field: "type",
      filter: true,
    },
    {
      headerName: "도메인",
      field: "domain",
      filter: true,
    },
    {
      headerName: "테넌트 ID",
      field: "project",
      filter: true,
    },
    {
      headerName: "URL",
      field: "endpoint",
      filter: true,
    },
    {
      headerName: "username",
      field: "username",
      filter: true,
    },
    {
      headerName: "password",
      field: "password",
      filter: true,
    },
    {
      headerName: "access_id",
      field: "access_id",
      filter: true,
    },
    {
      headerName: "access_token",
      field: "access_token",
      filter: true,
    },
    {
      headerName: "Zone",
      field: "zone",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "created_at",
      filter: true,
    },
  ]);

  const handleClick = e => {
    console.log("e is ", e.data.name);
    setCertName(e.data.name);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (certName === "") {
      swalError("인증을 선택해주세요!");
      return;
    } else {
      swalUpdate("삭제하시겠습니까?", () => deleteCredential(certName, loadCredentialList));
    }
    setCertName("");
  };

  useLayoutEffect(() => {
    loadCredentialList();
  }, []);

  return (
    <CReflexBox>
      <PanelBox>
        <CommActionBar>
          <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
        </CommActionBar>

        <div className="tabPanelContainer">
          <div className="grid-height2">
            <AgGrid2
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
        </div>
        <CreateCertification open={open} onClose={handleClose} reloadFunc={loadCredentialList} />
      </PanelBox>
    </CReflexBox>
  );
});
export default CertificationListTab;
