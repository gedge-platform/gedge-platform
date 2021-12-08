import { makeAutoObservable, runInAction } from "mobx";
import WorkloadDetail from "../api/WorkloadDetail";
import DBApi from "../api/DBApi";



class WorkloadStore {

    podList = [];
    temp1 = [null];
    jobList = [];


    constructor() {
        makeAutoObservable(this);
        this.workalod = new WorkloadDetail();
        this.dbApi = new DBApi();
    }
    async getPodList() {
        const clusters = await this.dbApi.callAPI("clusters")
        // const cluster = clusters.data.filter(data => data.clusterType == type);

        console.log(clusters, "cluster")
        let apiList = []
        let apis = []
        let temp = []
        console.log("podlist");
        temp = await Promise.all(clusters.data.map((list, key) => {
            console.log(list.clusterName)
            let param = list.clusterName + "/pods";
            let token = list.token
            apiList = this.workalod.callAPIv2(param, token);
            return apiList
        }))
        console.log(temp, "temp")
        let clusterlist = []
        temp.map((list, index) => {
            list.items.forEach(element => {
                element["cluster"] = clusters.data[index].clusterName
                apis.push(element)
                // console.log(element)
                // clusterlist.push(element)
                // console.log(clusterlist)
            })
        })
        // temp.map((list, key) => {
        //     console.log(list)
        //     apis.push(list.items)
        // })
        runInAction(() => {
            this.podList = apis
            console.log(this.podList)
        });
        console.log(apis)
    }
    async getJobList() {
        const clusters = await this.dbApi.callAPI("clusters")
        // const cluster = clusters.data.filter(data => data.clusterType == type);

        console.log(clusters, "cluster")
        let apiList = []
        let apis = []
        let temp = []
        console.log("podlist");
        temp = await Promise.all(clusters.data.map((list, key) => {
            console.log(list.clusterName)
            let param = list.clusterName + "/jobs";
            let token = list.token
            apiList = this.workalod.callAPIv2(param, token);
            return apiList
        }))
        console.log(temp, "temp")
        let clusterlist = []
        temp.map((list, index) => {
            list.items.forEach(element => {
                element["cluster"] = clusters.data[index].clusterName
                apis.push(element)
                // console.log(element)
                // clusterlist.push(element)
                // console.log(clusterlist)
            })
        })
        // temp.map((list, key) => {
        //     console.log(list)
        //     apis.push(list.items)
        // })
        runInAction(() => {
            this.jobList = apis
            console.log(this.jobList)
        });
        console.log(apis)
    }

}
const workloadStore = new WorkloadStore();
export default workloadStore;