import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { BASIC_AUTH, SERVER_URL } from "../config";

class ComponentManage {
  componentList = [];
  componentDetail = {};
  totalElements = 0;

  constructor() {
    makeAutoObservable(this);
  }

  loadComponentList = async () => {
    await axios.get(`${SERVER_URL}/components`).then((res) => {
      runInAction(() => {
        const list = res.data.data;
        this.componentList = list;
        this.componentDetail = list[0];
        this.totalElements = list.length;
      });
    });
  };
}

const ComponentStore = new ComponentManage();
export default ComponentStore;
