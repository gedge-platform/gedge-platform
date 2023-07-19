

const InitProjectModal = (props) => {
  const projectName = props.project_name

  return (
    <div id='init_project_modal'>
      {projectName} 를 초기화 하시겠습니까?
    
    </div>
  );
}

export default InitProjectModal;