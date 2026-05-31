import { Line, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const CoinDetailsChart = ({ data, dataPricePercentage }) => {
  const color = `${dataPricePercentage < 0 ? "red" : "green"}`;

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
        <Area
          type="monotone"
          dataKey="value"
          axl
          stroke={color}
          strokeWidth={3}
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

export default CoinDetailsChart;
