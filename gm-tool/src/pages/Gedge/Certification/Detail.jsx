import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import EventAccordion from "@/components/detail/EventAccordion";
import certificationStore from "../../../store/Certification";


const Detail = observer((props) => {
  const{

  } = certificationStore;

  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

  }, []);

  return (
    <PanelBox>
      <CTabs>
        <CTab>
          
        </CTab>
      </CTabs>
    </PanelBox>
  );
});
export default Detail;