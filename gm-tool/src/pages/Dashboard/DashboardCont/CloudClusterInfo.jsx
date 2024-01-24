import React, { useEffect } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react";
import { dashboardStore } from "@/store";
import styled from "styled-components";

const Cluster_resoureceGraphData = styled.div`
  height: 12px;
  margin: 10px 0;
  justify-content: center;
  color: #fff;
  background: #8ff17d;
  border-radius: 5px;
  font-size: 12px;
`;

const CloudClusterInfo = observer(() => {
  const {
    clusterInfo,
    master,
    worker,
    cpuUsage,
    cpuUtil,
    cpuTotal,
    diskUsage,
    diskUtil,
    diskTotal,
    memoryTotal,
    memoryUsage,
    memoryUtil,
    cloudType,
    loadCloudZoneDashboard,
    loadCloudZoneDetailDashboard,
    cloudName,
    setCloudName,
  } = dashboardStore;

  const changeCluster = ({ target: { value } }) => {
    setCloudName(value);
    loadCloudZoneDetailDashboard(value);
  };

  useEffect(() => {
    loadCloudZoneDashboard();
  }, []);

  return (
    <div className="cluster_info">
      <FormControl className="form_dashboard">
        <Select
          key={cloudName}
          value={cloudName}
          inputProps={{ "aria-label": "Without label" }}
          onChange={changeCluster}
        >
          {cloudType.map((item) => (
            <MenuItem value={item.clusterName}>{item.clusterName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="cluster_detailWrap">
        <div className="cluster_detail">
          <div className="cluster_detail_title">Name</div>

          <div className="cluster_detail_content">
            {clusterInfo.clusterName}
          </div>
          <div className="cluster_detail_title">Location</div>
          <div className="cluster_detail_content">
            <div className="cluster_detail_content_txt">
              {clusterInfo.address}
            </div>
            <div className="cluster_detail_content_circleWrap">
              <div className="cluster_detail_content_circle">
                <span className="count">{master}</span>
                <div className="title">Master Node</div>
              </div>
              <div className="cluster_detail_content_circle">
                <span className="count">{worker}</span>
                <div className="title">Worker Node</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cluster_resourceWrap">
          <div className="cluster_resourece">
            <div className="cluster_resoureceTitle">
              <div className="resource_type">CPU</div>
              <div className="resource_percent">
                {cpuUtil !== 0 ? cpuUtil.value : 0}
                <span>%</span>
              </div>
            </div>
            <div className="cluster_resoureceGraph">
              <Cluster_resoureceGraphData
                style={{ width: cpuUtil !== 0 ? cpuUtil.value + "%" : 0 + "%" }}
              />
            </div>
            <div className="cluster_resoureceInfo">
              <div className="resource_infotxt">
                <div className="usedWrap">
                  <span className="used">Used</span>
                  <span className="detail">
                    {cpuUsage !== 0 ? cpuUsage.value : 0}
                  </span>
                  <span className="category">cores</span>
                </div>
                <div className="totalWrap">
                  <span className="total">Total</span>
                  <span className="detail">
                    {cpuTotal !== 0 ? cpuTotal.value : 0}
                  </span>
                  <span className="category">cores</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cluster_resourece">
            <div className="cluster_resoureceTitle">
              <div className="resource_type">Memory</div>
              <div className="resource_percent">
                {memoryUtil !== 0 ? memoryUtil.value : 0}
                <span>%</span>
              </div>
            </div>
            <div className="cluster_resoureceGraph">
              <Cluster_resoureceGraphData
                style={{
                  width: memoryUtil !== 0 ? memoryUtil.value + "%" : 0 + "%",
                }}
              />
            </div>
            <div className="cluster_resoureceInfo">
              <div className="resource_infotxt">
                <div className="usedWrap">
                  <span className="used">Used</span>
                  <span className="detail">
                    {memoryUsage !== 0 ? memoryUsage.value : 0}
                  </span>
                  <span className="category">Gi</span>
                </div>
                <div className="totalWrap">
                  <span className="total">Total</span>
                  <span className="detail">
                    {memoryTotal !== 0 ? memoryTotal.value : 0}
                  </span>
                  <span className="category">Gi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cluster_resourece">
            <div className="cluster_resoureceTitle">
              <div className="resource_type">Disk</div>
              <div className="resource_percent">
                {diskUtil !== 0 ? diskUtil.value : 0}
                <span>%</span>
              </div>
            </div>
            <div className="cluster_resoureceGraph">
              <Cluster_resoureceGraphData
                style={{
                  width: diskUtil !== 0 ? diskUtil.value + "%" : 0 + "%",
                }}
              />
            </div>
            <div className="cluster_resoureceInfo">
              <div className="resource_infotxt">
                <div className="usedWrap">
                  <span className="used">Used</span>
                  <span className="detail">
                    {diskUsage !== 0 ? diskUsage.value : 0}
                  </span>
                  <span className="category">GB</span>
                </div>
                <div className="totalWrap">
                  <span className="total">Total</span>
                  <span className="detail">
                    {diskTotal !== 0 ? diskTotal.value : 0}
                  </span>
                  <span className="category">GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CloudClusterInfo;
