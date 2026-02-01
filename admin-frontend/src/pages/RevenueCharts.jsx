import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import { getDashboardData } from "../api/dashboardApi";

import DailyRevenueChart from "../charts/DailyRevenueChart";
import WeeklyRevenueChart from "../charts/WeeklyRevenueChart";
import MonthlyRevenueChart from "../charts/MonthlyRevenueChart";
import HalfYearlyRevenueChart from "../charts/HalfYearlyRevenueChart";

export default function RevenueCharts() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  /* =========================
     ERROR
  ========================= */
  if (error) {
    return (
      <AdminLayout>
        <p style={{ color: "red" }}>{error}</p>
      </AdminLayout>
    );
  }

  if (!dashboard) {
    return (
      <AdminLayout>
        <p>No dashboard data</p>
      </AdminLayout>
    );
  }

  const {
    stats = {},
    dailyRevenue = [],
    weeklyRevenue = [],
    monthlyRevenue = [],
    halfYearlyRevenue = []
  } = dashboard;

  const renderChart = () => {
    switch (selectedPeriod) {
      case "daily":
        return <DailyRevenueChart data={dailyRevenue} />;
      case "weekly":
        return <WeeklyRevenueChart data={weeklyRevenue} />;
      case "monthly":
        return <MonthlyRevenueChart data={monthlyRevenue} />;
      case "half-yearly":
        return <HalfYearlyRevenueChart data={halfYearlyRevenue} />;
      default:
        return <DailyRevenueChart data={dailyRevenue} />;
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Revenue Charts</h2>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* =========================
          PERIOD SELECTOR
      ========================= */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedPeriod("daily")}
          style={{
            padding: '8px 16px',
            background: selectedPeriod === 'daily' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedPeriod === 'daily' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Daily
        </button>
        <button
          onClick={() => setSelectedPeriod("weekly")}
          style={{
            padding: '8px 16px',
            background: selectedPeriod === 'weekly' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedPeriod === 'weekly' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Weekly
        </button>
        <button
          onClick={() => setSelectedPeriod("monthly")}
          style={{
            padding: '8px 16px',
            background: selectedPeriod === 'monthly' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedPeriod === 'monthly' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedPeriod("half-yearly")}
          style={{
            padding: '8px 16px',
            background: selectedPeriod === 'half-yearly' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedPeriod === 'half-yearly' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Half Yearly
        </button>
      </div>

      {/* =========================
          TOTAL REVENUE DETAILS
      ========================= */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Total Revenue: ₹{(stats.totalRevenue ?? 0).toLocaleString('en-IN')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Orders</h4>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{stats.totalOrders ?? 0}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Products</h4>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{stats.totalProducts ?? 0}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Users</h4>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{stats.totalUsers ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Selected Period Chart */}
        <div style={{ marginBottom: '20px' }}>
          {renderChart()}
        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}
      <div className="stats">
        <div>Total Revenue: ₹{(stats.totalRevenue ?? 0).toLocaleString('en-IN')}</div>
        <div>Total Orders: {stats.totalOrders ?? 0}</div>
        <div>Total Products: {stats.totalProducts ?? 0}</div>
        <div>Total Users: {stats.totalUsers ?? 0}</div>
      </div>

      {/* =========================
          PAYMENT METHOD REVENUE
      ========================= */}
      <div className="payment-stats" style={{ marginTop: '20px' }}>
        <h3>Revenue by Payment Method</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Revenue</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {stats.paymentMethods?.map((method, index) => (
              <tr key={index}>
                <td>{method._id}</td>
                <td>₹{method.totalAmount?.toLocaleString('en-IN')}</td>
                <td>{method.orderCount} orders</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}