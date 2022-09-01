import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { BASIC_AUTH, SERVER_URL2 } from "../config";
import axios from "axios";

//ag-grid filter
export const agDateColumnFilter = () => {
  return {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      const dateAsString = cellValue;
      if (dateAsString == null) return -1;
      const dateParts = dateAsString.split("/");
      const cellDate = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
    suppressAndOrCondition: true,
    defaultOption: "startsWith",
  };
};

export const Toastify = (message) => {
  toast.info(message);
};

export const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const stringLength = 6;
  let randomstring = "";
  for (let i = 0; i < stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};

export const nullCheck = (str) => {
  return str ?? "Null";
};

export const isValidJSON = (text) => {
  if (text === "true" || parseInt(text) || text === "0") return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

export const dateFormatter = (date) => {
  return moment(new Date(date)).format("YYYY-MM-DD HH:mm");
};

export const strFormatByLength = (str, length = 200) => {
  if (str.length >= length) return `${str.substr(0, length)}...`;
  return str;
};

export const duplicateCheck = async (name, type) => {
  return await axios
    .get(
      `${SERVER_URL2}/duplicateCheck/${name}?type=${type}`
      // , {
      //   auth: BASIC_AUTH,
      // }
    )
    .then((res) => {
      if (res.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};
