import DagModalPod from "./dag_modal_pod";
import {memo} from 'react';

function DagModal(props) {
    const nodeType = props.nodeType;
    function GuestGreeting(props) {
        return <h1>Please sign up.</h1>;
    }
    if (nodeType == 'Pod') {
        return <DagModalPod data={props.data}/>;
    }
    return <GuestGreeting/>;
}

export default DagModal = memo(DagModal);