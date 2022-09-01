import React, { useState } from 'react';
import { PanelBox } from "@/components/styles/PanelBox";
import CommActionBar from '@/components/common/CommActionBar';
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import InquiryDialog from './Dialog/InquiryDialog';

const InquiryTab = () => {
    const [open, setOpen] = useState(false);
    const [rowData] = useState([
        {
            no: "1",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "2",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "3",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "4",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "5",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "6",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "7",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "8",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "9",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "10",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "11",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "12",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "13",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "14",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "15",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "16",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "17",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "18",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "19",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
        },
        {
            no: "20",
            title: "2021년도 신용보증기금 홍보영상 시나리오 공모전",
            name: "홍길동",
            date: "2021.03.01",
            state: "접수대기"
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
            headerName: '문의자',
            field: 'name',
            filter: true,
            minWidth: 150,
            maxWidth: 200,
        },
        {
            headerName: '등록일',
            field: 'date',
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
            cellRenderer: function () {
                return `<span class="state_05">대기중</span>`;
            }
        },
    ]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <PanelBox>
            <CommActionBar isSearch={true}/>
            <div className="grid-height">
                <AgGrid
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowPerPage={20}
                    onCellClicked={handleOpen}
                />
            </div>
            <InquiryDialog
                open={open}
                onClose={handleClose}
            />
        </PanelBox>
    );
}
export default InquiryTab;
