-- CREATE DATABASE IF NOT EXISTS smarteye CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS servertable (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cluster_name VARCHAR(30)
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS listcluster (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  cluster_name VARCHAR(30) NOT NULL UNIQUE,
  cluster_ip VARCHAR(30),
  port INT,
  token VARCHAR(1200)
  )
  CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS runningserver (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cluster_name VARCHAR(30) NOT NULL,
    server_name VARCHAR(30) NOT NULL
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_USER (
  user_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
  login_id VARCHAR(30) NOT NULL UNIQUE,
  login_pass VARCHAR(64),
  jupyter_pass VARCHAR(84),
  jupyter_port SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
  user_name VARCHAR(30),
  workspace_name VARCHAR(36),
  is_admin BOOL NOT NULL DEFAULT 0,
  last_access_time TIMESTAMP
  )
  CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_PROJECT (
    project_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    project_name VARCHAR(30) NOT NULL,
    user_uuid VARCHAR(36) NOT NULL,
    pv_name VARCHAR(36) NOT NULL,
    INDEX FK_TB_PROJECT_TB_USER (user_uuid), CONSTRAINT FK_TB_PROJECT_TB_USER FOREIGN KEY (user_uuid) REFERENCES TB_USER (user_uuid) ON DELETE CASCADE
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_NODE (
    node_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    node_name VARCHAR(30) NOT NULL,
    project_uuid VARCHAR(36) NOT NULL,
    node_type TINYINT NOT NULL,
    yaml TEXT NOT NULL,
    create_date TIMESTAMP,
    precondition_list TEXT NOT NULL,
    data TEXT DEFAULT '{}',
    INDEX FK_TB_NODE_TB_PROJECT (project_uuid), CONSTRAINT FK_TB_NODE_TB_PROJECT FOREIGN KEY (project_uuid) REFERENCES TB_PROJECT (project_uuid) ON DELETE CASCADE
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_NODE_HISTORY (
    node_history_uuid VARCHAR(100) NOT NULL PRIMARY KEY,
    node_name VARCHAR(30) NOT NULL,
    user_uuid VARCHAR(36) NOT NULL,
    pv_name VARCHAR(30) NOT NULL,
    INDEX FK_TB_NODE_HISTORY_TB_USER (user_uuid), CONSTRAINT FK_TB_NODE_HISTORY_TB_USER FOREIGN KEY (user_uuid) REFERENCES TB_USER (user_uuid) ON DELETE CASCADE
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_RUNTIME (
    runtime_name VARCHAR(50) NOT NULL,
    framework VARCHAR(30) NOT NULL,
    version VARCHAR(30) NOT NULL,
    python_version VARCHAR(30) NOT NULL,
    cuda_version VARCHAR(30) NOT NULL,
    cudnn_version VARCHAR(30) NOT NULL,
    path VARCHAR(30) NOT NULL,
    model VARCHAR(30) NOT NULL,
    PRIMARY KEY (runtime_name, model),
    image_name VARCHAR(50) NOT NULL,
    nccl_path TEXT NULL DEFAULT NULL
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_CUDA (
    cuda_name VARCHAR(30) NOT NULL PRIMARY KEY,
    cuda_version VARCHAR(30) NOT NULL,
    cudnn_version VARCHAR(30) NOT NULL,
    cuda_path TEXT NOT NULL,
    cudnn_path TEXT NOT NULL
)CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS TB_TENSORRT (
    tensorrt_name VARCHAR(30) NOT NULL,
    tensorrt_version VARCHAR(30) NOT NULL,
    runtime_name VARCHAR(50) NOT NULL,
    tensorrt_path VARCHAR(30) NOT NULL,
    PRIMARY KEY (tensorrt_name, runtime_name),
    INDEX FK_TB_TENSORRT_TB_RUNTIME (runtime_name), CONSTRAINT FK_TB_TENSORRT_TB_RUNTIME FOREIGN KEY (runtime_name) REFERENCES TB_RUNTIME (runtime_name) ON DELETE CASCADE
)CHARACTER SET 'utf8';

INSERT INTO TB_USER (user_uuid, login_id, login_pass, user_name, jupyter_pass, workspace_name , is_admin)
 SELECT * FROM (select '9dda2182-99f2-46b6-b6c7-00e19a4ab08d', 'admin', '6c0b5679c1424be25ffe601af2dcfff0a7113d62a603ff54be9a593e46baedb5', '기본관리자', 'sha256:baab4ec63e94:8d680919ae7039fcf398b73aaf29ccab755fdbccaf64d56f29c596cd982acd2a', 'softonnet', 1) AS admin
 WHERE NOT EXISTS (SELECT user_uuid FROM TB_USER) LIMIT 1;

INSERT INTO TB_RUNTIME (runtime_name, framework, version, python_version,  cuda_version, cudnn_version, model, path, image_name)
SELECT * FROM (select 'pt1.12.1_py3.8_cuda11.3_cudnn8.3', 'PyTorch', '1.2.1', '3.8', '11.3', '8.3', 'yolov5', '.', 'yolov5:v0.0.230511') AS admin
WHERE NOT EXISTS (SELECT runtime_name FROM TB_RUNTIME) LIMIT 1;

INSERT INTO TB_CUDA (cuda_name, cuda_version, cudnn_version, cuda_path, cudnn_path)
SELECT * FROM (select 'cuda11.2-cudnn8.2.1', '11.2', '8.2.1', './cuda11.2','.cudnn/') AS admin
WHERE NOT EXISTS (SELECT cuda_name FROM TB_CUDA) LIMIT 1;

 INSERT INTO TB_TENSORRT (tensorrt_name, tensorrt_version, tensorrt_path, runtime_name)
 SELECT * FROM (select 'tensorRT8.2.5.1', '8.2.5.1', '.', 'pt1.12.1_py3.8_cuda11.3_cudnn8.3') AS admin
 WHERE NOT EXISTS (SELECT tensorrt_name FROM TB_TENSORRT) LIMIT 1;
