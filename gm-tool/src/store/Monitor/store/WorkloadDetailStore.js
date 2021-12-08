import { makeAutoObservable, runInAction } from "mobx";
import WorkloadDetail from "../api/WorkloadDetail";
import DBApi from "../api/DBApi";
import { CollectionsOutlined } from "@material-ui/icons";



class WorklaodDetailStore {
    detailPodList = [];
    detailServiceList = [];
    endpointList = [];
    detailDeploymentList = [];
    namespaceList = [];
    systemProjectList = [];
    userProjectList = [];
    projectClusterName = "All";
    ProjectAppResource = [];
    detailNamespaceList = []
    detailSytsemProject = []
    detailUserProject = []
    detailNamespaceStatus = "";
    clusters = [];
    clusterList = [];
    projectDetailCluster = [];


    constructor() {
        makeAutoObservable(this);
        this.workalodDetail = new WorkloadDetail();
        this.dbApi = new DBApi();
    }

    async getDetailPodList(param) {
        const apiList = await this.workalodDetail.callPodAPI(param);
        console.log("getDetailPodList");
        runInAction(() => {
            this.detailPodList = apiList;
            this.detailPodList = this.detailPodList.items
        });
    }
    async getDetailServiceList(param) {
        const apiList = await this.workalodDetail.callServiceAPI(param);
        console.log("getDetailServiceList");
        runInAction(() => {
            this.detailServiceList = apiList;
            this.detailServiceList = this.detailServiceList.items
        });
    }
    async getEndpointList(param) {
        const apiList = await this.workalodDetail.callEndpointAPI(param);
        console.log("getEndpointList");
        runInAction(() => {
            this.endpointList = apiList;
            this.endpointList = this.endpointList.subsets
        });
    }
    async getDeploymentList(param) {
        const apiList = await this.workalodDetail.callDeploymentAPI(param);
        console.log("getDeploymentList");
        runInAction(() => {
            this.detailDeploymentList = apiList;
            this.detailDeploymentList = this.detailDeploymentList.items
        });
    }
    async getNamespaceList(param) {
        const apiList = await this.workalodDetail.callNamespaceAPI(param);
        console.log("getNamespaceList");
        runInAction(() => {

            this.namespaceList = apiList;
            this.namespaceList = this.namespaceList.items
        });
    }
    async getDetailNamespaceList(group, project, projectType) {
        let projectlist = [];
        let apiList = [];
        if (projectType == "system") {
            const clusters = await this.dbApi.callAPI("clusters/" + group)
            let param = group + "/namespaces/" + project;
            let token = clusters.data.token;
            apiList.push(await this.workalodDetail.callAPIv2(param, token))
            // console.log(apiList)
        } else {
            const workspaces = await this.dbApi.callAPI("workspaces/" + group)
            const clusters = (workspaces.data.selectCluster).split(",")
            const cluster = await Promise.all(clusters.map((list, key) => {
                projectlist = this.dbApi.callAPI("clusters/" + list);
                return projectlist
            }))
            apiList = await Promise.all(cluster.map((list, index) => {
                // console.log(list.data.clusterName)
                let param = list.data.clusterName + "/namespaces/" + project;
                let token = list.data.token;
                projectlist = this.workalodDetail.callAPIv2(param, token)
                return projectlist
            }))
            apiList.map((list, index) => {
                list["cluster"] = cluster[index].data.clusterName
            })
        }
        // const apiList = await this.workalodDetail.callAPIv2(param);
        console.log("getDetailNamespaceList");
        runInAction(() => {
            this.detailNamespaceList = apiList;
            if (projectType == "system") {
                this.detailSytsemProject = apiList;
            } else {
                this.detailUserProject = apiList;
            }

            // this.detailNamespaceStatus = this.detailNamespaceList.status.phase
            // this.detailNamespaceList = this.detailNamespaceList.metadata
        });
    }
    async getProjectAppResource(group, project) {
        let projectlist = [];
        let apiList = [];
        let clusterList = []
        let podCount = 0;
        const clusters = await Promise.all(group.map(clusterName => {
            // console.log(clusterName)
            clusterList = this.dbApi.callAPI("clusters/" + clusterName)
            // console.log(clusterList)
            // let cluster = this.dbApi.callAPI("clusters/" + clusterName);
            return clusterList
        }))
        console.log(clusters)

        projectlist = await Promise.all(clusters.map((list, key) => {
            let clusterName = list.data.clusterName;
            let token = list.data.token

            // let podList = this.workalodDetail.callAPIv2(clusterName + "/pods", token);
            // let serviceList = this.workalodDetail.callAPIv2(clusterName + "/services", token);
            // let deploymentList = this.workalodDetail.callAPIv2(clusterName + "/deployments", token);
            // let jobList = this.workalodDetail.callAPIv2(clusterName + "/deployments", token);
            // return apiList
        }))
        // console.log(projectlist)
        // projectlist.map((list, key) => {
        //     console.log(list.items.length)
        // })


        // if (projectType == "system") {
        //     const clusters = await this.dbApi.callAPI("clusters/" + group)
        //     let param = group + "/namespaces/" + project;
        //     let token = clusters.data.token;
        //     apiList.push(await this.workalodDetail.callAPIv2(param, token))
        //     console.log(apiList)
        // } else {
        //     const workspaces = await this.dbApi.callAPI("workspaces/" + group)
        //     const clusters = (workspaces.data.selectCluster).split(",")
        //     const cluster = await Promise.all(clusters.map((list, key) => {
        //         projectlist = this.dbApi.callAPI("clusters/" + list);
        //         return projectlist
        //     }))
        //     apiList = await Promise.all(cluster.map((list, index) => {
        //         // console.log(list.data.clusterName)
        //         let param = list.data.clusterName + "/namespaces/" + project;
        //         let token = list.data.token;
        //         projectlist = this.workalodDetail.callAPIv2(param, token)
        //         return projectlist
        //     }))
        //     apiList.map((list, index) => {
        //         list["cluster"] = cluster[index].data.clusterName
        //     })
        // })
        // const apiList = await this.workalodDetail.callAPIv2(param);
        // console.log("getDetailNamespaceList");
        runInAction(() => {
            this.ProjectAppResource = apiList;
            // if (projectType == "system") {
            //     this.detailSytsemProject = apiList;
            // } else {
            //     this.detailUserProject = apiList;
            // }

            // this.detailNamespaceStatus = this.detailNamespaceList.status.phase
            // this.detailNamespaceList = this.detailNamespaceList.metadata
        });
    }

