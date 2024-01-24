import React, { useCallback, useEffect, useRef, useState } from "react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AgGridReact } from "@ag-grid-community/react";

import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-balham-dark.css";
import "@/styles/ag-custom.scss";
import { swalError } from "@/utils/swal-utils";

ModuleRegistry.register(ClientSideRowModelModule);

const AgGrid = (props) => {
  var {
    rowData,
    columnDefs,
    pagination = true,
    showPagination = true,
    rowPerPage = 10,
    autoWidth = true,
    onCellClicked,
    totalElements,
    totalPages,
    goPrevPage,
    goNextPage,
    setDetail,
    isBottom,
  } = props;

  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [setGridColumnApi] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [overlayNoRowsTemplate, setOverlayNoRowsTemplate] = useState(
    '<span class="ag-overlay-loading-center">No Data</span>'
  );

  const [overlayLoadingTemplate, setOverlayLoadingTemplate] = useState(
    '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Data Loading...</span>'
  );

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
      if (loading) {
        gridApi.showLoadingOverlay();
      } else if (rowData && rowData.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [rowData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    // rowData = 0;
  };

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
    setTotal(gridRef?.current?.api.paginationGetTotalPages());
    gridRef.current.api.paginationSetPageSize(rowPerPage);
  };

  const onGridSizeChanged = (params) => {
    const gridWidth = document?.getElementById("my-grid")?.offsetWidth;
    const columnsToShow = [];
    const columnsToHide = [];
    let totalColsWidth = 0;
    const allColumns = params.columnApi.getAllColumns();
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  };

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  const onSelectionChanged = ({ api }) => {
    const tempArr = api.getSelectedRows();
    setDetail(tempArr[0].id);
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRef.current.api) {
      setCurrentPage(gridRef.current.api.paginationGetCurrentPage() + 1);
    }
  }, []);

  return (
    <div
      id="my-grid"
      className="grid-wrapper ag-theme-alpine"
      // style={{ height: 410 }}
    >
      <AgGridReact
        ref={gridRef}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onGridSizeChanged={onGridSizeChanged}
        overlayLoadingTemplate={overlayLoadingTemplate}
        overlayNoRowsTemplate={overlayNoRowsTemplate}
        rowData={rowData}
        columnDefs={columnDefs}
        autoWidth={autoWidth}
        pagination={pagination}
        paginationPageSize={rowPerPage}
        cacheBlockSize={rowPerPage}
        suppressPaginationPanel={true}
        onCellClicked={onCellClicked}
        onSelectionChanged={onSelectionChanged}
        onPaginationChanged={onPaginationChanged}
      />
      <div
        id="pagination"
        style={
          showPagination && pagination
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <div className="paging-wrap">
          <div>
            <span>총 {totalElements !== 0 ? totalElements : 0}건</span>
          </div>
          {isBottom ? (
            ""
          ) : (
            <div className="btn-wrap">
              <button
                type="button"
                className="btn_comm"
                onClick={() => {
                  if (gridRef.current.api.paginationGetCurrentPage() === 0) {
                    swalError("첫 페이지입니다");
                  } else {
                    gridRef.current.api.paginationGoToPreviousPage();
                  }
                }}
              >
                <span className="btnLabel_icon hover prev">Prev</span>
              </button>
              <span className="page-num">
                {currentPage} of{" "}
                {gridRef?.current?.api.paginationGetTotalPages() || 1}
              </span>
              <button type="button" className="btn_comm">
                <span
                  className="btnLabel_icon hover next"
                  onClick={() => {
                    if (
                      gridRef.current.api.paginationGetCurrentPage() ===
                      gridRef.current.api.paginationGetTotalPages() - 1
                    ) {
                      swalError("마지막 페이지입니다");
                    } else {
                      gridRef.current.api.paginationGoToNextPage();
                    }
                  }}
                >
                  Next
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AgGrid };
