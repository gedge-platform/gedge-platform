import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import { workspaceStore, clusterStore, podStore, projectStore } from "@/store";
import PodTargetClusters from "./PodTargetClusters";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid ${(props) => (props.disabled ? "#d5d5d5" : "black")};
  color: ${(props) => (props.disabled ? "#d5d5d5" : "black")};
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

const CreatePodStepThree = observer((props) => {
  const [open, setOpen] = useState(false);
  const [containerIndex, setContainerIndex] = useState(1);
  const { sourceClusterList } = workspaceStore;
  const {
    targetClusters,
    resetTargetClusters,
    setPodInfo,
    setPodInfoPriority,
    podListInclusterAPI,
    podListIncluster,
    podInfo,
  } = podStore;

  const { selectClusterInfo } = workspaceStore;

  const { loadCluster, clusterDetail, initClusterDetail } = clusterStore;

  const { loadProjectList, projectLists } = projectStore;

  useEffect(() => {
    loadProjectList();
  }, []);

  // 프로젝트 기준의 클러스터리스트
  const selectedProject = projectLists?.find(
    (data) => data.workspace.workspaceName === podInfo.workspace
  );

  const openTargetClusters = (index) => {
    setOpen(true);
    setContainerIndex(index);
  };

  const loadSourceNode = (targetCluster) => {
    if (
      !(
        podInfo.priority.name === "GLowLatencyPriority" &&
        podInfo.priority.mode === "from_node"
      )
    ) {
      setPodInfoPriority("sourceNode", "");
    }
    loadCluster(targetCluster[0]);
  };

  const showTargetClusters = () => {
    if (targetClusters.length === 0) {
      return "+ Target Clusters";
    }
    if (podInfo.priority.name === "GSetClusterPriority") {
      return JSON.stringify(targetClusters[0]);
    }
    return JSON.stringify(targetClusters);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const PriorityComponent = () => {
    const handlePriority = (e) => {
      if (e.target.name === "name") {
        resetTargetClusters();
        if (e.target.value === "GLowLatencyPriority") {
          setPodInfo("priority", {
            name: "GLowLatencyPriority",
            mode: "from_node",
            sourceCluster: "",
            sourceNode: "",
          });
        }
        if (e.target.value === "GMostRequestPriority") {
          setPodInfo("priority", {
            name: "GMostRequestPriority",
            mode: "default",
          });
        }
        if (e.target.value === "GSelectedClusterPriority") {
          setPodInfo("priority", {
            name: e.target.value,
            mode: "cluster",
            sourceCluster: "",
          });
        }
        if (e.target.value === "GSetClusterPriority") {
          setPodInfo("priority", {
            name: e.target.value,
          });
        }
      }

      if (e.target.name === "mode") {
        resetTargetClusters();
        if (podInfo.priority.name === "GLowLatencyPriority") {
          if (e.target.value === "from_node") {
            setPodInfo("priority", {
              name: "GLowLatencyPriority",
              mode: "from_node",
              sourceCluster: "",
              sourceNode: "",
            });
          }
          if (e.target.value === "from_pod") {
            setPodInfo("priority", {
              name: "GLowLatencyPriority",
              mode: "from_pod",
              sourceCluster: "",
              podName: "",
            });
          }
        }
        if (podInfo.priority.name === "GMostRequestPriority") {
          setPodInfo("priority", {
            name: "GMostRequestPriority",
            mode: e.target.value,
          });
        }
        if (podInfo.priority.name === "GSelectedClusterPriority") {
          if (e.target.value === "cluster") {
            setPodInfo("priority", {
              name: "GSelectedClusterPriority",
              mode: "cluster",
              selectCluster: "",
            });
          }
          if (e.target.value === "node") {
            initClusterDetail();
            setPodInfo("priority", {
              name: "GSelectedClusterPriority",
              mode: "node",
              sourceCluster: "",
              sourceNode: "",
            });
          }
        }
      }

      if (e.target.name === "sourceCluster") {
        setPodInfoPriority("sourceCluster", e.target.value);
        if (podInfo.priority.mode === "from_node") {
          loadCluster(e.target.value);
          // setPodInfoPriority("sourceNode", e.target.value);
        }
        if (podInfo.priority.mode === "from_pod") {
          podListInclusterAPI(e.target.value, podInfo.project);
          setPodInfoPriority("podName", "");
        }
        if (podInfo.priority.mode === "node") {
          loadCluster(e.target.value);
          setPodInfoPriority("sourceNode", e.target.value);
        }
      }

      if (e.target.name === "sourceNode") {
        setPodInfoPriority("sourceNode", e.target.value);
      }

      if (e.target.name === "podName") {
        setPodInfoPriority("podName", e.target.value);
      }
    };

    const SelectedPriorityComponent = () => {
      switch (podInfo.priority.name) {
        case "GLowLatencyPriority":
          return (
            <>
              <tr>
                <th>
                  Priority Mode<span className="requried">*</span>
                </th>
                <td>
                  <FormControl className="form_fullWidth">
                    <select
                      name="mode"
                      value={podInfo.priority.mode}
                      onChange={handlePriority}
                    >
                      <option value={"from_node"}>from node</option>
                      <option value={"from_pod"}>from pod</option>
                    </select>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th>
                  Source Clusters & Nodes<span className="requried">*</span>
                </th>
                <td>
                  {podInfo.priority.mode === "from_node" ? (
                    <div>
                      <FormControl style={{ width: "50%" }}>
                        <select
                          name="sourceCluster"
                          value={podInfo.priority.sourceCluster}
                          onChange={handlePriority}
                        >
                          <option value={""} selected disabled hidden>
                            Select Source Cluster
                          </option>
                          {sourceClusterList?.map((cluster) => (
                            <option value={cluster.clusterName}>
                              {cluster.clusterName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormControl style={{ width: "50%", paddingLeft: "4px" }}>
                        <select
                          name="sourceNode"
                          onChange={handlePriority}
                          value={podInfo.priority.sourceNode}
                          disabled={
                            podInfo.priority.sourceCluster === "" && true
                          }
                        >
                          <option value={""} selected disabled hidden>
                            Select Source Node
                          </option>
                          {clusterDetail.nodes !== null ? (
                            clusterDetail.nodes.map((node) => (
                              <option value={node.name}>{node.name}</option>
                            ))
                          ) : (
                            <option value={"noData"}>No Data</option>
                          )}
                        </select>
                      </FormControl>
                    </div>
                  ) : (
                    <div>
                      <FormControl style={{ width: "50%" }}>
                        <select
                          name="sourceCluster"
                          value={podInfo.priority.sourceCluster}
                          onChange={handlePriority}
                        >
                          <option value={""} selected disabled hidden>
                            Select Cluster
                          </option>
                          {sourceClusterList?.map((cluster) => (
                            <option value={cluster.clusterName}>
                              {cluster.clusterName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormControl style={{ width: "50%", paddingLeft: "4px" }}>
                        <select
                          name="podName"
                          onChange={handlePriority}
                          value={podInfo.priority.podName}
                          disabled={
                            podInfo.priority.sourceCluster === "" && true
                          }
                        >
                          <option value={""} selected disabled hidden>
                            Select Pod
                          </option>
                          {podListIncluster !== null ? (
                            podListIncluster.map((pod) => (
                              <option value={pod.name}>{pod.name}</option>
                            ))
                          ) : (
                            <option value={"noData"}>No Data</option>
                          )}
                        </select>
                      </FormControl>
                    </div>
                  )}
                </td>
              </tr>
            </>
          );
        case "GMostRequestPriority":
          return (
            <tr>
              <th>
                Priority Mode<span className="requried">*</span>
              </th>
              <td>
                <FormControl>
                  <select
                    name="mode"
                    value={podInfo.priority.mode}
                    onChange={handlePriority}
                  >
                    <option value={"default"}>default</option>
                    <option value={"cpu"}>CPU</option>
                    <option value={"gpu"}>GPU</option>
                    <option value={"memory"}>MEMORY</option>
                  </select>
                </FormControl>
              </td>
            </tr>
          );
        case "GSelectedClusterPriority":
          return (
            <>
              <tr>
                <th>
                  Priority Mode<span className="requried">*</span>
                </th>
                <td>
                  <FormControl className="form_fullWidth">
                    <select
                      name="mode"
                      value={podInfo.priority.mode}
                      onChange={handlePriority}
                    >
                      <option value={"cluster"}>Cluster</option>
                      <option value={"node"}>Node</option>
                    </select>
                  </FormControl>
                </td>
              </tr>
              {podInfo.priority.mode === "node" && (
                <>
                  <tr>
                    <th>Target Clusters</th>
                    <td>
                      <Button onClick={() => openTargetClusters(-1)}>
                        {showTargetClusters()}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      Source Node<span className="requried">*</span>
                    </th>
                    <td>
                      <div>
                        <FormControl style={{ width: "100%" }}>
                          <select
                            name="sourceNode"
                            onChange={handlePriority}
                            value={podInfo.priority.sourceNode}
                          >
                            <option value={""} selected disabled hidden>
                              Select Source Node
                            </option>
                            {clusterDetail.nodes !== null ? (
                              clusterDetail.nodes.map((node) => (
                                <option value={node.name}>{node.name}</option>
                              ))
                            ) : (
                              <option value={"noData"}>No Data</option>
                            )}
                          </select>
                        </FormControl>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </>
          );
        case "GSetClusterPriority":
          return;
        default:
          break;
      }
    };

    return (
      <>
        <tr>
          <th style={{ width: "30%" }}>
            Priority Type <span className="requried">*</span>
          </th>
          <td>
            <FormControl className="form_fullWidth">
              <select name="name" onChange={handlePriority}>
                <option value={"GLowLatencyPriority"}>
                  GLowLatencyPriority
                </option>
                <option value={"GMostRequestPriority"}>
                  GMostRequestPriority
                </option>
                <option value={"GSelectedClusterPriority"}>
                  GSelectedClusterPriority
                </option>
                <option value={"GSetClusterPriority"}>
                  GSetClusterPriority
                </option>
              </select>
            </FormControl>
          </td>
        </tr>
        {SelectedPriorityComponent()}
      </>
    );
  };

  return (
    <>
      <PodTargetClusters
        open={open}
        onClose={handleClose}
        onComplete={loadSourceNode}
      ></PodTargetClusters>

      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>고급 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>스케줄러</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>설정 검토</span>
          </div>
        </div>
      </div>

      <table className="tb_data_new tb_write">
        <tbody>
          {PriorityComponent()}
          {podInfo.priority.mode === "node" ? (
            <></>
          ) : (
            <tr>
              <th>Target Clusters</th>
              <td>
                <Button
                  style={{ marginBottom: "2px" }}
                  onClick={() => openTargetClusters(-1)}
                >
                  {showTargetClusters()}
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
});

export default CreatePodStepThree;
