import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { observer } from "mobx-react";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import gsLinkStore from "../../../../../store/GsLink";
import CreateGsLink from "../Dialog/CreateGsLink";
import { swalError, swalUpdate } from "../../../../../utils/swal-utils";

const GsLinkListTab = observer(() => {
  const [open, setOpen] = useState(false);

  const {
    gsLinkList,
    loadGsLinkList,
    totalElements,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
    deleteGsLink,
  } = gsLinkStore;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (e) => {
    if (gsLinkList.request_id === "") {
      swalError("리퀘스트 아이디를 선택해주세요!");
    } else {
      swalUpdate("삭제하시겠습니까?", () =>
        deleteGsLink(gsLinkList.request_id)
      );
    }
  };

  const [columDefs] = useState([
    {
      headerName: "리퀘스트 아이디",
      field: "request_id",
      filter: true,
    },
    {
      headerName: "소스 클러스터",
      field: "source_cluster",
      filter: true,
      cellRenderer: function (data) {
        return `<span>${data.data.parameters.source_cluster}</span>`;
      },
    },
    {
      headerName: "타겟 클러스터",
      field: "target_cluster",
      filter: true,
      cellRenderer: function (data) {
        return `<span>${data.data.parameters.target_cluster}</span>`;
      },
    },
    {
      headerName: "상태",
      field: "status",
      filter: true,
      cellRenderer: function ({ data }) {
        return `${
          data.status ? `<span>${drawStatus(data.status)}</span>` : "-"
        }`;
      },
    },
    {
      headerName: "실패 회수",
      field: "fail_count",
      filter: true,
    },
    {
      headerName: "리퀘스트 시간",
      field: "request_time",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "스케줄 시간",
      field: "scheduled_time",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "완료 시간",
      field: "finished_time",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `${
          data.value ? `<span>${dateFormatter(data.value)}</span>` : "-"
        }`;
      },
    },
  ]);

  useEffect(() => {
    loadGsLinkList();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadGsLinkList}>
            <CCreateButton onClick={handleOpen}>생성</CCreateButton>
            &nbsp;&nbsp;
            <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
          </CommActionBar>
          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                rowData={gsLinkList}
                columnDefs={columDefs}
                totalElements={totalElements}
                isBottom={false}
                totalPages={totalPages}
                currentPage={currentPage}
                goNextPage={goNextPage}
                goPrevPage={goPrevPage}
              />
            </div>
          </div>
          <CreateGsLink
            open={open}
            onClose={handleClose}
            reloadFunc={loadGsLinkList}
          />
        </PanelBox>
      </CReflexBox>
    </>
  );
});

export default GsLinkListTab;
