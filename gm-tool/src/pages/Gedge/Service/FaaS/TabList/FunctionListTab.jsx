import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import CreateFunction from "../Dialog/CreateFunction";
import FaasStore from "../../../../../store/Faas";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { swalError, swalUpdate } from "../../../../../utils/swal-utils";

const FunctionListTab = observer(() => {
  const [reRun, setReRun] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    loadFuncionsListAPI,
    functionsList,
    totalElements,
    totalPages,
    currentPage,
    goNextPage,
    goPrevPage,
    DeleteFuncionsAPI,
    initViewList,
  } = FaasStore;
  const [functionsListName, setFunctionsListName] = useState("");

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "func_name",
      filter: true,
    },
    {
      headerName: "네임스페이스",
      field: "namespace",
      filter: true,
      cellRenderer: function ({ data: { fission_meta } }) {
        return `<span>${fission_meta.namespace}</span>`;
      },
    },
    {
      headerName: "Env",
      field: "env_name",
      filter: true,
    },

    {
      headerName: "Concurrency",
      field: "concurrency",
      filter: true,
      cellRenderer: function ({ data: { fission_spec } }) {
        return `<span>${fission_spec.concurrency}</span>`;
      },
    },
    {
      headerName: "생성일",
      field: "create_at",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function ({ data: { fission_meta } }) {
        return `<span>${dateFormatter(fission_meta.creationTimestamp)}</span>`;
      },
    },
  ]);

  const handleClick = (e) => {
    setFunctionsListName(e.value);
  };

  const handleDelete = () => {
    if (functionsListName === "") {
      swalError("Function을 선택해주세요!");
    } else {
      swalUpdate(functionsListName + "을 삭제하시겠습니까?", () =>
        DeleteFuncionsAPI(functionsListName, reloadData())
      );
    }
    setFunctionsListName("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {
    loadFuncionsListAPI();
    return () => {
      setReRun(false);
      initViewList();
    };
  }, [reRun]);

  return (
    <CReflexBox>
      <PanelBox>
        <CommActionBar reloadFunc={reloadData}>
          <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          &nbsp;&nbsp;
          <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
        </CommActionBar>
        <div className="tabPanelContainer">
          <div className="grid-height2">
            <AgGrid
              onCellClicked={handleClick}
              rowData={functionsList}
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
        <CreateFunction
          open={open}
          onClose={handleClose}
          reloadFunc={reloadData}
        />
      </PanelBox>
    </CReflexBox>
  );
});
export default FunctionListTab;