    async getClusterListV2(type) {
        const clusters = await this.dbApi.callAPI("clusters")
        const cluster = clusters.data.filter(data => data.clusterType == type);

        // console.log(cluster, "cluster")
        let apiList = []
        let apis = []
        let temp = []
        console.log("getClusterListV2");
        temp = await Promise.all(cluster.map((list, key) => {
            let param = list.clusterName + "/nodes";
            let token = list.token
            apiList = this.workalodDetail.callAPIv2(param, token);
            return apiList
        }))
        // console.log(temp, "temp")
        temp.map((list, key) => {
            apis.push(list.items)
        })
        runInAction(() => {
            this.clusterList = apis
        });
    }
    async getNamespaceListV2(type) {
        const clusters = await this.dbApi.callAPI("clusters")
        const projects = await this.dbApi.callAPI("projects")
        const workspaces = await this.dbApi.callAPI("workspaces")
        // console.log(workspaces, "workspaces")
        let apiList = []
        let apis = [];
        let temp = [];
        let dataList = [];
        console.log("getClusterListV2");
        temp = await Promise.all(clusters.data.map((list, key) => {
            let param = list.clusterName + "/namespaces";
            let token = list.token
            apiList = this.workalodDetail.callAPIv2(param, token);
            // apiList['cluster'] = list.clusterName;
            // console.log(apiList)
            return apiList
        }))

        temp.map((list, index) => {
            list.items.forEach(element => {
                element["cluster"] = clusters.data[index].clusterName
                apis.push(element)
            })
        })
        if (type === "user") {
            dataList = []
            projects.data.forEach(list => {
                list["status"] = (apis.find(namespace => namespace.metadata.name == list.projectName)).status.phase
                workspaces.data.forEach(workspace => {
                    if (list.workspaceName == workspace.workspaceName) {
                        list["clusters"] = workspace.selectCluster
                    }
                })
                dataList.push(list);
            })
        } else {
            dataList = []
            // console.log(type)
            projects.data.forEach(list => {
                apis = apis.filter(namespace => list.projectName !== namespace.metadata.name)
                dataList = apis;
            })
        }

        runInAction(() => {
            this.namespaceList = dataList
            if (type === "system") {
                this.systemProjectList = dataList
            } else {
                this.userProjectList = dataList
            }
        });
    }

}
const worklaodDetailStore = new WorklaodDetailStore();
export default worklaodDetailStore;