import { Line, ResponsiveContainer, Area, AreaChart, YAxis } from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const TinyLineChart = ({ data, dataPricePercentage }) => {
  const color = `${dataPricePercentage < 0 ? "red" : "green"}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data}>
        <defs>
          {/* Unique ID based on the color to force re-render */}
          <linearGradient id={`colorPv-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop
              offset="100%"
              stopColor={dataPricePercentage < 0 ? "red" : "green"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <YAxis hide domain={["auto", "auto"]} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={dataPricePercentage < 0 ? "red" : "#009e4a"}
          fill={`url(#colorPv-${color})`} // Referencing the dynamically created gradient ID
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={dataPricePercentage < 0 ? "red" : "#009e4a"}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TinyLineChart;
