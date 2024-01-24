import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://" + process.env.REACT_APP_HOST_IP + ":8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
