import React, { useState, useEffect } from 'react';
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from '@/components/common/CommActionBar';
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import { CCreateButton } from "@/components/buttons";
import NoticeCreateDialog from "./Dialog/NoticeCreateDialog";
import NoticeDialog from "./Dialog/NoticeDialog";

const NoticeTab = () => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [rowData] = useState([
        {
            no: "1",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "2",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "3",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "4",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "5",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "6",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "7",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "8",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "9",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "10",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "11",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "12",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "13",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "14",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "15",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "16",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "17",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "18",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "19",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
        },
        {
            no: "20",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            date: "2021.03.01",
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
            headerName: '제목',
            field: 'title',
            filter: true,
        },
        {
            headerName: '등록일',
            field: 'date',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
            minWidth: 150,
            maxWidth: 200,
        },
    ]);

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
                <NoticeCreateDialog
                    open={open2}
                    onClose={handleCreateClose}
                />
            </CommActionBar>
            <div className="grid-height">
                <AgGrid
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowPerPage={20}
                    onCellClicked={handleOpen}
                />
                <NoticeDialog
                    open={open}
                    onClose={handleClose}
                />
            </div>
        </PanelBox>
    );
}
export default NoticeTab;
