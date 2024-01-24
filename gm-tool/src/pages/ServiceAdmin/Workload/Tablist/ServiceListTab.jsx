import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../ServiceDetail";
import { serviceStore } from "@/store";
import CreateService from "../Dialog/CreateService";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const ServiceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [clusterName, setClusterName] = useState("");
  const [projectName, setProjectName] = useState("");

  const {
    pServiceList,
    viewList,
    initViewList,
    serviceList,
    serviceDetail,
    totalElements,
    loadServiceList,
    loadServiceDetail,
    deleteService,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  } = serviceStore;

  const [columDefs] = useState([
    {
      headerName: "서비스 이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "project",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspace",
      filter: true,
    },
    {
      headerName: "액세스 타입",
      field: "type",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "createAt",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const handleClick = (e) => {
    setServiceName(e.data.name);
    setClusterName(e.data.cluster);
    setProjectName(e.data.project);
    loadServiceDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (serviceName === "") {
      swalError("Service를 선택해주세요!");
    } else {
      swalUpdate(serviceName + "를 삭제하시겠습니까?", () =>
        deleteService(serviceName, clusterName, projectName, reloadData())
      );
    }
    setServiceName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadServiceList();
    return () => {
      setReRun(false);
      initViewList();
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
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>
          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={serviceList}
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
          <CreateService
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
        </PanelBox>
        <Detail service={serviceDetail} />
      </CReflexBox>
    </>
  );
});
export default ServiceListTab;
