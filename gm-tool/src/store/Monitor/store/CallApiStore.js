import { ExpandLessSharp } from "@material-ui/icons";
import { makeAutoObservable, runInAction } from "mobx";
import CallApi from "../api/CallApi";


class CallApiStore {
    clusterList = []
    projectList = []
    projectAllList = []
    projectFilter = "all"
    projectFilterList = []
    workspaceList = []
    workspaceFilterList = []
    workspaceFilter = "all"
    FilterOption = []
    clusterFilterList = []
    clusterFilter = "all"
    filterList = []
    coreCloudList=[]
    cloudEdgeList=[]
    
    dataCheck = true

    // dataList
    deploymentFilterList = []
    serviceFilterList = []
    jobFilterList = []
    cronjobFilterList = []
    podFilterList = []

    //detailList
    clusterDetailMaster = []
    clusterDetailWorker = []
    projectDetail = []
    workspaceDetail = []
    deploymentDetail = []
    serviceDetail = []
    serviceDetailInvolve = []
    jobDetail = []
    cronjobDetail = []
    podDetail = []
    deploymentDetailInvolve = []
    serviceDetailInvolve = []
    jobDetailInvolve = []
    cronjobDetailInvolve = []
    podDetailInvolve = []

    //DB user 정보
    userprojects = []
    memberList = []
    memberNameList=[]
    dbList=[]
    // dbList = []
    duplicateCheck = -1
    clusterCheck = "";

    //post
    postWorkspaceMessage = ""
    posteCode = ""
    postMessage = ""

    constructor() {
        makeAutoObservable(this);
        this.CallApi = new CallApi();
    }

    async getClusterList(param, type) {
        // this.dataCheck = true
        const apiList = await this.CallApi.callAPI(param);
        let list = []
        let coreList=[]
        let edgeList=[]
        console.log("getClusterList");
        if (type != undefined) {
            list = apiList.data.filter(data => data.clusterType == type)
            // console.log(list, "list")
        } else {
            // console.log(type, "type")
            list = apiList.data
            coreList = apiList.data.filter(data => data.clusterType == "core")
            edgeList=apiList.data.filter(data => data.clusterType == "edge")
            console.log(coreList)
        }
        runInAction(() => {
            this.clusterList = list;
            if(coreList.length > 0){
            this.coreCloudList=coreList;
            }else{
                this.coreCloudList= undefined
            }
            if(edgeList.length >0){
                this.cloudEdgeList=edgeList;
            }else{
                this.cloudEdgeList=undefined
            }
           
            if( type != undefined && type=="core"){
                this.coreCloudList=list;
            }else if(type != undefined && type=="edge"){
                this.cloudEdgeList=list;
            }
            // this.dataCheck = false;
        });
    }
    async getWorkspaceList(param) {
        // this.dataCheck = true
        const apiList = await this.CallApi.callAPI(param);
        console.log("getWorkspaceList");
        runInAction(() => {
            this.workspaceList = apiList.data;
            // this.dataCheck = false
        });
    }
    async postWorkspaceList(param, body) {
        // this.dataCheck = true
        let check = false
        const err = await this.CallApi.postAPI(param, body);
        console.log("err23424 : ", err);
        if (err.data.workspaceName == body.workspaceName){
            check = true
        }else{
            check = false
        }
        
        console.log("postWorkspaceList");
        // console.log(err.error)
        runInAction(() => {
            if(check){
                this.postWorkspaceMessage = "Succeed"
            }else{
            this.postWorkspaceMessage = "Failure"
            this.postCode = err.error.Number
            this.postMessage = err.error.Message
            }

        });
    }

