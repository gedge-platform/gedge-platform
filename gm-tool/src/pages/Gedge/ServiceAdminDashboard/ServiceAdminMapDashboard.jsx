import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import L from "leaflet";
import { observer } from "mobx-react";
import styled from "styled-components";
import Layout from "@/layout";
import { Title } from "@/pages";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { SERVER_URL } from "../../../config";

const LeafletContainer = styled.div`
  width: 600px;
  height: 600px;
  margin: 10px;
`;

const ServiceAdminMapDashboard = observer(() => {
  const currentPageTitle = "지도 대시보드";
  const mapRef = useRef();

  useEffect(async () => {
    const result = await axios(`${SERVER_URL}/totalDashboard`);
    const markerInfos = result.data.data.edgeInfo;

    mapRef.current = L.map("serviceadminmap", mapParams);

    const statusCircle = (status) => {
      if (status === "success") {
        return "run";
      } else if (status === "failed") {
        return "stop";
      }
    };

    const marker = markerInfos.map((info, i) => {
      L.marker([info.point.y, info.point.x], {
        icon: CustomIcon("blue"),
      }).addTo(mapRef.current).bindPopup(`
        <div class="leaflet-popup-title">
          ${info.clusterName}
        </div>
        <div class="leaflet-popup-table">
          <table>
            <tr>
              <th>Location</th>
              <td>${info.address}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <div class="box ${statusCircle(info.status)}">
                  <span class="tit">${info.status}</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>IP</th>
              <td>${info.clusterEndpoint}</td>
            </tr>
            <tr>
              <th rowSpan=${info.node_status.length + 1}>Node</th>
            </tr>
            ${info.node_status
              .map(
                (node) =>
                  `<tr>
                <td>${node.name}</td>
              </tr>`
              )
              .join("")}
          </table>
        </div>
      `);
    });
  }, []);

  const MAP_TILE = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=0f6be85b-e0ce-41a2-af27-e96c56b394fb",
    {
      maxZoom: 20,
      attribution:
        '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );

  const mapStyles = {
    overflow: "hidden",
    width: "100%",
    height: "100vh",
  };

  const mapParams = {
    center: [37.5587619, 126.974145],
    zoom: 2,
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

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <>
        {" "}
        <div
          id="serviceadminmap"
          style={{ height: "100%", width: "100%" }}
        ></div>
      </>
    </Layout>
  );
});

export default ServiceAdminMapDashboard;
