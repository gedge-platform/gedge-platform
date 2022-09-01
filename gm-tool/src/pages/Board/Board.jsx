import React, { useState, useEffect } from 'react';
import Layout from "@/layout";
import { Title } from '@/pages';
import { CTabs, CTab, CTabPanel } from '@/components/tabs';
import NoticeTab from './NoticeTab'
import InquiryTab from './InquiryTab'

const Board = () => {
    const currentPage = Title.Board;
    const [tabvalue, setTabvalue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabvalue(newValue);
    };
    console.log("aa")
    return (
        <Layout currentPage={currentPage}>
            <CTabs
                type="tab1"
                value={tabvalue}
                onChange={handleTabChange}
            >
                <CTab label="공지사항" />
                <CTab label="문의하기" />
            </CTabs>
            <div className="tabPanelContainer">
                <CTabPanel
                    value={tabvalue}
                    index={0}
                >
                    <NoticeTab />
                </CTabPanel>
                <CTabPanel
                    value={tabvalue}
                    index={1}
                >
                    <InquiryTab />
                </CTabPanel>
            </div>
        </Layout>
    );
}
export default Board;
