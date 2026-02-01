import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const PaymentMethodPieChart = ({ data }) => {
  // Process payment method data
  const processedData = data.map((item) => ({
    name:
      item._id === "COD"
        ? "Cash on Delivery"
        : item._id === "CARD"
        ? "Card Payment"
        : item._id === "UPI"
        ? "UPI Payment"
        : item._id,
    value: item.totalAmount,
    orders: item.orderCount,
    shortName: item._id,
  }));

  // Dark-theme optimized colors
  const COLORS = {
    "Cash on Delivery": "#10b981", // green
    "Card Payment": "#3b82f6",     // blue
    "UPI Payment": "#8b5cf6",      // purple
  };

  // Percentage labels inside pie
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
    <div
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "20px",
        border: "1px solid var(--border-color)",
      }}
    >
      <h4
        style={{
          color: "var(--text-primary)",
          marginBottom: "12px",
          fontSize: "14px",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Payment Methods
      </h4>

      <div style={{ width: "100%", height: "200px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#6b7280"}
                />
              ))}
            </Pie>

            {/* ✅ FIXED TOOLTIP (NO WHITE TEXT) */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                padding: "10px 12px",
              }}
              labelStyle={{
                color: "var(--text-secondary)", // 🔥 label text
                fontWeight: 500,
              }}
              itemStyle={{
                color: "var(--accent)", // 🔥 amount text
                fontWeight: 600,
              }}
              formatter={(value, name) => [
                `₹${value.toLocaleString("en-IN")}`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "12px",
        }}
      >
        {processedData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  backgroundColor: COLORS[item.name] || "#6b7280",
                }}
              />
              <span>{item.shortName}</span>
            </div>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              ₹{item.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodPieChart;
