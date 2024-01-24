import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../CronJobDetail";
import { cronJobStore } from "@/store";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const CronJobListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [cronjobName, setCronJobName] = useState("");

  const {
    viewList,
    initViewList,
    cronJobList,
    cronJobDetail,
    totalElements,
    loadCronJobList,
    loadCronJobDetail,
    deleteCronJob,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
  } = cronJobStore;

  const [columDefs] = useState([
    {
      headerName: "크론잡 이름",
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
      headerName: "스케줄",
      field: "schedule",
      filter: true,
    },
    {
      headerName: "생성날짜",
      field: "creationTimestamp",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "완료날짜",
      field: "lastScheduleTime",
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
    setCronJobName(e.data.name);
    loadCronJobDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (cronjobName === "") {
      swalError("Cron Job을 선택해주세요!");
    } else {
      swalUpdate(cronjobName + "을 삭제하시겠습니까?", () =>
        deleteCronJob(cronjobName, reloadData)
      );
    }
    setCronJobName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadCronJobList();
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
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>
          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={cronJobList}
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
          {/* TODO: CreateCronJob 팝업 작업 필요 */}
          {/* <CreateCronJob type={"user"} open={open} onClose={handleClose} reloadFunc={reloadData} /> */}
        </PanelBox>
        <Detail cronJob={cronJobDetail} />
      </CReflexBox>
    </>
  );
});
export default CronJobListTab;
