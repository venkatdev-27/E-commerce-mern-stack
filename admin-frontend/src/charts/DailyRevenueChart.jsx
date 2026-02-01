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

const DailyRevenueChart = ({ data }) => {
  // Generate last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;

    return {
      date: dayMonth,
      dayName: dayName,
      fullDate: date,
      revenue: 0,
      orders: 0,
      displayLabel: `${dayName} ${dayMonth}`,
    };
  });

  // Match data to the last 7 days
  data.forEach((item) => {
    const itemDate = new Date(item._id.year, item._id.month - 1, item._id.day);
    const matching = last7Days.find(d => d.fullDate.toDateString() === itemDate.toDateString());
    if (matching) {
      matching.revenue = item.revenue || 0;
      matching.orders = item.orders || 0;
    }
  });

  const chartData = last7Days;

  return (
    <div className="chart-container">
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px' }}>
        Daily Revenue (Last 7 Days)
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
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
                  return payload[0].payload.displayLabel;
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
              fill="#60a5fa"
              stroke="#3b82f6"
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
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Avg per Day</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            ₹{chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRevenueChart;
