import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getUsers, getUserStats, formatDate, isActiveInLast7Days, getStatusBadgeClass, getStatusBadgeText } from '../api/userApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastPurchaseDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const usersData = await getUsers();
      const statsData = await getUserStats();
      
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Date comparison
    if (sortBy === 'lastPurchaseDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // String comparison
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

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
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: 'red' }}>Error</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        {/* =========================
            HEADER & STATS
        ========================= */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Users Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Total users: {users.length}</p>
          </div>
          <button 
            onClick={fetchUsers}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {/* =========================
            STATISTICS SUMMARY
        ========================= */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6' 
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6c757d' }}>Total Users</h4>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6' 
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6c757d' }}>Users with Orders</h4>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{stats.usersWithOrders}</p>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6' 
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6c757d' }}>Active (Last 7 Days)</h4>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>{stats.activeInLast7Days}</p>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #dee2e6' 
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6c757d' }}>Conversion Rate</h4>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{stats.conversionRate?.toFixed(1) || 0}%</p>
            </div>
          </div>
        )}

        {/* =========================
            SEARCH & FILTER
        ========================= */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* =========================
            USERS TABLE
        ========================= */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <button onClick={() => handleSort('name')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Name {getSortIcon('name')}
                    </button>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <button onClick={() => handleSort('email')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Email {getSortIcon('email')}
                    </button>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active in Last 7 Days
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <button onClick={() => handleSort('lastPurchaseDate')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Last Purchase {getSortIcon('lastPurchaseDate')}
                    </button>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
                      No users found{searchTerm ? ` for "${searchTerm}"` : ''}
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#495057' }}>
                        {user.name}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6c757d' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: user.isActive ? '#d4edda' : '#f8d7da',
                          color: user.isActive ? '#155724' : '#721c24'
                        }}>
                          {getStatusBadgeText(user.isActive, isActiveInLast7Days(user.lastPurchaseDate))}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: isActiveInLast7Days(user.lastPurchaseDate) ? '#d1ecf1' : '#f8d7da',
                          color: isActiveInLast7Days(user.lastPurchaseDate) ? '#0c5460' : '#721c24'
                        }}>
                          {isActiveInLast7Days(user.lastPurchaseDate) ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#495057' }}>
                        {formatDate(user.lastPurchaseDate)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: '#495057', fontWeight: '500' }}>
                        {user.totalOrders || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}
        {users.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6c757d',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>No users found</h3>
            <p style={{ margin: 0 }}>Start by creating some users or check back later.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}