import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../DaemonSetDetail";
import { daemonSetStore } from "@/store";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const DaemonSetListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [daemonSetName, setDaemonSetName] = useState("");

  const {
    daemonSetList,
    daemonSetDetail,
    totalElements,
    loadDaemonSetList,
    loadDaemonSetDetail,
    deleteDaemonSet,
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = daemonSetStore;

  const [columDefs] = useState([
    {
      headerName: "데몬셋 이름",
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
      headerName: "생성날짜",
      field: "createAt",
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
    console.log("e is ", e.data.name);
    setDaemonSetName(e.data.name);
    loadDaemonSetDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (daemonSetName === "") {
      swalError("DaemonSet을 선택해주세요!");
    } else {
      swalUpdate(daemonSetName + "을 삭제하시겠습니까?", () => deleteDaemonSet(daemonSetName, reloadData));
    }
    setDaemonSetName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadDaemonSetList();
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
          {/* TODO: CreateDaemonSet 팝업 작업 필요 */}
          {/* <CreateDaemonSet type={"user"} open={open} onClose={handleClose} reloadFunc={reloadData} /> */}
        </PanelBox>
        <Detail daemonSet={daemonSetDetail} />
      </CReflexBox>
    </>
  );
});
export default DaemonSetListTab;
