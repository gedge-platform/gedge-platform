import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../Detail";
import { projectStore } from "@/store";
import CreateProject from "../Dialog/CreateProject";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const UserServiceListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [userProjectName, setUserProjectName] = useState("");

  const {
    projectDetail,
    projectList,
    totalElements,
    loadProjectList,
    loadProjectDetail,
    deleteProject,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = projectStore;

  const [columDefs] = useState([
    {
      headerName: "프로젝트",
      field: "projectName",
      filter: true,
    },
    {
      headerName: "프로젝트 유형",
      field: "projectType",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "selectCluster",
      filter: true,
      cellRenderer: function ({ data: { selectCluster } }) {
        return `<span>${selectCluster.map((item) =>
          item.clusterName ? " " + item.clusterName : ""
        )}</span>`;
      },
    },
    {
      headerName: "워크스페이스",
      field: "workspaceName",
      filter: true,
      cellRenderer: function ({ data: { workspace } }) {
        return `<span>${workspace.workspaceName}</span>`;
      },
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
    setUserProjectName(e.data.projectName);
    loadProjectDetail(e.data.projectName);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (userProjectName === "") {
      swalError("프로젝트를 선택해주세요!");
    } else {
      swalUpdate(userProjectName + "를 삭제하시겠습니까?", () =>
        deleteProject(userProjectName, reloadData)
      );
    }
    setUserProjectName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadProjectList("user");
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
                rowData={projectList[0]}
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
          <CreateProject
            type={"user"}
            open={open}
            onClose={handleClose}
            reloadFunc={reloadData}
          />
        </PanelBox>
        <Detail project={projectDetail} />
      </CReflexBox>
    </div>
  );
});
export default UserServiceListTab;
