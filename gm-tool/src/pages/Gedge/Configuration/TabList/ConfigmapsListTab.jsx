import React, { useState, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import axios from "axios";
import configmapsStore from "../../../../store/Configmaps";
import ConfigmapsDetail from "../ConfigmapsDetail";
import { LogoutTwoTone } from "@mui/icons-material";

const ConfigmapsListTab = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    configmapsList,
    configmapsDetail,
    totalElements,
    loadconfigmapsList,
    loadconfigmapsTabList,

    currentPage,
    totalPages,
    viewList,
    goPrevPage,
    goNextPage,
  } = configmapsStore;

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
      headerName: "클러스터",
      field: "cluster",
      filter: true,
    },
    {
      headerName: "데이터 개수",
      field: "dataCnt",
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
    loadconfigmapsTabList(e.data.name, e.data.cluster, e.data.namespace);
  };

  const history = useHistory();

  useLayoutEffect(() => {
    loadconfigmapsList();
  }, []);

  return (
    <>
      <CReflexBox>
        <PanelBox>
          <CommActionBar
          // reloadFunc={loadconfigmapsList}
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
            </CTabPanel>
          </div>
        </PanelBox>
        <ConfigmapsDetail configmapsDetail={configmapsDetail} />
      </CReflexBox>
    </>
  );
});
export default ConfigmapsListTab;
