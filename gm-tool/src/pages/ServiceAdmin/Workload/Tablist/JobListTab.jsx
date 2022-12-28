import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../JobDetail";
import { jobStore } from "@/store";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const JobListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [jobName, setJobName] = useState("");

  const { viewList, jobList, jobDetail, totalElements, loadJobList, loadJobDetail, deleteJob, currentPage, totalPages, goPrevPage, goNextPage } =
    jobStore;

  const [columDefs] = useState([
    {
      headerName: "잡 이름",
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
      headerName: "상태",
      field: "completions",
      filter: true,
      // cellRenderer: ({ value }) => {
      //   if (value === 1) {
      //     return drawStatus("True");
      //   } else {
      //     return drawStatus("False");
      //   }
      // },
    },
    {
      headerName: "지속시간(초)",
      field: "duration",
      filter: true,
    },
    {
      headerName: "완료날짜",
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
    setJobName(e.data.name);
    loadJobDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (jobName === "") {
      swalError("Job을 선택해주세요!");
    } else {
      swalUpdate(jobName + "을 삭제하시겠습니까?", () => deleteJob(jobName, reloadData));
    }
    setJobName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadJobList();
    return () => {
      setReRun(false);
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
          {/* TODO: CreateJob 팝업 작업 필요 */}
          {/* <CreateJob type={"user"} open={open} onClose={handleClose} reloadFunc={reloadData} /> */}
        </PanelBox>
        <Detail job={jobDetail} />
      </CReflexBox>
    </>
  );
});
export default JobListTab;
