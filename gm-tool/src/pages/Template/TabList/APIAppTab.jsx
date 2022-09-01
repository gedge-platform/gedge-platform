import React, { useState, useEffect } from 'react';
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from '@/components/common/CommActionBar';
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import { CCreateButton } from "@/components/buttons";
import LogDialog from '../Dialog/LogDialog';
import CreateDialog from '../Dialog/CreateDialog';

const APIAppTab = () => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [rowData] = useState([
        {
            no: "1",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "2",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "3",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "4",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "5",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "6",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "7",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "8",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "9",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "10",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "11",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "12",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "13",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "14",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "15",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "16",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "17",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "18",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
        {
            no: "19",
            apiname: "000 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "반려"
        },
        {
            no: "20",
            apiname: "000 조회",
            type: "XML",
            charge: "홍길동",
            auth: "Auth Key",
            date: "2021.03.01",
            state: "요청"
        },
    ]);
    const [columnDefs] = useState([
        {
            headerName: 'NO',
            field: 'no',
            filter: false,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            headerName: 'API 이름',
            field: 'apiname',
            filter: true,
        },
        {
            headerName: '형식',
            field: 'type',
            filter: true,
        },
        {
            headerName: '담당자',
            field: 'charge',
            filter: true,
        },
        {
            headerName: '인증 유형',
            field: 'auth',
            filter: true,
        },
        {
            headerName: '등록일',
            field: 'date',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
        },
        {
            headerName: '상태',
            field: 'state',
            filter: true,
            minWidth: 150,
            maxWidth: 200,
            cellRenderer: function () {
                return `<span class="state_ico state_01">요청</span>`;
            }
        },
    ]);

    const actionList = [
        {
            name: '요청',
            onClick: () => {},
        },
        {
            name: '반려 ',
            onClick: () => {},
        },
    ]

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleCreateOpen = () => {
        setOpen2(true);
    };
    const handleCreateClose = () => {
        setOpen2(false);
    };

    return (
        <PanelBox>
            <CommActionBar isSearch={true}>
                <CCreateButton onClick={handleCreateOpen}>
                    등록
                </CCreateButton>
                <CreateDialog
                    open={open2}
                    onClose={handleCreateClose}
                />
            </CommActionBar>
            <div className="grid-height">
                <AgGrid
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowPerPage={20}
                    // onCellClicked={handleOpen}
                />
            </div>
            <LogDialog
                open={open}
                // onClose={handleClose}
            />
        </PanelBox>
    );
}
export default APIAppTab;
