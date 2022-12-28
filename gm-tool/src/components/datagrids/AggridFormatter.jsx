const converterCapacity = capacity => {
  const unit = capacity.substring(capacity.length - 2);
  const value = capacity.substring(0, capacity.length - 2);
  if (unit === "Ki") {
    return String((Number(value) / 1000000).toFixed(0) + "Gi");
  } else {
    return capacity;
  }
};

const drawStatus = status => {
  switch (status) {
    case "Bound":
    case "true":
    case "True":
    case "Active":
    case "Running":
    case "SUCCESS":
    case "Succeeded":
    case "Normal":
    case "success":
      // Green
      return `<span class="status_ico status_01">${status}</span>`;
    case "Available":
    case "1":
    case "CREATED":
      // Blue
      return `<span class="status_ico status_02">${status}</span>`;
    case "Pending":
    case "PENDING":
    case "Released":
      // Yellow
      return `<span class="status_ico status_03">${status}</span>`;
    case "false":
    case "False":
    case "FAIL":
    case "Failed":
    case "Warning":
    case "fail":
      // Red
      return `<span class="status_ico status_04">${status}</span>`;
    case "DEPLOYED":
      // Purple
      return `<span class="status_ico status_05">${status}</span>`;
  }
  // switch (type) {
  //   case "Normal":
  //     // Green
  //     return `<span class="status_ico status_01">${type}</span>`;
  //   case "Warning":
  //     // Red
  //     return `<span class="status_ico status_04">${type}</span>`;
  // }
};

export { converterCapacity, drawStatus };
