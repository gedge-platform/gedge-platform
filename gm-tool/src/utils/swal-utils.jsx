import Swal from "sweetalert2";

export const swal = (text) => {
  return Swal.fire({
    text: text,
    width: 270,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
};

export const swalConfirm = (text) => {
  return Swal.fire({
    text: text,
    width: 270,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
};
export const swalError = (text, callback) => {
  return Swal.fire({
    text: text,
    // width: 350,
    width: 400,
    confirmButtonText: "확인",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      callback ? callback() : console.log("success");
    }
  });
};

export const swalUpdate = (text, callback) => {
  return Swal.fire({
    width: 350,
    text: text,
    showCancelButton: true,
    cancelButtonText: "취소",
    confirmButtonText: "확인",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      callback ? callback() : console.log("success");
    } else {
      console.log("fail");
    }
  });
};
