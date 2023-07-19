import { React } from 'react';
import DagDefineDetailPod from './dag_monitoring_detail_pod';

const DagMonitoringDetail = (props) => {
  const data = props.data;
  const edges = props.edges;
  const projectID = props.projectID;
  const nodes = props.nodes;


  var detail = null;
  if(data){
    if (data.data.type == "Pod") {
      detail = <DagDefineDetailPod data={nodes.find(element => element.id == data.id)} edges={edges} projectID={projectID}/>
    }
  }
  else {
    detail = '';
  }
  return (
    <div id='dag_monitoring_detail_wrapper'>
      {detail}
    </div>
  );
}

export default DagMonitoringDetail;