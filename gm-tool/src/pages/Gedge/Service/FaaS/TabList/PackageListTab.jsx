import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import CreatePackage from "../Dialog/CreatePackage";
import FaasStore from "../../../../../store/Faas";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { swalError, swalUpdate } from "../../../../../utils/swal-utils";
import { AgGrid2 } from "../../../../../components/datagrids/AgGrid2";

const PackageListTab = observer(() => {
  const [reRun, setReRun] = useState(false);
  const [open, setOpen] = useState(false);
  const [packageName, setPackageName] = useState("");

  const {
    loadPackageListAPI,
    packageList,
    totalElements,
    totalPages,
    currentPage,
    goNextPage,
    goPrevPage,
    deletePackageAPI,
  } = FaasStore;
  console.log(packageList);

  useEffect(() => {
    loadPackageListAPI();
  }, []);

  const [columDefs] = useState([
    {
      headerName: "이름",
      field: "fission_meta.name",
      filter: true,
    },
    {
      headerName: "네임스페이스",
      field: "fission_meta.namespace",
      filter: true,
    },
    {
      headerName: "Env",
      field: "env_name",
      filter: true,
    },

    // {
    //   headerName: "상태",
    //   field: "ready",
    //   filter: true,
    //   cellRenderer: function ({ value }) {
    //     return drawStatus(value.toLowerCase());
    //   },
    // },
    {
      headerName: "생성일",
      field: "fission_meta.creationTimestamp",
      filter: "agDateColumnFilter",
      filterParams: agDateColumnFilter(),
      minWidth: 150,
      maxWidth: 200,
      cellRenderer: function (data) {
        return `<span>${dateFormatter(data.value)}</span>`;
      },
    },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const cellClicked = (e) => {
    setPackageName(e.value);
  };

  const handleDelete = () => {
    if (packageName === "") {
      swalError("Environment를 선택해주세요!");
    } else {
      swalUpdate(packageName + "를 삭제하시겠습니까?", () =>
        deletePackageAPI(packageName, reloadData())
      );
    }
    setPackageName("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reloadData = () => {
    setReRun(true);
  };

  useEffect(() => {}, [reRun]);

  return (
    <CReflexBox>
      <PanelBox>
        <CommActionBar reloadFunc={loadPackageListAPI}>
          <CCreateButton onClick={handleOpen}>생성</CCreateButton>
          &nbsp;&nbsp;
          <CDeleteButton onClick={handleDelete}>삭제</CDeleteButton>
        </CommActionBar>
        <div className="tabPanelContainer">
          <div className="grid-height2">
            <AgGrid
              onCellClicked={cellClicked}
              rowData={packageList}
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
        <CreatePackage
          open={open}
          onClose={handleClose}
          reloadFunc={loadPackageListAPI}
        />
      </PanelBox>
    </CReflexBox>
  );
});
export default PackageListTab;
