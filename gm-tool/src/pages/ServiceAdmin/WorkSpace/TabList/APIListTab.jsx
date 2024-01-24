import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import workspaceStore from "@/store/WorkSpace";
import CreateWorkSpace from "@/pages/Gedge/WorkSpace/Dialog/CreateWorkSpace";
import { swalUpdate, swalError } from "@/utils/swal-utils";
import WorkspaceDetail from "../Detail";

const WorkspaceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    loadWorkSpaceList,
    totalElements,
    deleteWorkspace,
    workSpaceDetail,
    loadWorkspaceDetail,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
    currentPage,
    workSpaceList,
  } = workspaceStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "workspaceName",
      filter: true,
      cellRenderer: function ({ data: { workspaceName } }) {
        return `<span>${workspaceName}</span>`;
      },
      // cellRenderer: function ({ data: { workspaceName } }) {
      //   return `<span>${workspaceName.split("-")[0]}</span>`;
      // },
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
  ]);

  const handleClick = (e) => {
    setWorkspaceName(e.data.workspaceName);
    loadWorkspaceDetail(e.data.workspaceName);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (workspaceName === "") {
      swalError("워크스페이스를 선택해주세요!");
    } else {
      swalUpdate(workspaceName + "를 삭제하시겠습니까?", () =>
        deleteWorkspace(workspaceName, reloadData)
      );
    }
    setWorkspaceName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadWorkSpaceList();
    return () => {
      setReRun(false);
    };
  }, [reRun]);

  return (
    <div style={{ height: 900 }}>
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
                rowData={workSpaceList}
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
          <CreateWorkSpace
            type={"user"}
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
        </PanelBox>
        <WorkspaceDetail workSpace={workSpaceDetail} />
      </CReflexBox>
    </div>
  );
});
export default WorkspaceListTab;
