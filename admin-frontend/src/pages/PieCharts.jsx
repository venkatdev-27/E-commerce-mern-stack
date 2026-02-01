import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import { getDashboardData } from "../api/dashboardApi";
import SinglePieChart from "../charts/SinglePieChart";

export default function PieCharts() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChart, setSelectedChart] = useState("payment-method");

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
    orderStatusStats = []
  } = dashboard;

  // Transform data for SinglePieChart component
  const getChartData = () => {
    if (selectedChart === "payment-method") {
      return stats.paymentMethods?.map(method => ({
        name: method._id === "COD" ? "Cash on Delivery" : 
              method._id === "CARD" ? "Card Payment" :
              method._id === "UPI" ? "UPI Payment" : method._id,
        value: method.totalAmount,
        orders: method.orderCount
      })) || [];
    } else {
      return orderStatusStats.map(status => ({
        name: status._id,
        value: status.count
      }));
    }
  };

  const getChartTitle = () => {
    return selectedChart === "payment-method" 
      ? "Payment Method Distribution" 
      : "Order Status Distribution";
  };

  const getValueFormatter = () => {
    return selectedChart === "payment-method" 
      ? (value) => `₹${value.toLocaleString('en-IN')}`
      : (value) => value.toString();
  };

  const getLabelFormatter = () => {
    return selectedChart === "payment-method"
      ? (label) => label
      : (label) => label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Analytics Dashboard</h2>
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
          CHART SELECTOR
      ========================= */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setSelectedChart("payment-method")}
          style={{
            padding: '10px 20px',
            background: selectedChart === 'payment-method' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedChart === 'payment-method' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: selectedChart === 'payment-method' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Payment Methods
        </button>
        <button
          onClick={() => setSelectedChart("order-status")}
          style={{
            padding: '10px 20px',
            background: selectedChart === 'order-status' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: selectedChart === 'order-status' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: selectedChart === 'order-status' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          Order Status
        </button>
      </div>

      {/* =========================
          SINGLE MAIN CHART
      ========================= */}
      <div style={{ marginBottom: '30px' }}>
        <SinglePieChart
          data={getChartData()}
          title={getChartTitle()}
          dataKey="value"
          labelKey="name"
          valueFormatter={getValueFormatter()}
          labelFormatter={getLabelFormatter()}
        />
      </div>

      {/* =========================
          DETAILED STATS
      ========================= */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--text-primary)' }}>Key Metrics</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Total Revenue</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              ₹{(stats.totalRevenue ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Total Orders</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.totalOrders ?? 0}
            </div>
          </div>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Total Products</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.totalProducts ?? 0}
            </div>
          </div>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Total Users</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.totalUsers ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          PAYMENT METHOD DETAILS
      ========================= */}
      {selectedChart === "payment-method" && stats.paymentMethods && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--text-primary)' }}>Payment Method Details</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {stats.paymentMethods.map((method, index) => (
              <div key={index} style={{
                background: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {method._id === "COD" ? "Cash on Delivery" : 
                     method._id === "CARD" ? "Card Payment" :
                     method._id === "UPI" ? "UPI Payment" : method._id}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {method.orderCount} orders
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>
                  ₹{method.totalAmount?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}