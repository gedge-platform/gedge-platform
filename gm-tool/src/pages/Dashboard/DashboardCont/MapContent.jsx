import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import L from "leaflet";
import { observer } from "mobx-react";
import axios from "axios";
import { dashboardStore } from "@/store";
import { SERVER_URL } from "@/config";

const MapContent = observer(() => {
  const {
    clusterName,
    edgeNodeRunning,
    setClusterName,
    loadEdgeZoneDetailDashboard,
    loadEdgeZoneDashboard,
    mapZoom,
  } = dashboardStore;

  const mapRef = useRef(null);
  const [data, setData] = useState("");
  const [dataEdgeInfo, setDataEdgeInfo] = useState("");
  const [dataStatus, setDataStatus] = useState("");
  const [nodeDatas, setNodeDatas] = useState(clusterName);

  useEffect(async () => {
    // 지도 데이터
    const result = await axios(`${SERVER_URL}/totalDashboard`);
    const edgeInfoTemp = result.data.data.edgeInfo;
    const nodeRunning = result.data.data.nodeRunning;

    const clusterNameData = edgeInfoTemp.map((item) => item.clusterName);
    // console.log("clusterNameData", clusterNameData);
    const clusterNameInNode = nodeRunning.filter(
      (item, i) => item.cluster == clusterNameData[i]
    );

    // for (let i = 0; clusterNameInNode.length > 0; i++) {}

    // console.log("clusterNameInNode", clusterNameInNode);

    // 엣지존, 클라우드 대시보드의 클러스터 이름
    setClusterName(clusterNameData[0]);
    setDataEdgeInfo(edgeInfoTemp);
    const dataPoint = edgeInfoTemp.map((item) => item.point);
    const dataStatus = edgeInfoTemp.map((item) => item.status);
    setData(dataPoint);
    setDataStatus(dataStatus);

    // nodeRunning 데이터
    // loadEdgeZoneDashboard();
    // loadEdgeZoneDetailDashboard();
    console.log(
      nodeRunning.filter((item) => item.cluster === clusterNameData[0])
    );

    //지도
    mapRef.current = L.map("map", mapParams);

    const marker = dataPoint.map((point, i) => {
      L.marker([point.y, point.x], { icon: CustomIcon("green") })
        .addTo(mapRef.current)
        .bindPopup(
          `
          <div class="leaflet-popup-title">
              ${edgeInfoTemp.map((item) => item.address)[i]}
             </div>
             <div class="leaflet-popup-table">
               <table>
                 <tr>
                   <th>Cluster</th>
                   <td>${edgeInfoTemp.map((item) => item.clusterName)[i]}</td>
                 </tr>
                 <tr>
                   <th rowspan="3">Status</th>
                   <td>
                     <div class="box run">
                       <span class="tit">
                        Ready 
                       </span>${"ddd"}
                       <span>

                         </span>
                     </div>
                   </td>
                 </tr>
                 <tr>
                   <td>
                     <div class="box stop">
                       <span class="tit">
                      Not Ready 
                     </span>
                     <span>0</span>
                     </div>
                   </td>
                 </tr>
               </table>
             </div>
             `
        );
    });
  }, []);

  // useEffect(() => {
  //   // console.log("step1");
  //   // loadMapInfo();

  //   // 지도
  //   // mapRef.current = L.map("map", mapParams);

  //   //좌표
  //   // pointArr?.map((item) => {
  //   //   console.log(item.y, item.x);
  //   //   L.marker([item.y, item.x], {
  //   //     icon: CustomIcon("green"),
  //   //   }).addTo(mapRef.current);
  //   // });

  //   // const cluster1 = L.marker([y, x], {
  //   //   icon: CustomIcon("green"),
  //   // }).addTo(mapRef.current);
  //   // const cluster2 = L.marker([37.681, 126.793], {
  //   //   icon: CustomIcon("violet"),
  //   // }).addTo(mapRef.current);
  //   // const cluster = L.marker([x.map((x) => x), y.map((y) => y)]).addTo(
  //   //   mapRef.current
  //   // );
  //   // const cluster3 = L.marker([37.581, 127.003], {
  //   //   icon: CustomIcon("red"),
  //   // }).addTo(mapRef.current);
  //   // cluster.bindPopup(
  //   //   `
  //   //     <div class="leaflet-popup-title">
  //   //       SEOUL, Republic of Korea
  //   //     </div>
  //   //     <div class="leaflet-popup-table">
  //   //       <table>
  //   //         <tr>
  //   //           <th>Cluster</th>
  //   //           <td>AZURE</td>
  //   //         </tr>
  //   //         <tr>
  //   //           <th rowspan="3">Status</th>
  //   //           <td>
  //   //             <div class="box run">
  //   //               <span class="tit">실행</span><span>7</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box stop">
  //   //               <span class="tit">중지</span><span>2</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box pause">
  //   //               <span class="tit">일시중지</span><span>1</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //       </table>
  //   //     </div>
  //   //   `
  //   // );
  //   // cluster2.bindPopup(
  //   //   `
  //   //     <div class="leaflet-popup-title">
  //   //         SEOUL, Republic of Korea
  //   //       </div>
  //   //     <div class="leaflet-popup-table">
  //   //       <table>
  //   //         <tr>
  //   //           <th>Cluster</th>
  //   //           <td>AZURE</td>
  //   //         </tr>
  //   //         <tr>
  //   //           <th rowspan="3">Status</th>
  //   //           <td>
  //   //             <div class="box run">
  //   //               <span class="tit">실행</span><span>7</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box stop">
  //   //               <span class="tit">중지</span><span>2</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box pause">
  //   //               <span class="tit">일시중지</span><span>1</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //       </table>
  //   //     </div>
  //   //   `
  //   // );
  //   // cluster3.bindPopup(
  //   //   `
  //   //     <div class="leaflet-popup-title">
  //   //       SEOUL, Republic of Korea
  //   //     </div>
  //   //     <div class="leaflet-popup-table">
  //   //       <table>
  //   //         <tr>
  //   //           <th>Cluster</th>
  //   //           <td>AZURE</td>
  //   //         </tr>
  //   //         <tr>
  //   //           <th rowspan="3">Status</th>
  //   //           <td>
  //   //             <div class="box run">
  //   //               <span class="tit">실행</span><span>7</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box stop">
  //   //               <span class="tit">중지</span><span>2</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //         <tr>
  //   //           <td>
  //   //             <div class="box pause">
  //   //               <span class="tit">일시중지</span><span>1</span>
  //   //             </div>
  //   //           </td>
  //   //         </tr>
  //   //       </table>
  //   //     </div>
  //   //   `
  //   // );
  // }, []);

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
