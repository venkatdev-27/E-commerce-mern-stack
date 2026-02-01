import { useEffect, useState } from "react";
import { getDashboardData } from "../../api/dashboardApi";

export default function PaymentMethodRevenue() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardData();
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message || "Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading payment data...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', flexShrink: 0 }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', textAlign: 'center', width: '100%', color: 'var(--text-primary)' }}>Payment Methods</h3>
      <div className="payment-stats">
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
    </div>
  );
}