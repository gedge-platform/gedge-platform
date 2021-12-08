import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"


const Detail = observer((props) => {
    const { workloadDetailStore } = store;
    // const { params } = props;
    // console.log(props.namespace)
    // let link = "namespaces/" + props.namespace + "/services/" + props.name;
    useEffect(() => {
        workloadDetailStore.getDetailList(props.link);
    }, []);
    console.log(workloadDetailStore.detailList)
    if (workloadDetailStore.detailList.kind == 'Service') {


    }



    return (
        <tr>
            <td>클러스터</td>
            <td>
                {workloadDetailStore.detailList.metadata}
            </td>
        </tr>
    )
});

export default Detail
