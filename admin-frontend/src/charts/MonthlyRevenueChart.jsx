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

const MonthlyRevenueChart = ({ data }) => {
  // Generate last 12 months data, filling missing months with zero
  const generateLast12Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const existingData = data.find(item =>
        item._id.month === (date.getMonth() + 1) && item._id.year === date.getFullYear()
      );

      months.push({
        month: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        fullMonth: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        monthKey: monthKey,
        revenue: existingData ? existingData.revenue : 0,
        orders: existingData ? existingData.orders : 0,
      });
    }

    return months;
  };

  const chartData = generateLast12Months();

  return (
    <div className="chart-container">
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px' }}>
        Monthly Revenue (Last 12 Months)
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="month"
              stroke="var(--text-secondary)"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
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
                fontSize: '12px',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullMonth;
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
              fill="#10b981"
              stroke="#059669"
              strokeWidth={2}
              radius={[6, 6, 0, 0]}
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
            ₹{chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Total Orders</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            {chartData.reduce((sum, item) => sum + item.orders, 0)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Avg per Month</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            ₹{chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
