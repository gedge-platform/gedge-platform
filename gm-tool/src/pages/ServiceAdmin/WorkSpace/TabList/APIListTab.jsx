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
import Detail from "../Detail";
import { AgGrid2 } from "@/components/datagrids/AgGrid2";

const WorkspaceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    workSpaceList,
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
    },
    {
      headerName: "클러스터",
      field: "memberName",
      filter: true,
      cellRenderer: function ({ data: { selectCluster } }) {
        return `<span>${selectCluster.map(item => item.clusterName)}</span>`;
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
  ]);

  const handleClick = e => {
    console.log("e is ", e.data.workspaceName);
    setWorkspaceName(e.data.workspaceName);
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
      swalUpdate(workspaceName + "를 삭제하시겠습니까?", () => deleteWorkspace(workspaceName, reloadData));
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
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>

          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={viewList}
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
          <CreateWorkSpace type={"user"} open={open} onClose={handleClose} reloadFunc={reloadData} />
        </PanelBox>
        <Detail workSpace={workSpaceDetail} />
      </CReflexBox>
    </div>
  );
});
export default WorkspaceListTab;
