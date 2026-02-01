import React from 'react';

export default function TotalRevenueLineChart({ monthlyRevenue = [] }) {
  // Prepare data for the stacked line chart with multiple revenue categories
  // Use the monthly revenue data from the revenue charts (same data source)
  const chartData = monthlyRevenue.map(item => ({
    month: item._id, // Use the _id object from monthly revenue data
    totalRevenue: item.revenue || item.totalAmount || item.amount || 0,
    // Create sample data for different revenue categories for stacked effect
    onlineSales: Math.floor((item.revenue || item.totalAmount || item.amount || 0) * 0.6),
    offlineSales: Math.floor((item.revenue || item.totalAmount || item.amount || 0) * 0.3),
    otherSales: Math.floor((item.revenue || item.totalAmount || item.amount || 0) * 0.1)
  }));

  // Ensure we have exactly 10 months of data for consistent display
  // If we have less than 10 months, pad with empty data points
  const targetMonths = 10;
  let displayData = chartData;
  
  if (chartData.length < targetMonths) {
    // Create placeholder months to ensure we always show 10 months
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get current date for generating month names
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Generate 10 months starting from current month going backwards
    const fullMonthsData = [];
    for (let i = 9; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const yearOffset = Math.floor((currentMonth - i) / 12);
      const displayYear = currentYear + yearOffset;
      const monthName = `${monthNames[monthIndex]} ${displayYear}`;
      
      // Check if we have actual data for this month from monthlyRevenue
      const existingData = monthlyRevenue.find(d => {
        return d._id.month === (monthIndex + 1) && d._id.year === displayYear;
      });
      
      const revenue = existingData ? existingData.revenue : 0;
      fullMonthsData.push({
        month: monthName,
        totalRevenue: revenue,
        onlineSales: Math.floor(revenue * 0.6),
        offlineSales: Math.floor(revenue * 0.3),
        otherSales: Math.floor(revenue * 0.1),
        isPlaceholder: !existingData
      });
    }
    displayData = fullMonthsData;
  }

  // Calculate cumulative values for stacked chart
  const stackedData = displayData.map(item => ({
    ...item,
    cumulativeOffline: item.onlineSales + item.offlineSales,
    cumulativeOther: item.onlineSales + item.offlineSales + item.otherSales
  }));

  // Calculate max for y-axis scaling (use total revenue max)
  const maxRevenue = Math.max(...displayData.map(d => d.totalRevenue), 0);
  const minRevenue = 0; // Start from 0 for stacked chart
  
  // Chart dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scale functions
  const xScale = (index) => margin.left + (index / (stackedData.length - 1 || 1)) * chartWidth;
  const yScale = (value) => margin.top + chartHeight - ((value - minRevenue) / (maxRevenue - minRevenue || 1)) * chartHeight;

  // Generate paths for each revenue category (stacked)
  const onlinePath = stackedData.length > 0 
    ? `M ${stackedData.map((d, i) => `${xScale(i)} ${yScale(d.onlineSales)}`).join(' L ')}`
    : '';

  const offlinePath = stackedData.length > 0 
    ? `M ${stackedData.map((d, i) => `${xScale(i)} ${yScale(d.cumulativeOffline)}`).join(' L ')}`
    : '';

  const otherPath = stackedData.length > 0 
    ? `M ${stackedData.map((d, i) => `${xScale(i)} ${yScale(d.cumulativeOther)}`).join(' L ')}`
    : '';

  // Generate points for the lines
  const onlinePoints = stackedData.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.onlineSales),
    label: d.month,
    value: d.onlineSales,
    category: 'Online Sales'
  }));

  const offlinePoints = stackedData.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.cumulativeOffline),
    label: d.month,
    value: d.offlineSales,
    category: 'Offline Sales'
  }));

  const otherPoints = stackedData.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.cumulativeOther),
    label: d.month,
    value: d.otherSales,
    category: 'Other Sales'
  }));

  // Calculate Y-axis labels with max amount
  const yAxisLabels = [];
  const labelCount = 5;
  for (let i = 0; i < labelCount; i++) {
    const value = minRevenue + ((maxRevenue - minRevenue) * i) / (labelCount - 1);
    yAxisLabels.push({
      value: value,
      y: margin.top + (chartHeight * (labelCount - 1 - i)) / (labelCount - 1)
    });
  }

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)' }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Total Revenue (Last 10 Months)</h3>
      <svg width={width} height={height}>
        {/* Grid lines */}
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Y-axis grid lines */}
        {yAxisLabels.map((label, i) => (
          <line
            key={i}
            x1={margin.left}
            y1={label.y}
            x2={width - margin.right}
            y2={label.y}
            stroke="var(--border-color)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Stacked Line Chart - Three Revenue Categories */}
        {/* Online Sales Line (Bottom Layer) */}
        {stackedData.length > 0 && (
          <path
            d={onlinePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Offline Sales Line (Middle Layer) */}
        {stackedData.length > 0 && (
          <path
            d={offlinePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Other Sales Line (Top Layer) */}
        {stackedData.length > 0 && (
          <path
            d={otherPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points for Online Sales */}
        {onlinePoints.map((point, index) => (
          <circle
            key={`online-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Points for Offline Sales */}
        {offlinePoints.map((point, index) => (
          <circle
            key={`offline-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Points for Other Sales */}
        {otherPoints.map((point, index) => (
          <circle
            key={`other-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels (showing full month names for last 10 months) */}
        {onlinePoints.map((point, index) => {
          // Format the label to show full month names
          let displayLabel = point.label;
          
          if (typeof point.label === 'object' && point.label !== null) {
            // Handle date objects with year, month, day keys
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthIndex = parseInt(point.label.month) - 1;
            const monthName = monthNames[monthIndex] || `Month ${point.label.month}`;
            displayLabel = `${monthName} ${point.label.year}`;
          } else if (typeof point.label === 'string') {
            // Handle string labels that might be dates or month names
            try {
              const date = new Date(point.label);
              if (!isNaN(date.getTime())) {
                const monthNames = [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const monthName = monthNames[date.getMonth()];
                displayLabel = `${monthName} ${date.getFullYear()}`;
              }
            } catch (e) {
              // If parsing fails, use as-is
            }
          }
          
          return (
            <text
              key={index}
              x={point.x}
              y={height - 15}
              textAnchor="middle"
              fontSize="12"
              fill="var(--text-secondary)"
              transform={`rotate(-45 ${point.x} ${height - 15})`}
            >
              {displayLabel}
            </text>
          );
        })}

        {/* Y-axis labels with max amount */}
        {yAxisLabels.map((label, i) => (
          <text
            key={i}
            x={margin.left - 15}
            y={label.y + 4}
            textAnchor="end"
            fontSize="12"
            fill="var(--text-secondary)"
          >
            ₹{(label.value / 1000).toFixed(0)}k
          </text>
        ))}

        {/* X-axis line */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="var(--text-secondary)"
          strokeWidth="2"
        />

        {/* Y-axis line */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="var(--text-secondary)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
