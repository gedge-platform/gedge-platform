import React, { useState } from "react";
import styled from "styled-components";
import { dateFormatter, strFormatByLength } from "@/utils/common-utils";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import theme from "@/styles/theme";
import { drawStatus } from "@/components/datagrids/AggridFormatter";
import { color } from "@mui/system";

const EventsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 99%;
  margin: 8px 8px 8px 8px;
  padding: 12px 12px;
  background-color: #2f3855;
  border: 1px double #141a30;

  p {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventAccordion = ({ events }) => {
  if (events === null || events === undefined) {
    return (
      <EventsContainer>
        <p>No Events Info</p>
      </EventsContainer>
    );
    // } else if (events.message === null || events.message === "") {
    //   return (
    //     <EventsContainer>
    //       <p>No Events Info</p>
    //     </EventsContainer>
    //   );
  } else {
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
                        <ExpandMoreRounded
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
                          {type}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.7)",
                          backgroundColor: "#2f3855",
                        }}
                      >
                        {message ? strFormatByLength(message) : "No Message"}
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
                              <td>{name ? name : "-"}</td>
                            </tr>
                            <tr>
                              <th>Namespace</th>
                              <td>{namespace ? namespace : "-"}</td>
                              <th>Cluster</th>
                              <td>{cluster ? cluster : "-"}</td>
                            </tr>
                            <tr>
                              <th>Reason</th>
                              <td>{reason ? reason : "-"}</td>
                              <th>Type</th>
                              <td>{type ? type : "-"}</td>
                            </tr>
                            <tr>
                              <th>Event Time</th>
                              <td>
                                {eventTime ? dateFormatter(eventTime) : "-"}
                              </td>
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
  }
};

export default EventAccordion;
