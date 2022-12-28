import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { addressStore } from "@/store";
import DaumPostcode from "react-daum-postcode";

const SearchAddress = observer(props => {
  const { open } = props;
  const { setAddress } = addressStore;

  const handleComplete = data => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
    }

    console.log(fullAddress);
    setAddress(fullAddress);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  useEffect(props => {
    console.log("props is ", props);
  }, []);

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={`Search Address`} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      <DaumPostcode onComplete={handleComplete} {...props} />
    </CDialogNew>
  );
});
export default SearchAddress;
