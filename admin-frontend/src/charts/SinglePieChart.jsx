import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SinglePieChart = ({ 
  data, 
  title, 
  dataKey = "value", 
  labelKey = "name",
  valueFormatter = (value) => value,
  labelFormatter = (label) => label
}) => {
  // Dark theme optimized colors
  const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green  
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316"  // Amber
  ];

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const value = dataPoint[dataKey];
      const label = dataPoint[labelKey];
      
      // Calculate percentage
      const total = data.reduce((sum, item) => sum + item[dataKey], 0);
      const percentage = ((value / total) * 100).toFixed(1);

      return (
        <div style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          padding: "12px 16px",
          minWidth: "180px"
        }}>
          <div style={{
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {labelFormatter(label)}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px"
          }}>
            <span style={{
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Value:
            </span>
            <span style={{
              color: "var(--accent)",
              fontSize: "14px",
              fontWeight: "700"
            }}>
              {valueFormatter(value)}
            </span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: "500"
            }}>
              Percentage:
            </span>
            <span style={{
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: "600",
              background: "rgba(59, 130, 246, 0.1)",
              padding: "2px 6px",
              borderRadius: "4px"
            }}>
              {percentage}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom percentage labels inside pie (only for significant slices)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    // Only show labels for slices larger than 8%
    if (percent < 0.08) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
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
        style={{
          textShadow: "0 1px 2px rgba(0,0,0,0.3)"
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid var(--border-color)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }}>
      {/* Chart Title */}
      <h3 style={{
        margin: "0 0 20px 0",
        fontSize: "18px",
        color: "var(--text-primary)",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: "0.5px"
      }}>
        {title}
      </h3>

      {/* Chart Container */}
      <div style={{
        width: "100%",
        height: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey={dataKey}
              label={renderCustomizedLabel}
              labelLine={false}
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            {/* Interactive Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              animationDuration={200}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "16px",
        justifyContent: "center"
      }}>
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d[dataKey], 0);
          const percentage = ((item[dataKey] / total) * 100).toFixed(1);
          
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "var(--bg-secondary)",
                borderRadius: "20px",
                border: "1px solid var(--border-color)"
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: COLORS[index % COLORS.length],
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              />
              <span style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: "600"
              }}>
                {labelFormatter(item[labelKey])}
              </span>
              <span style={{
                fontSize: "11px",
                color: "var(--text-primary)",
                fontWeight: "700",
                marginLeft: "4px"
              }}>
                {valueFormatter(item[dataKey])}
              </span>
              <span style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                marginLeft: "4px",
                background: "rgba(59, 130, 246, 0.1)",
                padding: "1px 6px",
                borderRadius: "10px"
              }}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SinglePieChart;