import { observer } from "mobx-react";
import React from "react";
import volumeStore from "../../../../store/Volume";

const VolumePopup = observer(() => {
  const { responseData } = volumeStore;
  return <div dangerouslySetInnerHTML={{ __html: responseData }}></div>;
});

export default VolumePopup;
