import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";

class HPA {
  viewList = null;
  totalElements = 0;
  totalPages = 1;
  currentPage = 1;
  resultList = {};
  hpaList = [];

  hpaWorkspaceList = [];
  hpaProjectList = [];
  hpaClusterList = [];
  hpaDeploymentList = [];

  constructor() {
    makeAutoObservable(this);
  }

  initViewList = () => {
    runInAction(() => {
      this.viewList = null;
      this.currentPage = 1;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.hpaList !== null) {
        this.viewList = this.hpaList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadHpaListAPI = async () => {
    await axios
      .get(`${SERVER_URL}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.hpaList = res.data.data;
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.hpaList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((error) => {
        this.hpaList = [];
        this.paginationList();
      });
  };
}

const hpaStore = new HPA();
export default hpaStore;
