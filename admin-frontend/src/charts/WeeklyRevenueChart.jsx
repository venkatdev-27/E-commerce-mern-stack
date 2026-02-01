import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const WeeklyRevenueChart = ({ data }) => {
  // Function to get ISO week
  const getISOWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { week: weekNo, year: d.getFullYear() };
  };

  // Generate 4 weeks of current month
  const generateCurrentMonthWeeks = () => {
    const weeks = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get the first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    for (let week = 1; week <= 4; week++) {
      // Calculate start and end dates for each week
      const weekStart = new Date(firstDayOfMonth);
      weekStart.setDate((week - 1) * 7 + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Ensure we don't go beyond the month
      if (weekEnd > lastDayOfMonth) {
        weekEnd.setTime(lastDayOfMonth.getTime());
      }

      // Get the ISO week for the weekStart
      const weekInfo = getISOWeek(weekStart);

      // Find data for this week
      const existingData = data.find(item =>
        item._id.year === weekInfo.year &&
        item._id.week === weekInfo.week
      );

      weeks.push({
        week: `${week}${week === 1 ? 'st' : week === 2 ? 'nd' : week === 3 ? 'rd' : 'th'} week`,
        fullWeek: `${week}${week === 1 ? 'st' : week === 2 ? 'nd' : week === 3 ? 'rd' : 'th'} week of ${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
        weekKey: `${week}-${currentMonth + 1}-${currentYear}`,
        revenue: existingData ? existingData.revenue : 0,
        orders: existingData ? existingData.orders : 0,
      });
    }

    return weeks;
  };

  const chartData = generateCurrentMonthWeeks();

  return (
    <div className="chart-container">
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px' }}>
        Weekly Revenue (Current Month Weeks)
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="week"
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
                  return payload[0].payload.fullWeek;
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
            >
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                fontSize={10}
                fill="var(--text-primary)"
              />
            </Bar>
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
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Avg per Week</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>
            ₹{chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;
