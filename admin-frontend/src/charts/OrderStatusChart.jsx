import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const OrderStatusChart = ({ data }) => {
  // Transform backend data to recharts format
  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // Dark-theme optimized colors
  const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  // Custom percentage labels inside pie
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="var(--text-primary)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="chart-container">
      <h3
        style={{
          color: "var(--text-primary)",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        Order Status Distribution
      </h3>

      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* ✅ FIXED TOOLTIP COLORS */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                padding: "10px 12px",
              }}
              labelStyle={{
                color: "var(--text-secondary)", // 🔥 label (Cash on Delivery)
                fontWeight: 500,
              }}
              itemStyle={{
                color: "var(--accent)", // 🔥 value color
                fontWeight: 600,
              }}
              formatter={(value, name) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "16px",
          justifyContent: "center",
        }}
      >
        {chartData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
            <span>
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusChart;
