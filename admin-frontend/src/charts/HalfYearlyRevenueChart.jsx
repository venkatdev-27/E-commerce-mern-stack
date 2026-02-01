import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HalfYearlyRevenueChart = ({ data }) => {
  // Generate last 4 half-years (2 years)
  const generateLast4HalfYears = () => {
    const halfYears = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < 4; i++) {
      const year = currentYear - 1 + Math.floor(i / 2);
      const half = (i % 2) + 1; // 1 for H1, 2 for H2

      const existingData = data.find(item =>
        item._id.year === year && item._id.halfYear === `H${half}`
      );

      halfYears.push({
        period: `H${half}`,
        fullPeriod: `${half === 1 ? 'First' : 'Last'} 6 Months ${year}`,
        revenue: existingData ? existingData.revenue : 0,
        orders: existingData ? existingData.orders : 0,
      });
    }

    return halfYears;
  };

  const processedData = generateLast4HalfYears();

  return (
    <div className="chart-container">
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px' }}>
        Half-Yearly Revenue (Last 2 Years)
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="period"
              stroke="var(--text-secondary)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              domain={[0, 10000]}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullPeriod;
                }
                return label;
              }}
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="#06b6d4"
              stroke="#0891b2"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '15px',
        padding: '10px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '6px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Total Revenue</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            ₹{processedData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Total Orders</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            {processedData.reduce((sum, item) => sum + item.orders, 0)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Avg per 6 Months</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            ₹{processedData.length > 0 ? Math.round(processedData.reduce((sum, item) => sum + item.revenue, 0) / processedData.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalfYearlyRevenueChart;
