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
    <div className="location-chart w-full h-100">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart width={700} height={400}>
          <Pie data={devices} dataKey="count" labelLine={false}>
            {devices.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-4 justify-center">
        {devices.map((d, idx) => (
          <div
            key={d.name}
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: COLORS[idx % COLORS.length] }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                backgroundColor: COLORS[idx % COLORS.length],
                borderRadius: "50%",
                marginRight: 6,
              }}
            />
            {d.name}: {((d.count / stats.length) * 100).toFixed(0)}%
          </div>
        ))}
      </div>
    </div>
  );
});

export default DeviceInfo;
