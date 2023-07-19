

const StopProjectModal = (props) => {
  const projectName = props.project_name

  return (
    <div id='stop_project_modal'>
      {projectName} 를 정지 하시겠습니까?
    
    </div>
  );
}

export default StopProjectModal;