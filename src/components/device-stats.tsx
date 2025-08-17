import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { Stats } from "./location-stats";
import "../index.css";
import React from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DeviceInfo = React.memo(({ stats }: Stats) => {
  const deviceCount = stats.reduce<Record<string, number>>((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }

    acc[item.device]++;

    return acc;
  }, {});

  const devices = Object.entries(deviceCount).map(([device, count]) => ({
    name: device,
    count,
  }));

  return (
    <div className="location-chart w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={700} height={400}>
          <Pie
            data={devices}
            dataKey="count"
            labelLine={false}
            cx="50%"
            cy="50%"
            label={({ name, percent = 0 }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {devices.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default DeviceInfo;
