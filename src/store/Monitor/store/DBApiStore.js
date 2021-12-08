import { makeAutoObservable, runInAction } from "mobx";
import DBApi from "../api/DBApi";


class DBApiStore {
    projectList = [];
    detailProject = [];
    workspaceList = []
    projectMonit = [];
    clusterList = [];
    constructor() {
        makeAutoObservable(this);
        this.DBApi = new DBApi();
    }

    async getProjectList(param) {
        const apiList = await this.DBApi.callAPI(param);
        console.log("getProjectList");
        // console.log(apiList, "apiList")
        runInAction(() => {
            this.projectList = apiList;
            // console.log(this.projectList, "this.projectList")
            this.projectList = this.projectList.data
        });
    }
    async getDetailProject(param) {
        const apiList = await this.DBApi.callAPI(param);
        console.log("getDetailProject");
        // console.log(apiList, "apiList")
        runInAction(() => {
            this.detailProject = apiList;
            // console.log(this.detailProject, "this.projectList")
            this.detailProject = this.detailProject.data
        });
    }
    async getWorkspaceList(param) {
        const apiList = await this.DBApi.callAPI(param);
        console.log("getWorkspaceList");
        // console.log(apiList, "apiList")
        runInAction(() => {
            this.workspaceList = apiList;
            // console.log(this.projectList, "this.projectList")
            this.workspaceList = this.workspaceList.data
        });
    }
    async getProjectStatus() {
        const cpu = await this.DBApi.callMonitAPI("namespace_cpu");
        const memory = await this.DBApi.callMonitAPI("namespace_memory");
        const podCount = await this.DBApi.callMonitAPI("namespace_pod_count");

        // console.log(apiList, "apiList")
        runInAction(() => {
            let cpuList = cpu.data
            let memoryList = memory.data
            let podCountList = podCount.data
            console.log("cpuList", cpuList);
            console.log("memoryList", memoryList);
            console.log("podCountList", podCountList);
            this.projectMonit = {
                metric: cpu.metric,
                cpu: cpu.value[1],
                memory: memory.value[1],
                podCount: podCount.value[1],
            };
            // // console.log(this.projectList, "this.projectList")
            // this.workspaceList = this.workspaceList.data
        });
    }
    async getClusterList(param) {
        const apiList = await this.DBApi.callAPI(param);
        console.log("getClusterList");
        console.log(apiList, "apiList")
        runInAction(() => {
            this.clusterList = apiList;
            // console.log(this.projectList, "this.projectList")
            this.clusterList = this.clusterList.data
        });
    }
    // async getProjectSpecList(param) {
    //     const apiList = await this.DBApi.callAPI(param);
    //     console.log("getProjectList");
    //     console.log(apiList, "apiList")
    //     runInAction(() => {
    //         this.projectList = apiList;
    //         console.log(this.projectList, "this.projectList")
    //         this.projectList = this.projectList.data
    //     });
    // }

}
const dbApiStore = new DBApiStore();
export default dbApiStore;