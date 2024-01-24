import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import workspaceStore from "@/store/WorkSpace";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import Detail from "../Detail";

const WorkspaceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    loadWorkSpaceList,
    totalElements,
    deleteWorkspace,
    workSpaceDetail,
    loadWorkspaceDetail,
    totalPages,
    viewList,
    workSpaceList,
    goPrevPage,
    goNextPage,
    currentPage,
  } = workspaceStore;

  const [columnDefs] = useState([
    {
      headerName: "이름",
      field: "workspaceName",
      filter: true,
      cellRenderer: function ({ data: { workspaceName } }) {
        return `<span>${workspaceName}</span>`;
      },
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
        return `<span>${selectCluster.map((item) =>
          item.clusterName ? " " + item.clusterName : ""
        )}</span>`;
      },
    },
    {
      headerName: "생성자",
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
        deleteWorkspace(workspaceName, loadWorkSpaceList)
      );
    }
    loadWorkspaceDetail(workspaceName);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadWorkSpaceList();
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadWorkSpaceList}></CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  rowData={workSpaceList}
                  columnDefs={columnDefs}
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
        </PanelBox>
        <Detail workSpace={workSpaceDetail} />
      </CReflexBox>
    </div>
  );
});
export default WorkspaceListTab;
