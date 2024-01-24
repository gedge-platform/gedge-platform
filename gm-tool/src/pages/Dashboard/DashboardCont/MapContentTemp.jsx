import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import L from "leaflet";
import { observer } from "mobx-react";
import axios from "axios";
import { dashboardStore } from "@/store";
import { SERVER_URL } from "@/config";
import { serviceAdminDashboardStore, monitoringStore } from "@/store";
import { LineElement } from "chart.js";

const MapContent = observer(() => {
  const { setClusterName, loadEdgeZoneDashboard, mapZoom, loadMapStatus } =
    dashboardStore;

  const mapRef = useRef(null);
  const [data, setData] = useState("");
  const [dataEdgeInfo, setDataEdgeInfo] = useState("");
  const [dataStatus, setDataStatus] = useState("");

  useEffect(async () => {
    // 지도 데이터
    const result = await axios(`${SERVER_URL}/totalDashboard`);
    const edgeInfoTemp = result.data.data.edgeInfo;

    const clusterNameData = edgeInfoTemp.map((item) => item.clusterName);

    // 엣지존, 클라우드 대시보드의 클러스터 이름
    setClusterName(clusterNameData[0]);
    setDataEdgeInfo(edgeInfoTemp);
    const dataPoint = edgeInfoTemp.map((item) => item.point);
    const dataStatus = edgeInfoTemp.map((item) => item.status);
    setData(dataPoint);
    setDataStatus(dataStatus);
    loadMapStatus();

    loadEdgeZoneDashboard();

    //지도
    mapRef.current = L.map("map", mapParams);

    const cluster1 = L.marker([37.493254787, 126.923915647], {
      icon: CustomIcon("red"),
    }).addTo(mapRef.current);

    const cluster2 = L.marker([37.6641929, 126.768667], {
      icon: CustomIcon("blue"),
    }).addTo(mapRef.current);

    const cluster3 = L.marker([40.09341, -82.75018], {
      icon: CustomIcon("green"),
    }).addTo(mapRef.current);

    cluster1.bindPopup(
      `
                  <div class="leaflet-popup-title">
                  서울시 동작구 보라매로 5길 35
                    </div>
                          
                          <div class="leaflet-popup-table">
                            <table>
                              <tr>
                                <th>Cluster</th>
                                <td>onpremise(dongjak)</td>
                              </tr>
                              <tr>
                                <th rowspan="3">Status</th>
                                <td>
                                  <div class="box run">
                                    <span class="tit">Ready</span><span>5</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div class="box stop">
                                    <span class="tit">Not Ready</span><span>0</span>
                                  </div>
                                </td>
                              </tr> 
                            </table>
                          </div>
                `
    );
    cluster2.bindPopup(
      `
                  <div class="leaflet-popup-title">
                  경기도 고양시 일산동구 중앙로 1333
                    </div>
                          
                          <div class="leaflet-popup-table">
                            <table>
                              <tr>
                                <th>Cluster</th>
                                <td>mec(ilsan)</td>
                              </tr>
                              <tr>
                                <th rowspan="3">Status</th>
                                <td>
                                  <div class="box run">
                                    <span class="tit">Ready</span><span>4</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div class="box stop">
                                    <span class="tit">Not Ready</span><span>0</span>
                                  </div>
                                </td>
                              </tr> 
                            </table>
                          </div>
                `
    );
    cluster3.bindPopup(
      `
                  <div class="leaflet-popup-title">
                  2570 Beech Rd NW, Johnstown, OH 43031 미국
                    </div>
                          
                          <div class="leaflet-popup-table">
                            <table>
                              <tr>
                                <th>Cluster</th>
                                <td>preprocess2-5b786958f6-dsdpj</td>
                              </tr>
                              <tr>
                                <th rowspan="3">Status</th>
                                <td>
                                  <div class="box run">
                                    <span class="tit">Ready</span><span>4</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div class="box stop">
                                    <span class="tit">Not Ready</span><span>0</span>
                                  </div>
                                </td>
                              </tr> 
                            </table>
                          </div>
                `
    );
  }, []);

  const MAP_TILE = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=0f6be85b-e0ce-41a2-af27-e96c56b394fb",
    {
      maxZoom: 20,
      attribution:
        '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );

  // Define the styles that are to be passed to the map instance:
  const mapStyles = {
    overflow: "hidden",
    width: "100%",
    height: "100vh",
  };

  const mapParams = {
    center: [37.5587619, 126.974145],
    zoom: mapZoom, // store에 저장
    zoomControl: true,
    maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
    layers: [MAP_TILE],
  };

  const CustomIcon = (color) =>
    new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  // This useEffect hook runs when the component is first mounted,
  // similar to componentDidMount() lifecycle method of class-based
  // components:

  return (
    <div
      id="map"
      style={{ height: "100%", width: "100%", pointerEvents: "none" }}
      // 지도 크기 조정
    ></div>
  );
});

export default MapContent;
