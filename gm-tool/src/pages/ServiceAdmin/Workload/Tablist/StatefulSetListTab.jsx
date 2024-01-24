import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { observer } from "mobx-react";
import Detail from "../StatefulDetail";
import { statefulSetStore } from "@/store";
import { swalUpdate, swalError } from "@/utils/swal-utils";

const StatefulSetListTab = observer(() => {
  const [open, setOpen] = useState(false);
  const [reRun, setReRun] = useState(false);
  const [statefulSetName, setStatefulSetName] = useState("");

  const {
    statefulSetList,
    statefulDetail,
    totalElements,
    loadStatefulSetList,
    loadStatefulSetDetail,
    deleteStatefulSet,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
  } = statefulSetStore;

  const [columDefs] = useState([
    {
      headerName: "스테이트풀셋 이름",
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
      headerName: "상태",
      field: "ready",
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

  const handleClick = (e) => {
    setStatefulSetName(e.data.name);
    loadStatefulSetDetail(e.data.name, e.data.cluster, e.data.project);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (statefulSetName === "") {
      swalError("StatefulSet을 선택해주세요!");
    } else {
      swalUpdate(statefulSetName + "을 삭제하시겠습니까?", () =>
        deleteStatefulSet(statefulSetName, reloadData)
      );
    }
    setStatefulSetName("");
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadStatefulSetList();
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
                rowData={statefulSetList}
                columnDefs={columDefs}
                isBottom={false}
                totalElements={totalElements === 0 ? 0 : totalElements}
                totalPages={totalPages}
                currentPage={currentPage}
                goNextPage={goNextPage}
                goPrevPage={goPrevPage}
              />
            </div>
          </div>
          {/* TODO: CreateStatefulSet 팝업 작업 필요 */}
          {/* <CreateStatefulSet type={"user"} open={open} onClose={handleClose} reloadFunc={reloadData} /> */}
        </PanelBox>
        <Detail statefulSet={statefulDetail} />
      </CReflexBox>
    </>
  );
});
export default StatefulSetListTab;
