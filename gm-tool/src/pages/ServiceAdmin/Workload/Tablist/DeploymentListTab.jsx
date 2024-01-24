import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../Detail";
import { deploymentStore } from "@/store";
import CreateDeployment from "../Dialog/CreateDeployment";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import TamplateCreate from "../../../Gedge/Service/Project/Workload/Dialog/TamplateCreate";

const DeploymentListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [deploymentName, setDeploymentName] = useState("");
  const [clusterName, setClusterName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tamplateOpen, setTemplateOpen] = useState(false);

  const {
    totalElements,
    loadDeploymentList,
    loadDeploymentDetail,
    deleteDeployment,
    setWorkspace,
    currentPage,
    totalPages,
    initViewList,
    viewList,
    goPrevPage,
    goNextPage,
    initAppInfo,
    deploymentList,
  } = deploymentStore;

  const [columDefs] = useState([
    {
      headerName: "디플로이먼트 이름",
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
      cellRenderer: function (data) {
        return `<span>${data.value ? data.value : "-"}</span>`;
      },
    },
    {
      headerName: "상태",
      field: "ready",
      filter: true,
      // cellRenderer: function ({ value }) {
      //   return drawStatus(value.toLowerCase());
      // },
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
      sort: "desc",
    },
  ]);

  const handleClick = (e) => {
    setDeploymentName(e.data.name);
    setClusterName(e.data.cluster);
    setProjectName(e.data.project);
    loadDeploymentDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setWorkspace("");
    setOpen(false);
    setTemplateOpen(false);
  };

  const handleDelete = () => {
    if (deploymentName === "") {
      swalError("Deployment를 선택해주세요!");
    } else {
      swalUpdate(deploymentName + "를 삭제하시겠습니까?", () =>
        deleteDeployment(deploymentName, clusterName, projectName, reloadData)
      );
    }
    setDeploymentName("");
  };

  const handleTamplateCreateOpen = () => {
    setTemplateOpen(true);
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    initAppInfo();
  }, [tamplateOpen]);

  useEffect(() => {
    loadDeploymentList();
    return () => {
      setReRun(false);
      // 다른 탭으로 이동 시 viewList 초기화
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
            &nbsp;&nbsp;
            <CCreateButton onClick={handleTamplateCreateOpen}>
              템플릿
            </CCreateButton>
          </CommActionBar>
          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={deploymentList}
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
          <CreateDeployment
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
          <TamplateCreate
            open={tamplateOpen}
            onClose={handleClose}
            reloadFunc={loadDeploymentList}
          />
        </PanelBox>
        <Detail />
      </CReflexBox>
    </>
  );
});
export default DeploymentListTab;
