import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { PanelBox } from "@/components/styles/PanelBox";
import styled from "styled-components";
import { FormControl, MenuItem, Select } from "@mui/material";
import { serviceAdminDashboardStore, monitoringStore } from "@/store";
import { observer } from "mobx-react";
import ServiceAdminChart from "./ServiceAdminChart";
import { unixStartTime, stepConverter, unixCurrentTime, unixToTime } from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";
import { data } from "react-dom-factories";

const ServiceAdminWrap = styled.div`
  padding: 0 10px;
  .panel_summary {
    width: 100%;
    margin-bottom: 12px;
    background: #202842;
    border: 0;
    border-radius: 8px;
    &::before {
      display: none;
    }
  }
`;

const ButtonStyle = styled.button`
  width: 100%;
  height: 16%;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  border: #6765bf;
  background-color: #6765bf;
  color: #ffff;
  border-radius: 5px;
`;

const ServiceAdminDashboard = observer(() => {
  const {
    loadServiceAdminDashboard,
    dashboardData,
    workspaceNameList,
    loadWorkspaceName,
    setWorkspaceName,
    projectList,
    podCpuTop,
    podMemTop,
    projectCpuTop,
    projectMemTop,
    resource,
    serviceAdminMonitoring,
    loadProjectName,
    setProjectNameInMonitoring,
    resourceMetricData,
    allMetrics,
    deploymentMetrics,
    setDeploymentMetrics,
    jobMetrics,
    podMetrics,
    volumeMetrics,
    cronjobMetrics,
    daemonsetMetrics,
    serviceMetrics,
    statefulsetMetrics,
  } = serviceAdminDashboardStore;

  const { lastTime, interval } = monitoringStore;
  const [resetTest, setResetTest] = useState("");

  useEffect(() => {
    loadWorkspaceName();
    loadServiceAdminDashboard(setWorkspaceName);
    loadProjectName();
    serviceAdminMonitoring();
  }, []);

  const currentPageTitle = Title.ServiceAdminDashboard;

  const onChange = ({ target: { name, value } }) => {
    if (name === "workspace") {
      setWorkspaceName(value);
      loadServiceAdminDashboard(value);
    }
    if (name === "projectName") {
      console.log("projectName", value);
      setProjectNameInMonitoring(value);
      serviceAdminMonitoring(
        value,
        unixStartTime(60),
        unixCurrentTime(),
        stepConverter(5)
      );
      // setDeploymentMetrics("");
    }
  };

  const [toggleProject, setToggleProject] = useState(false);
  const clickToggleProject = e => {
    setToggleProject(current => !current);
  };

  const [togglePod, setTogglePod] = useState(false);
  const clickTogglePod = e => {
    setTogglePod(current => !current);
  };

  // const searchMetrics = (MetricList, name) => {
  //   let metrics = [];
  //   console.log(MetricList);

  //   if (MetricList[0].length > 0) {
  //     MetricList[0].forEach((element) => {
  //       const tempMetrics = {
  //         x: unixToTime(element[0]),
  //         y: parseFloat(element[1]),
  //       };
  //       metrics.push(tempMetrics);
  //     });
  //     const data = {
  //       name: MetricList[1],
  //       data: metrics,
  //     };
  //     console.log(data);
  //     return data;
  //   } else {
  //     for (
  //       let index = unixStartTime(60);
  //       index < unixCurrentTime();
  //       index = index + 60 * 5
  //     ) {
  //       const tempMetrics = {
  //         x: unixToTime(index),
  //         y: 0,
  //       };
  //       metrics.push(tempMetrics);
  //     }
  //     const data = {
  //       name: MetricList[1],
  //       data: metrics,
  //     };
  //     console.log(data);
  //   }
  //   return data;
  // };

  let MetricList = [];
  const searchMetrics = (MetricList, name) => {
    let metrics = [];
    MetricList[0].forEach(element => {
      const tempMetrics = {
        x: unixToTime(element[0]),
        y: parseFloat(element[1]),
      };
      metrics.push(tempMetrics);
    });
    const data = {
      name: MetricList[1],
      data: metrics,
    };
    return data;
  };

  const podCpuTop5 = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {podCpuTop[i] ? podCpuTop[i]["name"] : "-"}
        </li>,
      );
    }
    return arr;
  };

  const projectMemTop5 = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {projectMemTop[i] ? projectMemTop[i]["name"] : "-"}
        </li>,
      );
    }
    return arr;
  };

  const projectCpuTop5 = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {projectCpuTop[i] ? projectCpuTop[i]["name"] : "-"}
        </li>,
      );
    }
    return arr;
  };

  const podMemTop5 = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {podMemTop[i] ? podMemTop[i]["name"] : "-"}
        </li>,
      );
    }
    return arr;
  };

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <ServiceAdminWrap>
        <div className="ServiceSummaryWrap">
          <div className="ServiceSummary Workspace">
            <div className="SummaryCountTitle">전체 워크스페이스 개수</div>
            <div className="SummaryCount">{dashboardData.workspaceCnt}</div>
          </div>

          <div className="ServiceSummary Project">
            <div className="SummaryCountTitle">전체 프로젝트 개수</div>
            <div className="SummaryCount">{dashboardData.projectCnt}</div>
          </div>
        </div>

        <PanelBox className="panel_summary">
          <div className="monitoringWrap">
            <div className="monitoringTitle">
              Overview
              <div className="ServiceSelect">
                <FormControl className="form_serviceAdmin">
                  <select name="workspace" onChange={onChange}>
                    {workspaceNameList.map(name => (
                      <option value={name}>{name}</option>
                    ))}
                  </select>
                  {/* <Select inputProps={{ "aria-label": "Without label" }}>
                    <MenuItem value="selct">SELECT</MenuItem>
                  </Select> */}
                </FormControl>
              </div>
            </div>
          </div>
          <div className="ServiceCircleWrap">
            <div className="service_circle_inner">
              <div className="service_circle">
                <span className="count">{projectList ? projectList?.length : 0}</span>
                <div className="title">Project</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[1]}</span>
                <div className="title">Deployment</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[2]}</span>
                <div className="title">Daemonset</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[3]}</span>
                <div className="title">Statefulset</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[4]}</span>
                <div className="title">Pod</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[5]}</span>
                <div className="title">Service</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[6]}</span>
                <div className="title">Cronjob</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[7]}</span>
                <div className="title">Job</div>
              </div>

              <div className="service_circle">
                <span className="count">{Object.values(resource)[8]}</span>
                <div className="title">Volume</div>
              </div>
            </div>
          </div>

          <>
            <div className="ServiceRecentWrap">
              {/* <div className="ServiceRecentTitle"> */}
              {toggleProject ? (
                <div className="ServiceRecentInner">
                  <ButtonStyle variant="contained" onClick={clickToggleProject} toggle={toggleProject}>
                    Project CPU Top 5
                  </ButtonStyle>
                  {/* </div> */}
                  <div className="ServiceRecentListWrap">
                    <ul>{projectCpuTop5()}</ul>
                  </div>
                </div>
              ) : (
                <div className="ServiceRecentInner">
                  <ButtonStyle variant="contained" onClick={clickToggleProject} toggle={toggleProject}>
                    Project Memory Top 5
                  </ButtonStyle>
                  <div className="ServiceRecentListWrap">
                    <ul>{projectMemTop5()}</ul>
                  </div>
                </div>
              )}
              {togglePod ? (
                <div className="ServiceRecentInner">
                  <ButtonStyle variant="contained" onClick={clickTogglePod} toggle={togglePod}>
                    Pod CPU Top 5
                  </ButtonStyle>
                  <div className="ServiceRecentListWrap">
                    <ul>{podCpuTop5()}</ul>
                  </div>
                </div>
              ) : (
                <div className="ServiceRecentInner">
                  <ButtonStyle variant="contained" onClick={clickTogglePod} toggle={togglePod}>
                    Pod Memory Top 5
                  </ButtonStyle>
                  <div className="ServiceRecentListWrap">
                    <ul>{podMemTop5()}</ul>
                  </div>
                </div>
              )}
            </div>
          </>
        </PanelBox>

        <PanelBox className="panel_summary">
          <div className="monitoringWrap">
            <div className="monitoringTitle">
              Monitoring
              <div className="ServiceSelect">
                <FormControl className="form_serviceAdmin">
                  {projectList !== 0 ? (
                    <select name="projectName" onChange={onChange}>
                      {Object.values(projectList).map((val) => (
                        <option value={val.projectName}>
                          {val.projectName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <></>
                  )}

                  {/* {Object.values(projectList).map((val) => (
                       <option value={val.projectName}>{val.projectName}</option>
                     ))} */}
                </FormControl>
              </div>
            </div>
            <div className="monitoringInner">
              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Workspace 총 개수</div>
                <div className="monitoringBoxCont">
                  <ServiceAdminChart
                    seriesData={[
                      searchMetrics([deploymentMetrics, "deployment"]),
                      searchMetrics([cronjobMetrics, "cronjob"]),
                      searchMetrics([jobMetrics, "job"]),
                      searchMetrics([daemonsetMetrics, "daemonset"]),
                      searchMetrics([statefulsetMetrics, "statefulset"]),
                      searchMetrics([podMetrics, "pod"]),
                    ]}
                  />
                </div>
              </div>

              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Service 총 개수</div>
                <div className="monitoringBoxCont">
                  <ServiceAdminChart seriesData={[searchMetrics([serviceMetrics, "service"])]} />
                </div>
              </div>

              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Volume 총 개수</div>
                <div className="monitoringBoxCont">
                  <ServiceAdminChart seriesData={[searchMetrics([volumeMetrics, "volume"])]} />
                </div>
              </div>
            </div>
          </div>
        </PanelBox>
      </ServiceAdminWrap>
    </Layout>
  );
});
export default ServiceAdminDashboard;
