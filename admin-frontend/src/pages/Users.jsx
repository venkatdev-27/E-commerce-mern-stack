import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import { getUsers, formatDate, isActiveInLast7Days, getStatusBadgeClass, getStatusBadgeText } from "../api/userApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch users data from the dedicated user API
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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


  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button
          onClick={fetchData}
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
          USERS TABLE
      ========================= */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Users Table</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email</th>
                <th style={{ textAlign: 'center', padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Last Purchase</th>
                <th style={{ textAlign: 'center', padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>Orders (10 Days)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      {user.name}
                    </td>
                    <td style={{ padding: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '10px', fontSize: '14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: user.isActive ? '#dcfce7' : '#fee2e2',
                        color: user.isActive ? '#166534' : '#991b1b'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                      {user.lastPurchaseDate ? formatDate(user.lastPurchaseDate) : 'No purchases'}
                    </td>
                    <td style={{ padding: '10px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      {user.isActive ? (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: '#dcfce7',
                          color: '#166534',
                          fontWeight: '500',
                          fontSize: '12px'
                        }}>
                          {user.totalOrders || 0}
                        </span>
                      ) : (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: '#fee2e2',
                          color: '#991b1b',
                          fontWeight: '500',
                          fontSize: '12px'
                        }}>
                          {user.totalOrders || 0}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}