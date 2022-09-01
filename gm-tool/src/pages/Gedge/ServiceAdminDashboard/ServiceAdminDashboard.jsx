import React, { useState, useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { PanelBox } from "@/components/styles/PanelBox";
import styled from "styled-components";
import { FormControl, MenuItem, Select } from "@mui/material";
import serviceAdminDashboardStore from "../../../store/ServiceAdminDashboard";
import { observer } from "mobx-react";
import { ResponsiveLine } from "@nivo/line";
import ApexCharts from "apexcharts";

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
  useEffect(() => {
    loadWorkspaceName();
    loadServiceAdminDashboard(setWorkspaceName);
  }, []);

  const {
    loadServiceAdminDashboard,
    dashboardData,
    workspaceNameList,
    loadWorkspaceName,
    setWorkspaceNameList,
    setWorkspaceName,
    workspaceName,
    projectList,
    podCpuTop,
    podMemTop,
    projectCpuTop,
    projectMemTop,
    resource,
  } = serviceAdminDashboardStore;

  const currentPageTitle = Title.ServiceAdminDashboard;

  const onChange = ({ target: { name, value } }) => {
    if (name === "workspace") {
      setWorkspaceName(value);
      loadServiceAdminDashboard(value);
      return;
    }
    if (name === "project") {
      console.log(name, value);
    }
  };

  const [toggleProject, setToggleProject] = useState(false);
  const clickToggleProject = (e) => {
    setToggleProject((current) => !current);
  };

  const [togglePod, setTogglePod] = useState(false);
  const clickTogglePod = (e) => {
    setTogglePod((current) => !current);
  };

  const podCpuTop5 = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {podCpuTop[i] ? podCpuTop[i]["name"] : "-"}
        </li>
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
        </li>
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
        </li>
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
        </li>
      );
    }
    return arr;
  };

  const workspaceEX = [
    {
      id: "japan",
      color: "hsl(72, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 65,
        },
        {
          x: "helicopter",
          y: 86,
        },
        {
          x: "boat",
          y: 109,
        },
        {
          x: "train",
          y: 123,
        },
        {
          x: "subway",
          y: 158,
        },
        {
          x: "bus",
          y: 168,
        },
        {
          x: "car",
          y: 163,
        },
        {
          x: "moto",
          y: 37,
        },
        {
          x: "bicycle",
          y: 44,
        },
        {
          x: "horse",
          y: 218,
        },
        {
          x: "skateboard",
          y: 260,
        },
        {
          x: "others",
          y: 252,
        },
      ],
    },
  ];

  const projectEX = [
    {
      id: "france",
      color: "hsl(122, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 5,
        },
        {
          x: "helicopter",
          y: 33,
        },
        {
          x: "boat",
          y: 140,
        },
        {
          x: "train",
          y: 154,
        },
        {
          x: "subway",
          y: 296,
        },
        {
          x: "bus",
          y: 13,
        },
        {
          x: "car",
          y: 112,
        },
        {
          x: "moto",
          y: 109,
        },
        {
          x: "bicycle",
          y: 10,
        },
        {
          x: "horse",
          y: 78,
        },
        {
          x: "skateboard",
          y: 196,
        },
        {
          x: "others",
          y: 68,
        },
      ],
    },
  ];

  const podEX = [
    {
      id: "france",
      color: "hsl(122, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 5,
        },
        {
          x: "helicopter",
          y: 33,
        },
        {
          x: "boat",
          y: 140,
        },
        {
          x: "train",
          y: 154,
        },
        {
          x: "subway",
          y: 296,
        },
        {
          x: "bus",
          y: 13,
        },
        {
          x: "car",
          y: 112,
        },
        {
          x: "moto",
          y: 109,
        },
        {
          x: "bicycle",
          y: 10,
        },
        {
          x: "horse",
          y: 78,
        },
        {
          x: "skateboard",
          y: 196,
        },
        {
          x: "others",
          y: 68,
        },
      ],
    },
  ];

  const workspaceEXgraph = () => (
    <ResponsiveLine
      data={workspaceEX}
      margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
      colors={{ scheme: "accent" }} // 그래프 색
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      // enableGridX={false} // X축 실선
      // enableGridY={false} // Y축 실선
      // yFormat=" >-.2f"
      // axisTop={null}
      // axisRight={null}
      axisBottom={{
        enable: true,
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      // axisLeft={{
      //   orient: "left",
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: "count",
      //   legendOffset: -40,
      //   legendPosition: "middle",
      // }}
      pointSize={8}
      // pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true} // 점선
      // legends={[
      //   {
      //     anchor: "bottom-right",
      //     direction: "column",
      //     justify: false,
      //     translateX: 100,
      //     translateY: 0,
      //     itemsSpacing: 0,
      //     itemDirection: "left-to-right",
      //     itemWidth: 80,
      //     itemHeight: 20,
      //     itemOpacity: 0.75,
      //     symbolSize: 12,
      //     symbolShape: "circle",
      //     symbolBorderColor: "rgba(0, 0, 0, .5)",
      //   },
      // ]}
    />
  );

  const projectEXgraph = () => (
    <ResponsiveLine
      data={projectEX}
      margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
      colors={{ scheme: "category10" }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      // enableGridX={false} // X축 실선
      // enableGridY={false} // Y축 실선
      axisBottom={{
        enable: true,
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      pointSize={8}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );

  const podEXgraph = () => (
    <ResponsiveLine
      data={podEX}
      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      colors={{ scheme: "dark2" }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      pointSize={8}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );

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
                    {workspaceNameList.map((name) => (
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
                <span className="count">
                  {projectList ? projectList?.length : 0}
                </span>
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
                  <ButtonStyle
                    variant="contained"
                    onClick={clickToggleProject}
                    toggle={toggleProject}
                  >
                    Project Top 5
                  </ButtonStyle>
                  {/* </div> */}
                  <div className="ServiceRecentListWrap">
                    <ul>{projectCpuTop5()}</ul>
                  </div>
                </div>
              ) : (
                <div className="ServiceRecentInner">
                  <ButtonStyle
                    variant="contained"
                    onClick={clickToggleProject}
                    toggle={toggleProject}
                  >
                    Project Memory Top5
                  </ButtonStyle>
                  <div className="ServiceRecentListWrap">
                    <ul>{projectMemTop5()}</ul>
                  </div>
                </div>
              )}
              {togglePod ? (
                <div className="ServiceRecentInner">
                  <ButtonStyle
                    variant="contained"
                    onClick={clickTogglePod}
                    toggle={togglePod}
                  >
                    Pod Top 5
                  </ButtonStyle>
                  <div className="ServiceRecentListWrap">
                    <ul>{podCpuTop5()}</ul>
                  </div>
                </div>
              ) : (
                <div className="ServiceRecentInner">
                  <ButtonStyle
                    variant="contained"
                    onClick={clickTogglePod}
                    toggle={togglePod}
                  >
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
                  <select name="project" onChange={onChange}>
                    {Object.values(projectList).map((val) => (
                      <option value={val.projectName}>{val.projectName}</option>
                    ))}
                  </select>
                </FormControl>
              </div>
            </div>
            <div className="monitoringInner">
              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Workspace 총 개수</div>
                <div className="monitoringBoxCont">{workspaceEXgraph()}</div>
              </div>

              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Project 총 개수</div>
                <div className="monitoringBoxCont">{projectEXgraph()}</div>
              </div>

              <div className="monitoringBox">
                <div className="monitoringBoxTitle">Pod 총 개수</div>
                <div className="monitoringBoxCont">{podEXgraph()}</div>
              </div>
            </div>
          </div>
        </PanelBox>
      </ServiceAdminWrap>
    </Layout>
  );
});
export default ServiceAdminDashboard;
