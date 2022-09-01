import React, { useState, useEffect } from 'react';
import Layout from "@/layout";
import { Title } from '@/pages';
import CommActionBar from "@/components/common/CommActionBar";
import { CCreateButton } from "@/components/buttons";
import { AgGrid } from '@/components/datagrids'
import { agDateColumnFilter } from "@/utils/common-utils";
import AcceptDialog from "@/pages/Template/Dialog/AcceptDialog";
import { PanelBox } from "@/components/styles/PanelBox";

const OneFrame = () => {
    const currentPage = Title.OneFrame;
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
            headerName: '',
            field: 'check',
            minWidth: 53,
            maxWidth: 53,
            filter: false,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
        },
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
            headerName: '신청자',
            field: 'name',
            filter: true,
            minWidth: 150,
            maxWidth: 200,
        },
        {
            headerName: '신청일',
            field: 'date',
            filter: 'agDateColumnFilter',
            filterParams: agDateColumnFilter(),
            minWidth: 150,
            maxWidth: 200,
        },
        {
            headerName: '신청현황',
            field: 'state',
            filter: true,
            minWidth: 150,
            maxWidth: 200,
            cellRenderer: function () {
                return `<span class="state_02">접수중</span>`;
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
        <Layout currentPage={currentPage}>
            <PanelBox>
                <CommActionBar isSearch={true}>
                    <CCreateButton
                        icon={'check'}
                    >
                        접수
                    </CCreateButton>
                </CommActionBar>
                <div className="grid-height">

                    <AgGrid
                        rowData={rowData}
                        columnDefs={columnDefs}
                        rowPerPage={20}
                        suppressRowClickSelection={true}
                        rowSelection={'multiple'}
                        onCellClicked={handleOpen}
                    />
                </div>
                <AcceptDialog
                    open={open}
                    onClose={handleClose}
                />
            </PanelBox>
        </Layout>
    );
}
export default OneFrame;
