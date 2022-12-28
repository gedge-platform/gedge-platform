import { observer } from "mobx-react";
import React from "react";
import { deploymentStore } from "@/store";

const DeploymentPopup = observer(() => {
  const { responseData } = deploymentStore;
  return <div dangerouslySetInnerHTML={{ __html: responseData }}></div>;
});

export default DeploymentPopup;
