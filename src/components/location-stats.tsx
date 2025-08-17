import type { UrlClicks } from "@/db/apiClicks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../index.css";
import React from "react";

export interface Stats {
  stats: UrlClicks[];
}

const Location = React.memo(({ stats }: Stats) => {
  const cityCount = stats.reduce<Record<string, number>>((acc, item) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }

    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div className="location-chart w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={700} height={300} data={cities.slice(0, 5)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis dataKey="city" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "none",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#E2E8F0" }}
            itemStyle={{ color: "#14D4E3" }}
          />
          <Legend wrapperStyle={{ color: "#E2E8F0" }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#14D4E3"
            strokeWidth={2}
            className="outline-none focus:outline-none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default Location;
