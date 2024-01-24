import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import {
  CCreateButton,
  CSelectButton,
  CDeleteButton,
} from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import Detail from "../PodDetail";
import { podStore } from "@/store";
import { dateFormatter } from "@/utils/common-utils";
import CreatePod from "../Dialog/CreatePod";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const PodListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [podName, setPodName] = useState("");
  const [clusterName, setClusterName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    podList,
    podDetail,
    totalElements,
    loadPodList,
    loadPodDetail,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
    viewList,
    initViewList,
    deletePod,
  } = podStore;
  const [columDefs] = useState([
    {
      headerName: "파드 이름",
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
      headerName: "파드 IP",
      field: "podIP",
      filter: true,
    },
    {
      headerName: "재시작 수",
      field: "restart",
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
      headerName: "생성 날짜",
      field: "creationTimestamp",
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

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (e) => {
    const fieldName = e.colDef.field;
    setPodName(e.data.name);
    setClusterName(e.data.cluster);
    setProjectName(e.data.project);
    const data = e.data.status;
    if (data === "Failed") {
      return;
    }
    loadPodDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const history = useHistory();

  const handleDelete = () => {
    if (podName === "") {
      swalError("Pod를 선택해주세요!");
    } else {
      swalUpdate(podName + "를 삭제하시겠습니까?", () =>
        deletePod(podName, clusterName, projectName, reloadData())
      );
    }
    setPodName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadPodList();
    return () => {
      setReRun(false);
      initViewList();
    };
  }, [reRun]);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={reloadData}>
            <CCreateButton onClick={handleCreateOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={podList}
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
          <CreatePod
            open={open}
            onClose={handleClose}
            reloadFunc={loadPodList}
          />
        </PanelBox>
        <Detail pod={podDetail} />
      </CReflexBox>
    </div>
  );
});
export default PodListTab;
