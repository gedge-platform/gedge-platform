import { useQuery } from "react-query";
import { memo } from "react";
import axios from "axios";
import { APIGetPodDetail } from "utils/api";

const getUserWithAxios = async ( id ) => {
    const { data } = await APIGetPodDetail(id)
    return JSON.stringify(data.data);
  };

function DagModalPod(props) {
    var id = props.data.id;
    const { isLoading, isError, data, error } = useQuery(["pods"], () => {return getUserWithAxios(id)}, {
        refetchOnWindowFocus:false,
        retry:0,
    });
    return (<div className="inner_modal">{
        !isLoading && (
            <h1>{data}</h1>
        )

    }</div>);
}
  
export default DagModalPod = memo(DagModalPod);