import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { dashboardStore } from "@/store";
import styled from "styled-components";

const ButtonStyle = styled.button`
  width: 100%;
  height: 7%;
  font-size: 13px;
  font-weight: bold;
  position: relative;
  background-color: #6765bf;
  color: #ffff;
  border-radius: 5px;
  border: none;
`;

const ClusterRecent = observer(() => {
  const {
    clusterCpuTop5,
    podCpuTop5,
    clusterMemTop5,
    podMemTop5,
    loadClusterRecent,
  } = dashboardStore;

  useEffect(() => {
    loadClusterRecent();
  }, []);

  const [toggle, setToggle] = useState(false);

  const clickToggle = () => {
    setToggle((isOpen) => !isOpen);
  };

  const clusterCpuTop = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {clusterCpuTop5[i] ? clusterCpuTop5[i]["cluster"] : "-"}
        </li>
      );
    }
    return arr;
  };

  const podCpuTop = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {podCpuTop5[i] ? podCpuTop5[i]["name"] : "-"}
        </li>
      );
    }
    return arr;
  };

  const clusterMemTop = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {clusterMemTop5[i] ? clusterMemTop5[i]["cluster"] : "-"}
        </li>
      );
    }
    return arr;
  };

  const podMemTop = () => {
    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(
        <li>
          <span>{i + 1}</span>
          {podMemTop5[i] ? podMemTop5[i]["name"] : "-"}
        </li>
      );
    }
    return arr;
  };

  return (
    <>
      {toggle ? (
        <div className="ClusterRecentWrap">
          <ButtonStyle
            // variant="contained"
            onClick={clickToggle}
            toggle={toggle}
          >
            CPU Top 5
          </ButtonStyle>
          <div className="ClusterRecentTitle">Cluster CPU Top 5</div>
          <div className="ClusterRecentListWrap">
            <ul>{clusterCpuTop()}</ul>
          </div>
          <div className="ClusterRecentTitle">Pod CPU Top 5</div>
          <div className="ClusterRecentListWrap">
            <ul>{podCpuTop()}</ul>
          </div>
        </div>
      ) : (
        <div className="ClusterRecentWrap">
          <ButtonStyle
            // variant="contained"
            onClick={clickToggle}
            toggle={toggle}
          >
            Memory Top 5
          </ButtonStyle>
          <div className="ClusterRecentTitle">Cluster Memory Top 5</div>
          <div className="ClusterRecentListWrap">
            <ul>{clusterMemTop()}</ul>
          </div>
          <div className="ClusterRecentTitle">Pod Memory Top 5</div>
          <div className="ClusterRecentListWrap">
            <ul>{podMemTop()}</ul>
          </div>
        </div>
      )}
    </>
  );
});

export default ClusterRecent;
