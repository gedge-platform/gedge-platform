

const DeleteProjectModal = (props) => {
  const projectName = props.project_name

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div id='delete_project_modal'>
      {projectName} 를 삭제하시겠습니까?
    
    </div>
  );
}

export default DeleteProjectModal;