    async getMemberList(param) {
        // this.dataCheck = true
        let memberName =[]
        const apiList = await this.CallApi.callAPI(param);
        apiList.data.map(list=> {
            memberName.push(list.memberName)
        })
        console.log("getMemberList");
        runInAction(() => {
            this.memberList = apiList.data;
            this.memberNameList = memberName
            // this.dataCheck = false
        });
    }
    async workspaceDuplicationCheck(workspaceName) {
        // this.dbList=[]
        // this.duplicateCheck = false
        const apiList = await this.CallApi.callAPI("workspaces");
        const check = (apiList.data.filter(list => list.workspaceName == workspaceName)).length
        console.log(check, "check")
        console.log("duplicationCheck");
        runInAction(() => {
            this.duplicateCheck = check
            // if(check==0){

            // }else{
            //     this.duplicateCheck = check
            // }
        });
    }
    async getProjectList(workspaceName, type) {
        console.log("getProjectList");
        let param = ""
        if (workspaceName == "all") {
            param = "projects"
        } else {
            param = "projects?workspace=" + workspaceName

        }
        const apiList = await this.CallApi.callAPI(param);
        let list = []

        if (type != undefined || type != null) {
            list = apiList.data.filter(data => data.projectType == type)
            console.log(list, "list")
        } else {
            console.log(type, "type")
            list = apiList.data
        }
        runInAction(() => {
            if (apiList.data != null) {
                this.projectFilterList = list;
                this.projectList = list;
            } else {
                this.projectFilterList = null;
                this.projectList = null;
            }

        });
    }
    async getProjectWorkspaceFilterList(param, workspaceName, type) {
        this.dataCheck = true
        this.workspaceFilterList = []
        console.log(workspaceName, "workspaceName")
        let params = ""
        let list = []
        if (workspaceName == "all" || workspaceName == undefined) {
            params = param
        } else {
            params = param + "?workspace=" + workspaceName
        }
        const apiList = await this.CallApi.callAPI(params);

        if (type != undefined) {
            list = apiList.data.filter(data => data.projectType == type)
            console.log(list, "list")
        } else {
            console.log(type, "type")
            list = apiList
        }
        runInAction(() => {
            if (workspaceName == "all") {
                this.projectAllList = list
            }
            this.workspaceFilterList = list;
            this.dataCheck = false

            // this.projectList = list;

        });
    }
    async getClusterFilterList(param, clusterName, type) {
        // this.dataCheck = true
        this.workspaceFilterList = []
        console.log(clusterName, "clusterName")
        let params = ""
        let list = []
        if (clusterName == "all") {
            params = param
        } else {
            params = param + "?cluster=" + clusterName
        }
        const apiList = await this.CallApi.callAPI(params);
        if (param == "projects") {
            if (type != undefined) {
                list = apiList.data.filter(data => data.projectType == type)
                console.log(list, "list")
            } else {
                console.log(type, "type")
                list = apiList
            }
        }

        runInAction(() => {
            if (param == "projects") {
                this.clusterFilterList = list;
                // this.dataCheck = false
            } else {
                this.clusterFilterList = apiList.data;
                // this.dataCheck = false
            }
            // this.projectList = list;
        });
    }

