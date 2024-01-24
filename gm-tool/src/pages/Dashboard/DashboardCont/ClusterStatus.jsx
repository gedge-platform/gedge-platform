import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { dashboardStore, clusterStore } from "@/store";
import { useState } from "react";

const ClusterStatus = observer(() => {
  const [VMList, setVMList] = useState({});
  const { loadVMStatusCnt, configName } = dashboardStore;
  const { loadVMList, clusterList } = clusterStore;

  useEffect(() => {
    loadVMList();
    loadVMStatusCnt();
  }, [VMList]);

  const clusterStatus = () => {
    let VMcount = 0;
    let runCount = 0;
    let stopCount = 0;
    let pauseCount = 0;

    configName.forEach((e) => {
      const providerVMs = clusterList.filter(
        (item) => item.ProviderName === e.ProviderName
      );
      providerVMs.forEach((providerVM) => {
        VMcount++;

        if (providerVM.VmStatus === "Suspended") {
          pauseCount++;
        } else if (providerVM.VmStatus === "Running") {
          runCount++;
        } else if (providerVM.VmStatus === "Stop") {
          stopCount++;
        }
      });

      VMList[e.ProviderName] = {
        VMcount,
        pauseCount,
        runCount,
        stopCount,
      };

      VMcount = 0;
      pauseCount = 0;
      runCount = 0;
      stopCount = 0;
    });
  };

  return (
    <div className="ClusterStatusWrap">
      {clusterStatus()}
      {Object.keys(VMList).map((providerName) => {
        const e = VMList[providerName];

        return (
          <div className="ClusterStatusBox" key={providerName}>
            <div
              className={`ClusterStatusIcon ${
                providerName === "OPENSTACK"
                  ? "openstack"
                  : providerName === "AWS"
                  ? "aws"
                  : providerName === "GCP"
                  ? "google"
                  : "azure"
              }`}
            ></div>
            <div className="ClusterStatusInfoBox">
              <div className="Count">
                1 <span>클러스터</span>
              </div>
              <div className="Count">
                {e.VMcount} <span>VM</span>
              </div>
            </div>
            <div className="ClusterStatusList">
              <ul>
                <li className="run">
                  <span className="tit">실행</span>
                  <span>{e.runCount}</span>
                </li>
                <li className="stop">
                  <span className="tit">중지</span>
                  <span>{e.stopCount}</span>
                </li>
                <li className="pause">
                  <span className="tit">일시중지</span>
                  <span>{e.pauseCount}</span>
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default ClusterStatus;
