import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import { PieChart, Pie } from "recharts";
const data01 = [
  {
    name: "Group A",
    value: 21.2,
  },
  {
    name: "Group B",
    value: 100-21.2,
  },
];

const PieCharts = observer(() => {
  return (
    <div>
      <PieChart width={80} height={80}>
        <Pie
          data={data01}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={15}
          fill="#ff0000"
          // fill="#8884d8"
        />
      </PieChart>
    </div>
  );
});
export default PieCharts;
