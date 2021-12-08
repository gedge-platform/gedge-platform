import clusterStore from "./ClusterStore";
import nodeStore from "./NodeStore";
import podStore from "./PodStore";
import workloadDetailStore from "./WorkloadDetailStore"
import dbApiStore from "./DBApiStore"
import callApiStore from "./CallApiStore"
const store = { clusterStore, nodeStore, podStore, workloadDetailStore, dbApiStore, callApiStore };
export default store;
