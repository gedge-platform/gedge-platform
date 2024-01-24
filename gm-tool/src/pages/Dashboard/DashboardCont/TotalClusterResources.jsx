import React, { useEffect } from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { observer } from "mobx-react";
import ReactApexChart from "react-apexcharts";
import dashboardStore from "../../../store/Dashboard";
import PieChart from "../../Gedge/Storage/PieChart";

const TotalClusterResources = observer(() => {
  const {
    loadDashboardCnt,
    dashboardDetail,
    totalCpu,
    totalMem,
    totalDisk,
    usageTotalCpu,
    usageTotalMem,
    usageTotalDisk,
  } = dashboardStore;

  const availCpu = totalCpu - usageTotalCpu;
  const availMem = totalMem - usageTotalMem;
  const availDisk = totalDisk - usageTotalDisk;

  const availCpuTB = availCpu / 1024;
  const availMemTB = availMem / 1024;
  const availDiskTB = availDisk / 1024;

  const usageTotalCpuTB = usageTotalCpu / 1024;
  const usageTotalMemTB = usageTotalMem / 1024;
  const usageTotalDiskTB = usageTotalDisk / 1024;

  const formatStorageSize = (size) => {
    if (size < 1024) {
      return size + "GB";
    } else {
      return (size / 1024).toFixed(2) + "TB";
    }
  };

  useEffect(() => {
    loadDashboardCnt();
  }, [
    totalCpu,
    totalMem,
    totalDisk,
    usageTotalCpu,
    usageTotalMem,
    usageTotalDisk,
  ]);

  return (
    <div
      className="totalClusterResourcesWrap"
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <div className="stotalClusterResourcesCircleBox">
        <div className="totalClusterResourcesBoxTitle">Total CPU</div>
        <div
          className="chart"
          style={{
            // marginTop: "1px",
            // marginLeft: "20px",
            marginTop: "31px",
            width: "270px",
            display: "-webkit-box",
          }}
        >
          <PieChart
            total={true}
            label={["avail", "used"]}
            value={[availCpu, usageTotalCpu]}
            customOption={{ stroke: { show: false } }}
          />
          <div className="totalClusterResourcesContTxt">
            <ul>
              <li className="used">
                <span className="tit">Used</span>
                <span>{formatStorageSize(usageTotalCpu)} </span>
              </li>
              <li className="avail">
                <span className="tit">Avail</span>
                <span>{formatStorageSize(availCpu)} </span>
              </li>
              <li className="total">
                <span className="tit">Total</span>
                <span>{formatStorageSize(totalCpu)}</span>
              </li>
              <li className="none"></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stotalClusterResourcesCircleBox">
        <div className="totalClusterResourcesBoxTitle">Total Memory</div>
        <div
          className="chart"
          style={{
            marginTop: "31px",
            width: "270px",
            display: "-webkit-box",
          }}
        >
          <PieChart
            total={true}
            label={["avail", "used"]}
            value={[availMem, usageTotalMem]}
            customOption={{ stroke: { show: false } }}
          />
          <div className="totalClusterResourcesContTxt">
            <ul>
              <li className="used">
                <span className="tit">Used</span>
                <span>{formatStorageSize(usageTotalMem)}</span>
              </li>
              <li className="avail">
                <span className="tit">Avail</span>
                <span>{formatStorageSize(availMem)}</span>
              </li>
              <li className="total">
                <span className="tit">Total</span>
                <span>{formatStorageSize(totalMem)}</span>
              </li>
              <li className="none"></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stotalClusterResourcesCircleBox">
        <div className="totalClusterResourcesBoxTitle">Total Disk</div>
        <div
          className="chart"
          style={{
            marginTop: "31px",
            width: "270px",
            display: "-webkit-box",
          }}
        >
          <PieChart
            total={true}
            label={["avail", "used"]}
            value={[availDisk, usageTotalDisk]}
            customOption={{ stroke: { show: false } }}
          />
          <div className="totalClusterResourcesContTxt">
            <ul>
              <li className="used">
                <span className="tit">Used</span>
                <span>{formatStorageSize(usageTotalDisk)}</span>
              </li>
              <li className="avail">
                <span className="tit">Avail</span>
                <span>{formatStorageSize(availDisk)}</span>
              </li>
              <li className="total">
                <span className="tit">Total</span>
                <span>{formatStorageSize(totalDisk)}</span>
              </li>
              <li className="none"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TotalClusterResources;
