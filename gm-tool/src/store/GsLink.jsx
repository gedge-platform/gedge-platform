import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { GSLINK_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";

class GsLink {
  gsLinkList = [];

  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;

  constructor() {
    makeAutoObservable(this);
  }

  gsLinkInfo = {
    user_name: "",
    workspace_name: "",
    project_name: "",
    namespace_name: "",
    status: "active",
    source_type: "pod",
  };

  parameters = {
    source_cluster: "",
    source_name: "",
    source_service: "",
    target_cluster: "",
  };

  setGsLinkInfo = (name, value) => {
    runInAction(() => {
      this.gsLinkInfo[name] = value;
    });
  };

  setParameters = (name, value) => {
    runInAction(() => {
      this.parameters[name] = value;
    });
  };

  initGsLinkInfo = () => {
    this.gsLinkInfo = {
      user_name: "",
      workspace_name: "",
      project_name: "",
      namespace_name: "",
      status: "active",
      source_type: "pod",
      parameters: {
        source_cluster: "",
        source_name: "",
        source_service: "",
        target_cluster: "",
      },
    };
  };

  initParameters = () => {
    this.parameters = {
      source_cluster: "",
      source_name: "",
      source_service: "",
      target_cluster: "",
    };
  };

  nodeList = [];
  setLodeList = (value) => {
    runInAction(() => {
      this.nodeList = value;
    });
  };

  initViewList = () => {
    runInAction(() => {
      this.viewList = null;
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
      if (this.gsLinkList !== null) {
        this.viewList = this.gsLinkList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadGsLinkList = async () => {
    await axios
      .get(`${GSLINK_URL}`)
      .then((res) => {
        runInAction(() => {
          if (res.data !== null) {
            this.gsLinkList = res.data;
            this.totalPages = Math.ceil(res.data.length / 10);
            this.totalElements = res.data.length;
          } else {
            this.gsLinkList = [];
            this.totalPages = "1";
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((error) => {
        this.gsLinkList = [];
        this.paginationList();
      });
  };

  postGsLink = async (data, callback) => {
    let { id } = getItem("user");

    const body = {
      user_name: id,
      workspace_name: this.gsLinkInfo.workspace_name,
      project_name: this.gsLinkInfo.project_name,
      namespace_name: "",
      status: "active",
      source_type: "pod",
      parameters: {
        source_cluster: this.parameters.source_cluster,
        source_name: "",
        source_service: this.parameters.source_service,
        target_cluster: this.parameters.target_cluster,
      },
    };
    await axios
      .post(`${GSLINK_URL}`, body)
      .then((res) => {
        runInAction(() => {
          if (res.status === 200) {
            swalError("이동에 성공하였습니다.", callback);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteGsLink = async (requestId) => {
    await axios
      .delete(`${GSLINK_URL}/${requestId}`)
      .then((res) => {
        runInAction(() => {
          if (res.status === 200) {
            swalError("삭제되었습니다.", callback);
          }
          if (res.status === 400) {
            swalError("삭제에 실패했습니다.", callback);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

const gsLinkStore = new GsLink();
export default gsLinkStore;
