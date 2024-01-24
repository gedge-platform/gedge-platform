//Pagenation Import useLayoutEffect
import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import { secretStore } from "@/store";
import SecretDetail from "../SecretsDetail";

const SecretListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    secretList,
    secretDetail,
    totalElements,
    loadsecretList,
    loadsecretTabList,

    //Pagenation Variable
    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = secretStore;

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "namespace",
      filter: true,
    },
    {
      headerName: "타입",
      field: "type",
      filter: true,
    },
    {
      headerName: "데이터 개수",
      field: "dataCnt",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "clusterName",
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
    const fieldName = e.colDef.field;
    loadsecretTabList(e.data.name, e.data.clusterName, e.data.namespace);
  };

  const history = useHistory();

  //Pagenation useEffect -> useLayoutEffect
  useLayoutEffect(() => {
    loadsecretList();
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
          // reloadFunc={loadsecretList}
          // isSearch={true}
          // isSelect={true}
          // keywordList={["이름"]}
          >
            {/* <CCreateButton>생성</CCreateButton> */}
          </CommActionBar>

          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}>
              <div className="grid-height2">
                <AgGrid
                  onCellClicked={handleClick}
                  //Pagenation rowData={viewList}
                  rowData={secretList}
                  columnDefs={columDefs}
                  //Pagenation isBottom = false
                  // isBottom={true}
                  isBottom={false}
                  totalElements={totalElements}
                  //Pagenation AgGrid Function
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goNextPage={goNextPage}
                  goPrevPage={goPrevPage}
                />
              </div>
            </CTabPanel>
          </div>
        </PanelBox>
        <SecretDetail secret={secretDetail} />
      </CReflexBox>
    </div>
  );
});
export default SecretListTab;
