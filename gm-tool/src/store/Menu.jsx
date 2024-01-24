import { makeAutoObservable, runInAction } from "mobx";

class Menu {
  expanded = [];

  setExpanded = (nodeId) => {
    runInAction(() => {
      this.expanded = nodeId;
    });
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const menuStore = new Menu();
export default menuStore;
