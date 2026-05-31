import { Tooltip } from "@mui/material";
import { Line, YAxis, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis } from "recharts";

const LineChartdashboard = ({ data, dataPricePercentage }) => {
  const color = `${dataPricePercentage < 0 ? "green" : "green"}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        width={"100%"}
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
      >
        {" "}
        {/*Adjust left margin to 0 */}
        <defs>
          {/* Unique ID based on the color to force re-render */}
          <linearGradient id={`colorPv-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name" // Use the 'name' key from data
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value} // Customize as needed
        />
        <YAxis
          domain={["auto", "auto"]}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `${Math.floor(value / 1000)}k`;
            }
            return value;
          }}
        />
         {/* Adding CartesianGrid for grid lines */}
         <CartesianGrid strokeDasharray="3 3" vertical={false} />

         {/* Adding Tooltip component */}
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
          }}
          labelStyle={{ fontWeight: "bold" }}
          itemStyle={{ color: color }}
        />
        <Area
          type="monotone"
          dataKey="value"
          axl
          stroke={color}
          strokeWidth={2}
          fill={`url(#colorPv-${color})`} // Referencing the dynamically created gradient ID
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineChartdashboard;
