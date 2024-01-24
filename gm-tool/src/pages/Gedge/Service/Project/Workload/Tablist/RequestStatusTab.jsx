import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import { requestStatusStore } from "@/store";
import { drawStatus } from "@/components/datagrids/AggridFormatter";

const RequestStatusTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    requestList,
    loadRequestList,
    totalElements,
    currentPage,
    totalPages,
    viewList,
    initViewList,
    goPrevPage,
    goNextPage,
  } = requestStatusStore;

  const [columDefs] = useState([
    {
      headerName: "ID",
      field: "request_id",
      filter: true,
    },
    {
      headerName: "타입",
      field: "type",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "cluster",
      filter: true,
      // cellRenderer: function ({ data: { cluster } }) {
      //   return `<sapn>${cluster.map(
      //     (clusters) => clusters.clusterName
      //   )}</span>`;
      // },
    },
    {
      headerName: "상태",
      field: "status",
      filter: true,
      cellRenderer: function ({ value }) {
        if (value) return drawStatus(value.toUpperCase());
        else return `<span>No Informaiton</span>`;
      },
    },
    {
      headerName: "워크스페이스",
      field: "workspace",
      filter: true,
      cellRenderer: function (data) {
        if (data.value[0]) return `<span>${data.value[0].workspace}</span>`;
        else return `<span>해당없음</span>`;
      },
    },
    {
      headerName: "프로젝트",
      field: "project",
      filter: true,
      cellRenderer: function (data) {
        if (data.value[0]) return `<span>${data.value[0].project}</span>`;
        else return `<span>해당없음</span>`;
      },
    },
    {
      headerName: "생성날짜",
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const history = useHistory();

  useEffect(() => {
    loadRequestList();
    return () => {
      initViewList();
    }
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar reloadFunc={loadRequestList}>
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  rowData={requestList}
                  columnDefs={columDefs}
                  totalElements={totalElements}
                  isBottom={false}
                  // onCellClicked={handleClick}
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
export default RequestStatusTab;
