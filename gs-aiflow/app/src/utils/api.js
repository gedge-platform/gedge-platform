import axios from 'axios';

////admin start ////

const APIAdminStopProject = (userID, id) => axios.post('/api/admin/project/stop/' + userID + '/' + id,
    { projectID: id }, { withCredentials: true });

const APIAdminInitProject = (userID, id) => axios.post('/api/admin/project/init/' + userID + '/' + id,
{ projectID: id }, {withCredentials:true})

const APIAdminGetProjectDag = (userID, id) => axios.get('/api/admin/project/' + userID + '/' + id + '/dag', {withCredentials:true});

const APIAdminGetCluster = () => axios.get('/api/admin/clusters', { withCredentials: true });

const APIAdminGetProject = () => axios.get('/api/admin/project', { withCredentials: true });

const APIAdminGetProjectDetail = (loginID, projectName) => axios.get('/api/admin/project/'+ loginID + '/' + projectName, {withCredentials:true});

const APIAdminGetPodLog = (loginID, projectID, podName) => axios.get('/api/admin/project/' + loginID + '/' + projectID + '/' + podName + '/log', {withCredentials:true});

//// admin end ////


//// login start ////

const APILogout = () => axios.post("/api/logout", {}, { withCredentials: true });

const APICheckLogin = () => axios.get("/api/login", {}, { withCredentials: true });

const APILogin = (body) => axios.post("/api/login", body, { withCredentials: true });

//// login end ////


//// project dag start ////

const APIGetProjectDag = (id) => axios.get('/api/project/dag/' + id, {withCredentials:true});

const APISaveProjectDag = (projectID, nodes, edges) => axios.post('/api/project/dag/' + projectID,
{ projectID: projectID, nodes: nodes, edges: edges }, {withCredentials:true});

//// project dag end ////


//// project start ////

const APIGetProjectList = () => axios.get('/api/project', { withCredentials: true });

const APIGetProjectName = (name) => axios.get('/api/project/' + name, {withCredentials:true});

const APICreateProject = (projectName, projectDesc, clusterList) => axios.post('/api/project', 
{projectName: projectName, projectDesc: projectDesc, clusterName: clusterList}, {withCredentials:true})

const APIDeleteProject = (projectName) => axios.delete('/api/project/' + projectName, {withCredentials:true})

const APILaunchProject = (id) => axios.post('/api/project/launch',
{ projectID: id }, {withCredentials:true})

const APIInitProject = (id) => axios.post('/api/project/init',
{ projectID: id }, {withCredentials:true});

const APIGetProjectPodYaml = (projectID, podName) => axios.get('/api/project/' + projectID + '/' + podName + '/yaml', {withCredentials:true});

const APIGetPodLog = (projectID, podName) => axios.get('/api/project/' + projectID + '/' + podName + '/log', {withCredentials:true});

//// project end ////


//// cluster start ////

const APIGetCluster = () => axios.get('/api/clusters', {withCredentials:true});

//// cluster end ////


//// user start ////

const APICreateUser = (loginID, userName, loginPass, clusterList, isAdmin) => axios.post('/api/users', {
    login_id: loginID,
    user_name: userName,
    login_pass: loginPass,
    cluster_list: clusterList,
    is_admin : isAdmin
  }, { withCredentials: true });

const APIGetUser = () => axios.get('/api/users', { withCredentials: true });

const APIGetUserName = (name) => axios.get('/api/users/' + name, { withCredentials: true });

const APIDeleteUser = (userLoginID) => axios.delete('/api/users/' + userLoginID, { withCredentials: true })

const APIUpdateUser = (userLoginID, userName, isAdmin) => axios.put('/api/users/' + userLoginID , {
    user_name: userName,
    is_admin : isAdmin
  }, { withCredentials: true });

//// user end ////


//// pod env start ////

const APIGetPodEnvModel = () => axios.get('/api/pod/env/model', {withCredentials:true});

const APIGetPodEnvFramework = (model) => axios.get('/api/pod/env/framework/' + model, {withCredentials:true});

const APIGetPodEnvRuntime = (model, framework) => axios.get("/api/pod/env/runtime/" + model + "/" + framework, {withCredentials:true});

const APIGetPodEnvTensorrt = (runtime) => axios.get("/api/pod/env/tensorrt/" + runtime, {withCredentials:true});

const APIGetPodDetail = (podName) => axios.get('/api/pod/' + podName + '/detail', {withCredentials:true});

//// pod env end ////

export { APIAdminGetPodLog, APIGetPodLog, APIAdminStopProject, APIAdminInitProject, APIAdminGetProjectDag, APILogout, APICheckLogin, APIGetProjectDag, APIAdminGetProjectDetail, APIAdminGetProject,
     APIGetProjectList, APILaunchProject, APIInitProject, APILogin, APIGetProjectPodYaml, APIGetCluster, APIGetProjectName, APIAdminGetCluster, APIGetUser, APIGetUserName, APIDeleteProject,
     APICreateUser, APIGetPodEnvModel, APIGetPodEnvFramework, APIGetPodEnvRuntime, APISaveProjectDag,  APIGetPodEnvTensorrt, APIGetPodDetail, APIUpdateUser, APIDeleteUser, APICreateProject}