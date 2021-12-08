import { makeAutoObservable } from "mobx";

class PodStore {
  list = [];
}

const monitApiStore = new PodStore();
export default monitApiStore;
