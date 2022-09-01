import React, { useState, useEffect } from 'react';
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from '@/components/common/CommActionBar';
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CCreateButton, CSelectButton } from "@/components/buttons";
import LogDialog from '../Dialog/LogDialog';
import CreateDialog from '../Dialog/CreateDialog';
import { swalConfirm } from "@/utils/swal-utils";

const APIListTab = () => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [rowData] = useState([
        {
            no: "1",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "요청"
        },
        {
            no: "2",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "완료"
        },
        {
            no: "3",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "요청"
        },
        {
            no: "4",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "반려"
        },
        {
            no: "5",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "요청"
        },
        {
            no: "6",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "요청"
        },
        {
            no: "7",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "완료"
        },
        {
            no: "8",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "반려"
        },
        {
            no: "9",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "반려"
        },
        {
            no: "10",
            apiname: "TEST 조회",
            type: "JSON",
            charge: "홍길동",
            auth: "auth key",
            register: "2021. 02. 01",
            state: "완료"
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
            headerName: '인증유형',
            field: 'auth',
            filter: true,
        },
        {
            headerName: '등록일',
            field: 'register',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
            minWidth: 150,
            maxWidth: 200,
        },
        {
            headerName: '상태',
            field: 'state',
            filter: true,
            minWidth: 150,
            maxWidth: 200,
        },
    ]);

    const actionList = [
        {
            name: 'API 추가',
            onClick: () => {
                setOpen2(true);
            },
        },
        {
            name: 'EXCEL로 추가',
            onClick: () => {
            },
        },
    ]

    const handleCreateOpen = () => {
        setOpen2(true);
    };
    const handleCreateClose = () => {
        setOpen2(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabvalue(newValue);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CReflexBox>
                <PanelBox>
                    <CommActionBar isSearch={true}>
                        <CSelectButton
                            items={actionList}
                        >
                            API 추가
                        </CSelectButton>
                        <CreateDialog
                            open={open2}
                            onClose={handleCreateClose}
                        />
                    </CommActionBar>
                    <div className="grid-height">
                        <AgGrid
                            rowData={rowData}
                            columnDefs={columnDefs}
                        />
                    </div>
                    <LogDialog
                        open={open}
                        onClose={handleClose}
                    />
                </PanelBox>
            </CReflexBox>
        </>
    );
}
export default APIListTab;
