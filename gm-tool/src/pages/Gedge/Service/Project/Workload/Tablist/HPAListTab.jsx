import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { observer } from "mobx-react";
import hpaStore from "../../../../../../store/HPA";

const HPAListTab = observer(() => {
  const {
    viewList,
    totalElements,
    currentPage,
    totalPages,
    goPrevPage,
    goNextPage,
    hpaList,
    loadHpaListAPI,
  } = hpaStore;

  const [columDefs] = useState([
    {
      headerName: "HPA 이름",
      field: "name",
      filter: true,
    },
    {
      headerName: "워크스페이스",
      field: "workspace",
      filter: true,
    },
    {
      headerName: "프로젝트",
      field: "project",
      filter: true,
    },
    {
      headerName: "클러스터",
      field: "cluster",
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
  ]);

  const handleClick = () => {};

  useEffect(() => {
    loadHpaListAPI();
  }, []);

  return (
    <div style={{ height: 900 }}>
      <CReflexBox>
        <PanelBox>
          <CommActionBar></CommActionBar>
          <div className="tabPanelContainer">
            <div className="grid-height2">
              <AgGrid
                onCellClicked={handleClick}
                rowData={hpaList}
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
        </PanelBox>
      </CReflexBox>
    </div>
  );
});

export default HPAListTab;
