import { makeAutoObservable, runInAction } from "mobx";
class Address {
  clusterAddress = [];

  constructor() {
    makeAutoObservable(this);
  }

  setAddress = name => {
    runInAction(() => {
      this.clusterAddress = name;
    });
  };

  loadAddress = () => {
    return this.clusterAddress;
  };
}

const addressStore = new Address();
export default addressStore;
