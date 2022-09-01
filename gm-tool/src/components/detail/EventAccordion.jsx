import React, { useState } from "react";
import styled from "styled-components";
import { dateFormatter, strFormatByLength } from "@/utils/common-utils";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import theme from "@/styles/theme";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { color } from "@mui/system";

// const EventsContainer = styled.div`
//   margin: 8px 8px;
//   padding: 12px 12px;
//   background-color: #141a30;
// `;

const EventsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 99%;
  margin: 8px 8px 8px 8px;
  padding: 12px 12px;
  border-radius: 4px;
  background-color: #2f3855;

  p {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventAccordion = ({ events }) => {
  if (events === null)
    return (
      <EventsContainer>
        <p>No Events Info.</p>
      </EventsContainer>
    );
  var color = null;
  // if (events.length < 1)
  // return <EventsContainer>No Events Info.</EventsContainer>;
  return (
    <div className="tb_container">
      <table className="tb_data">
        <tbody>
          {events.map(
            ({
              message,
              kind,
              name,
              namespace,
              cluster,
              reason,
              type,
              eventTime,
            }) => (
              <div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreRoundedIcon
                        sx={{
                          backgroundColor: "#2f3855",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      />
                    }
                    aria-controls="ProjectEvent-content"
                    id="ProjectEvent-header"
                    // sx={{ bgcolor: theme.colors.primaryDark }}
                    sx={{ backgroundColor: "#2f3855" }}
                  >
                    {type === "Warning" ? (
                      <Typography
                        sx={{
                          width: "10%",
                          fontSize: 13,
                          color: "rgba(255,0,0,0.9)",
                        }}
                      >
                        {type}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          width: "10%",
                          fontSize: 13,
                          color: "rgba(255,255,255,0.7)",
                          backgroundColor: "#2f3855",
                        }}
                      >
                        {type === "" ? "-" : type}
                      </Typography>
                    )}

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.7)",
                        backgroundColor: "#2f3855",
                      }}
                    >
                      {message === "" ? "-" : strFormatByLength(message)}
                    </Typography>
                  </AccordionSummary>
                  {/* <AccordionDetails sx={{ bgcolor: theme.colors.panelTit }}> */}
                  <AccordionDetails sx={{ backgroundColor: "#2f3855" }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.7)",
                        // bgcolor: theme.colors.primary,
                        backgroundColor: "#2f3855",
                      }}
                    >
                      <table className="tb_data">
                        <tbody className="tb_data_detail">
                          <tr>
                            <th>Kind</th>
                            <td>{kind ? kind : "-"}</td>
                            <th>Name</th>
                            <td>{name ? name : "_"}</td>
                          </tr>
                          <tr>
                            <th>Namespace</th>
                            <td>{namespace ? namespace : "_"}</td>
                            <th>Cluster</th>
                            <td>{cluster ? cluster : "_"}</td>
                          </tr>
                          <tr>
                            <th>Reason</th>
                            <td>{reason ? reason : "_"}</td>
                            <th>Type</th>
                            <td>{type ? type : "_"}</td>
                          </tr>
                          <tr>
                            <th>Event Time</th>
                            <td>{dateFormatter(eventTime)}</td>
                            <th></th>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventAccordion;