    async getFilterList(param, groupName, projectName) {
        this.dataCheck = true
        console.log(param, "param", groupName, "groupName", projectName, "projectName")
        let params = ""
        if (projectName == null || projectName == undefined || projectName == "all") {
            if (groupName == "all") {
                params = param
            } else {
                params = param + "?workspace=" + groupName
            }
        } else {
            params = param + "?workspace=" + groupName + "&project=" + projectName
        }

        const apiList = await this.CallApi.callAPI(params);

        console.log(apiList, "apiList")

        runInAction(() => {
            if (projectName == null || projectName == undefined || projectName == "all") {
                if (apiList.data != null) {
                    this.FilterOption = apiList.data

                } else {
                    this.FilterOption = null
                }
                this.dataCheck = false
            }
            if (apiList.data != null) {
                if (param == "deployments") {
                    this.deploymentFilterList = apiList.data
                } else if (param == "services") {
                    this.serviceFilterList = apiList.data
                } else if (param == "jobs") {
                    this.jobFilterList = apiList.data
                } else if (param == "cronjobs") {
                    this.cronjobFilterList = apiList.data
                } else if (param == "pods") {
                    this.podFilterList = apiList.data
                }
            } else {
                if (param == "deployments") {
                    this.deploymentFilterList = []
                } else if (param == "services") {
                    this.serviceFilterList = []
                } else if (param == "jobs") {
                    this.jobFilterList = []
                } else if (param == "cronjobs") {
                    this.cronjobFilterList = []
                } else if (param == "pods") {
                    this.podFilterList = []
                }
            }
            this.dataCheck = false
        });
    }
    async getProjectDetail(param, name, clusterName, workspaceName) {
        console.log("getProjectDetail");
        let params = ""
        let data = []
        // let apiList = ""
        if (clusterName.length > 1) {
            const multiProject = await Promise.all(clusterName.map((list, index) => {
                params = param + "/" + name + "?workspace=" + workspaceName + "&cluster=" + list
                let apiList = this.CallApi.callAPI(params)
                return apiList
            }))
            multiProject.map((list, index) => data.push(list.data))
        }

        else {
            params = param + "/" + name + "?workspace=" + workspaceName + "&cluster=" + clusterName
            const apiList = await this.CallApi.callAPI(params);
            data = apiList.data
        }
        // console.log(data, "data")


        runInAction(() => {
            if (data != null) {
                if (param == "clusters") {
                    this.clusterDetail = data
                } else if (param == "projects") {
                    this.projectDetail = data
                }
            } else {
                if (param == "clusters") {
                    this.clusterDetail = null
                } else if (param == "projects") {
                    this.projectDetail = null
                }
            }
        });
    }

    async getClusterDetail(param, clusterName) {

        let params = ""
        params = param + "/" + clusterName
        // console.log(params)
        const apiList = await this.CallApi.callAPI(params);

        // console.log(apiList)

        runInAction(() => {
            this.clusterDetailMaster = apiList
            this.clusterDetailMaster = apiList.master
            this.clusterDetailWorker = apiList.worker
        });
    }

    async getWorkloadDetail(param, name, workspaceName, projectName, clusterName) {
        let params = ""
        params = param + "/" + name + "?workspace=" + workspaceName + "&project=" + projectName + "&cluster=" + clusterName
        // console.log(params)

        const apiList = await this.CallApi.callAPI(params);
        console.log(apiList, "apiList")
        runInAction(() => {
            if (apiList !== undefined) {
                if (param == "deployments") {
                    this.deploymentDetail = apiList
                    this.deploymentDetailInvolve = this.deploymentDetail.involvesData
                    this.deploymentDetail = this.deploymentDetail.data
                } else if (param == "services") {
                    this.serviceDetail = apiList
                    this.serviceDetailInvolve = this.serviceDetail.involvesData
                    this.serviceDetail = this.serviceDetail.data
                } else if (param == "pods") {
                    this.podDetail = apiList
                    this.podDetailInvolve = this.podDetail.involvesData
                    this.podDetail = this.podDetail.data
                } else if (param == "jobs") {
                    this.jobDetail = apiList
                    this.jobDetailInvolve = this.jobDetail.involvesData
                    this.jobDetail = this.jobDetail.data
                } else if (param == "cronjobs") {
                    this.cronjobDetail = apiList
                    this.cronjobDetailInvolve = this.cronjobDetail.involvesData
                    this.cronjobDetail = this.cronjobDetail.data
                }
            }
        });
    }

    async getDBProejct(param) {

        let params = ""
        params = param
        const apiList = await this.CallApi.callAPI(params);

        runInAction(() => {
            this.userprojects = apiList
            this.userprojects = this.userprojects.data
        });
    }


    async postDeployment(param, body) {
        // this.dataCheck = true
        const err = await this.CallApi.postAPI(param, body);
        // console.log("err23424 : ", err);
        // console.log("postWorkspaceList");
        // console.log(err.error)
        runInAction(() => {
            this.postWorkspaceMessage = err
            // this.workspaceList = apiList.data;
            // this.dataCheck = false
            this.postCode = err.error.status_code
            this.postMessage = err.error.message

        });
    }

}
const callApiStore = new CallApiStore();
export default callApiStore;