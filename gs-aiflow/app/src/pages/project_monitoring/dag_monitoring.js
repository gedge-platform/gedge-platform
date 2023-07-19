import {React, useState} from "react";
import Flow from "components/chart/react_flow_chart";
import { ReactFlowProvider } from "reactflow";
import AdminFlow from "components/chart/admin_monitoring_chart";

//ReactFlowProvider wrapper용
function DagMonitoring(props) {
    const setProjectID = props.setProjectID;
    return (
    <> 
        <ReactFlowProvider>
            {props.isAdmin ? <AdminFlow setProjectID={setProjectID}/> : <Flow setProjectID={setProjectID}></Flow>}
        </ReactFlowProvider>
    </>
    
    );
}

DagMonitoring.defaultProps = {
    isAdmin : false
}

export {
    DagMonitoring
};