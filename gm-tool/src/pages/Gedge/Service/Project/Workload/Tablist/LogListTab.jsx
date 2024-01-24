import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import logStore from "../../../../../../store/Log";
import styled from "styled-components";

const LogListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    loadLogListAPI,
    logList,
    totalElements,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
  } = logStore;

  const [columDefs] = useState([
    {
      headerName: "ID",
      field: "request_id",
      filter: true,
    },
    {
      headerName: "타입",
      field: "priority",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspace_name",
      filter: true,
      cellRenderer: function (data) {
        if (data.value[0]) return `<span>${data.value}</span>`;
        else return `<span>해당없음</span>`;
      },
    },
    {
      headerName: "프로젝트",
      field: "project_name",
      filter: true,
      cellRenderer: function (data) {
        if (data.value) return `<span>${data.value}</span>`;
        else return `<span>해당없음</span>`;
      },
    },
    {
      headerName: "생성날짜",
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
    {
      headerName: "로그",
      field: "log",
      filter: true,
      width: "800px",
      cellRenderer: function (data) {
        const tooltipText = data.value;
        return `
        <span title="${tooltipText.replace(/"/g, "&quot;")}">${
          data.value
        }</span>`;
        // Ag-Grid의 cellRenderer 함수는 문자열을 반환해야 함.
        // title 속성에 특수 문자를 이스케이프하기 위해 replace 함수를 사용
        // 문자열 내의 모든 "(큰따옴표) 문자를 &quot;로 수정
      },
    },
  ]);

  const history = useHistory();

  useEffect(() => {
    loadLogListAPI();
    return () => {
      initViewList();
    };
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadLogListAPI}></CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  rowData={logList}
                  rowPerPage={20}
                  columnDefs={columDefs}
                  totalElements={totalElements}
                  isBottom={false}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                  // totalElements={requestList.length}
                />
              </div>
            </CTabPanel>
          </div>
        </PanelBox>
      </CReflexBox>
    </>
  );
});
export default LogListTab;
