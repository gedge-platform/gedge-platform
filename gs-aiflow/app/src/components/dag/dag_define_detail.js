import { React} from 'react';
import DagDefineDetailPod from './dag_define_detail_pod';

const DagDefineDetail = (props) => {
  const data = props.data;
  const edges = props.edges;
  const projectID = props.projectID;
  var detail = null;
  if(data){
    if (data.data.type == "Pod") {
      detail = <DagDefineDetailPod data={data} edges={edges} projectID={projectID}/>
    }
  }
  else {
    detail = '';
  }
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div id='dag_define_detail_wrapper'>
      {detail}
    </div>
  );
}

export default DagDefineDetail;