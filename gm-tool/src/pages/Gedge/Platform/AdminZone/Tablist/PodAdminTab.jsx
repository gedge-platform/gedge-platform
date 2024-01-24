import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import { podStore } from "@/store";
import { dateFormatter } from "@/utils/common-utils";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import PodAdminDetail from "../Detail/PodAdminDetail";

const PodAdminTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    podList,
    podDetail,
    totalElements,
    loadAdminPodList,
    loadPodDetail,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
    viewList,
    initViewList,
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
    const data = e.data.status;
    // if (data === "Failed") {
    //   return;
    // }
    loadPodDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const history = useHistory();

  useEffect(() => {
    loadAdminPodList();
    return () => {
      initViewList();
    }
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadAdminPodList}>
            {/* <CCreateButton onClick={handleCreateOpen}>생성</CCreateButton> */}
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
          {/* <CreatePod
            open={open}
            onClose={handleClose}
            reloadFunc={loadPodList}
          /> */}
        </PanelBox>
        <PodAdminDetail pod={podDetail} />
      </CReflexBox>
    </div>
  );
});
export default PodAdminTab;
