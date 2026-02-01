import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import { getDashboardData } from "../api/dashboardApi";
import { getUsers } from "../api/userApi";

import TotalRevenueLineChart from "../charts/TotalRevenueLineChart";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardData, usersData] = await Promise.all([
        getDashboardData(),
        getUsers()
      ]);
      setDashboard(dashboardData);
      setUsers(usersData);
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
    halfYearlyRevenue = [],
    orderStatusStats = [],
    topProducts = []
  } = dashboard;

  // Get last purchase from users data
  const lastPurchase = users.length > 0 
    ? users[0].lastPurchaseDate 
    : null;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
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
          STATS
      ========================= */}
      <div className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Revenue</h4>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            ₹{(stats.totalRevenue ?? 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Orders</h4>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {stats.totalOrders ?? 0}
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Products</h4>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {stats.totalProducts ?? 0}
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total Users</h4>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {stats.totalUsers ?? 0}
          </p>
        </div>
      </div>

      {/* =========================
          LAST PURCHASE FROM ORDERS MANAGEMENT
      ========================= */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Last Purchase from Orders Management</h3>
        <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {lastPurchase ? (
            <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>
              Last purchase: {new Date(lastPurchase).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
              No purchases recorded
            </p>
          )}
        </div>
      </div>

      {/* =========================
          TOTAL REVENUE LINE CHART
      ========================= */}
      <div style={{ marginBottom: '20px' }}>
        <TotalRevenueLineChart monthlyRevenue={monthlyRevenue} />
      </div>

    </AdminLayout>
  );
}
