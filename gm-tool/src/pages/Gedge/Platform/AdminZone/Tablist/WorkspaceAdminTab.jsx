import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton } from "@/components/buttons";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import workspaceStore from "@/store/WorkSpace";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import WorkspceAdminDetail from "../Detail/WorkspaceAdminDetail";

const WorkspaceAdminTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    workSpaceList,
    loadAdminWorkSpaceList,
    totalElements,
    deleteWorkspace,
    workSpaceDetail,
    loadWorkspaceDetail,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
    currentPage,
    adminList,
    adminLists,
  } = workspaceStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "workspaceName",
      filter: true,
    },
    {
      headerName: "설명",
      field: "workspaceDescription",
      filter: true,
      cellRenderer: function ({ data: { workspaceDescription } }) {
        return `<span>${
          workspaceDescription ? workspaceDescription : "-"
        }</span>`;
      },
    },
    {
      headerName: "클러스터",
      field: "clusterName",
      filter: true,
      cellRenderer: function ({ data: { selectCluster } }) {
        const clusterNames = selectCluster
          .map((item) => item.clusterName)
          .join(", ");
        return `<span>${clusterNames}</span>`;
      },
    },
    {
      headerName: "CREATOR",
      field: "memberName",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "created_at",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "삭제",
      field: "delete",
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: function () {
        return `<span class="state_ico_new delete"></span>`;
      },
      cellStyle: { textAlign: "center", cursor: "pointer" },
    },
  ]);

  const history = useHistory();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClick = async ({
    data: { workspaceName },
    colDef: { field },
  }) => {
    if (field === "delete") {
      swalUpdate("삭제하시겠습니까?", () =>
        deleteWorkspace(workspaceName, loadAdminWorkSpaceList)
      );
    }
    loadWorkspaceDetail(workspaceName);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadAdminWorkSpaceList();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadAdminWorkSpaceList}>
            {/* <CCreateButton onClick={handleOpen}>생성</CCreateButton> */}
            {/* <CSelectButton items={[]}>{"All Cluster"}</CSelectButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={adminLists}
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
          {/* <CreateWorkSpace
            reloadFunc={loadWorkSpaceList}
            type={"user"}
            open={open}
            onClose={handleClose}
          /> */}
        </PanelBox>
        <WorkspceAdminDetail workSpace={workSpaceDetail} />
      </CReflexBox>
    </div>
  );
});
export default WorkspaceAdminTab;
