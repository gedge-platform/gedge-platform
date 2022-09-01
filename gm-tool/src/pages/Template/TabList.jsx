import React, { useState, useEffect } from 'react';
import Layout from "@/layout";
import { Title } from '@/pages';
import { CTabs, CTab, CTabPanel } from '@/components/tabs';
import APIListTab from './TabList/APIListTab'
import APIAppTab from './TabList/APIAppTab'

const TabList = () => {
    const currentPage = Title.TabList;
    const [tabvalue, setTabvalue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabvalue(newValue);
    };

    return (
        <Layout currentPage={currentPage}>
            <div className="tabPanelContainer">
                <CTabPanel
                    value={tabvalue}
                    index={0}
                >
                    <APIListTab/>
                </CTabPanel>
            </div>
        </Layout>
    );
}
export default TabList;
