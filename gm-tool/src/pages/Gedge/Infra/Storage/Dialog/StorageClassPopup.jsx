import { observer } from "mobx-react";
import React from "react";
import { StorageClassStore } from "@/store";

const StorageClassPopup = observer(() => {
  const { responseData } = StorageClassStore;
  return <div dangerouslySetInnerHTML={{ __html: responseData }}></div>;
});

export default StorageClass;
