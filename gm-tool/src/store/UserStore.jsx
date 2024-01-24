import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
import { getItem } from "../utils/sessionStorageFn";
class User {
  userList = [];
  userDetail = {};
  // user = {
  //   id: "",
  //   role: "",
  // };
  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];

  memberId = "";
  memberName = "";
  password = "";
  memberRole = "";
  email = "";
  contact = "";
  memberDescription = "";
  userName = "";

  inputs = [
    {
      memberId: "",
      memberName: "",
      password: "",
      memberRole: "PA",
      email: "",
      contact: "",
      memberDescription: "",
    },
  ];
  inputsEdit = [
    {
      memberId: "",
      memberName: "",
      password: "",
      memberRole: "PA",
      email: "",
      contact: "",
      enabled: "",
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  // checkUser = (name) => {
  //   runInAction(() => {
  //     this.userName = name;
  //   });
  // };

  setUserName = (e) => {
    runInAction(() => {
      this.userName = e;
    });
  };

  setInputs = (inputs) => {
    runInAction(() => {
      this.inputs = inputs;
    });
  };

  setInputsEdit = (inputsEdit) => {
    runInAction(() => {
      this.inputsEdit = inputsEdit;
    });
  };

  setUser = (user) => {
    runInAction(() => {
      this.user = user;
      this.role = user.role;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadUserDetail(this.viewList[0].memberId);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadUserDetail(this.viewList[0].memberId);
      }
    });
  };

  setCurrentPage = (n) => {
    runInAction(() => {
      this.currentPage = n;
    });
  };

  setTotalPages = (n) => {
    runInAction(() => {
      this.totalPages = n;
    });
  };

  convertList = (apiList, setFunc) => {
    runInAction(() => {
      let cnt = 1;
      let totalCnt = 0;
      let tempList = [];
      let cntCheck = true;
      this.resultList = {};

      apiList === null
        ? (cntCheck = false)
        : Object.entries(apiList).map(([_, value]) => {
            cntCheck = true;
            tempList.push(toJS(value));
            cnt = cnt + 1;
            if (cnt > 10) {
              cntCheck = false;
              cnt = 1;
              this.resultList[totalCnt] = tempList;
              totalCnt = totalCnt + 1;
              tempList = [];
            }
          });

      if (cntCheck) {
        this.resultList[totalCnt] = tempList;
        totalCnt = totalCnt === 0 ? 1 : totalCnt + 1;
      }

      this.setTotalPages(totalCnt);
      this.setCurrentPage(1);
      setFunc(this.resultList);
      this.setViewList(0);
    });
  };

  setUserList = (list) => {
    runInAction(() => {
      this.userList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.userList[n];
    });
  };

  loadUserList = async () => {
    await axios
      .get(`${SERVER_URL}/members`)
      .then((res) => {
        runInAction(() => {
          this.userList = res.data;
          this.totalElements = res.data.length;
        });
      })
      .then(() => {
        this.convertList(this.userList, this.setUserList);
      })
      .then(() => {
        this.loadUserDetail(this.viewList[0].memberId);
      });
  };

  loadUserDetail = async (memberId) => {
    await axios.get(`${SERVER_URL}/members/${memberId}`).then((res) => {
      runInAction(() => {
        this.userDetail = res.data;
      });
    });
  };

  postUser = async (data, callback) => {
    const body = {
      ...data,
      enabled: true,
    };
    // return
    await axios
      .post(`${SERVER_URL}/members`, body)
      .then((res) => {
        runInAction(() => {
          if (res.status === 201) {
            swalError("사용자가 생성되었습니다.", callback);
            return true;
          }
        });
      })
      .catch((err) => false);
  };
  updateUserList = async (userName, data) => {
    const body = data;
    const { id } = getItem("user");

    await axios
      .put(`${SERVER_URL}/members/${userName}`, body)
      .then((res) => {
        runInAction(() => {
          if (res.status === 200) {
            swalError("사용자가 수정되었습니다.");
            return true;
          }
        });
      })
      .catch((err) => false);
  };

  updateUser = async (data) => {
    const body = data;
    const { id } = getItem("user");
    await axios
      .put(`${SERVER_URL}/members/${id}`, body)
      .then((res) => {
        runInAction(() => {});
      })
      .catch((err) => false);
  };

  deleteUser = async (userName, callback) => {
    axios
      .delete(`${SERVER_URL}/members/${userName}`)
      .then((res) => {
        if (res.status === 200) swalError("사용자를 삭제하였습니다.", callback);
      })
      .catch((err) => {
        swalError("삭제에 실패하였습니다.");
      });
  };
}

const userStore = new User();
export default userStore;
