import React, { useEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { PanelBox } from "@/components/styles/PanelBox";
import styled from "styled-components";
import MapContent from "./DashboardCont/MapContent";
import ClusterSummary from "./DashboardCont/ClusterSummary";
import ClusterKind from "./DashboardCont/ClusterKind";
import ClusterStatus from "./DashboardCont/ClusterStatus";
import ClusterRecent from "./DashboardCont/ClusterRecent";
import NodeList from "./DashboardCont/NodeList";
import TotalClusterResources from "./DashboardCont/TotalClusterResources";

const DashboardWrap = styled.div`
  /* display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 12px; */
  .panel_summary {
    width: 100%;
    background: transparent;
    border: 0;
    &::before {
      display: none;
    }
  }

  .panel_slide {
    width: 100%;
    background: transparent;
    border: 0;
    &::before {
      display: none;
    }
  }

  .panel_service {
    width: 100%;
    background: transparent;
    border: 0;
    &::before {
      display: none;
    }
    .cluster_nodes {
      padding: 12px;
      border-radius: 5px;
      background: #202842;
    }

    .panel_title {
      color: #fff;
    }
    .content_container {
      display: flex;
      width: 100%;
      height: 465px;
      padding: 25px;

      .cluster_info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .form_dashboard {
          width: 95%;
        }
        .MuiInputBase-input {
          background-color: #1c8be0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          text-align: center;
          font-weight: 700;
          border: none !important;
          border-radius: 8px;
        }
        svg {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.9);
        }
        .cluster_detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          height: 700px;
          width: 95%;
          background-color: #4950d6;
          margin-top: 10px;
          border-radius: 8px;

          .cluster_detail_title {
            width: 100%;
            border-radius: 8px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 15px;
            background-color: #4047cc;
          }
          .cluster_detail_content {
            height: 70px;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.9);
          }
          .cluster_resources {
            height: 288px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;

            .cluster_resource {
              width: 95px;
              height: 95px;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #4047cc;
              span {
                font-size: 12px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.9);
              }
              .resource_kind {
                margin-bottom: 4px;
              }
              .resource_number {
                font-size: 24px;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
`;

const TotalDashboard = () => {
  const currentPageTitle = Title.TotalDashboard;

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <DashboardWrap>
        <PanelBox className="panel_summary">
          <ClusterSummary />
        </PanelBox>

        <PanelBox className="panel_slide">
          <div className="cluster_slideWrap">
            <div className="cluster_slide">
              <div className="cluster_kind">
                <ClusterKind />
              </div>
              <div className="cluster_totalResources">
                <TotalClusterResources />
              </div>
            </div>
          </div>
        </PanelBox>

        <PanelBox className="panel_service">
          <div className="cluster_serviceWrap">
            <div className="cluster_status">
              <ClusterStatus />
            </div>
            <div className="cluster_map">
              <MapContent />
            </div>
            <div className="cluster_recent">
              <ClusterRecent />
            </div>
          </div>
        </PanelBox>
      </DashboardWrap>
    </Layout>
  );
};
export default TotalDashboard;
