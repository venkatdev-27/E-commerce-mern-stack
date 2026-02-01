import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import { getOrders, updateOrderStatus } from "../api/orderApi";
import { formatCurrency } from "../utils/formatDate";


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toast, setToast] = useState(null);

  /* ================================
     FETCH ORDERS
  ================================ */
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await getOrders({ page, limit: 10 });
      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  /* ================================
     TOAST NOTIFICATION
  ================================ */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================================
     LOADING
  ================================ */
  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  /* ================================
     ERROR
  ================================ */
  if (error) {
    return (
      <AdminLayout>
        <p style={{ color: "red" }}>{error}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Orders Management</h2>
        </div>

        {orders.length === 0 ? (
          <EmptyState message="No orders found. Orders will appear here when customers make purchases." />
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#020617' }}>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', width: '60px' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '15px', color: 'var(--text-primary)', textAlign: 'center', fontWeight: '600' }}>
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '14px' }}>
                      {order._id.substring(0, 8)}...
                    </td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{order.user?.name || "Guest User"}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>{formatCurrency(order.totalAmount)}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: order.status.toLowerCase() === 'pending' ? '#fbbf24' :
                                       order.status.toLowerCase() === 'confirmed' ? '#3b82f6' :
                                       order.status.toLowerCase() === 'shipped' ? '#8b5cf6' :
                                       order.status.toLowerCase() === 'delivered' ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setSidebarOpen(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Order Details Sidebar */}
        {sidebarOpen && selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            background: 'var(--bg-main)',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflowY: 'auto'
          }}>
            {/* Sidebar Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Order Details
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Sidebar Content */}
            <div style={{ padding: '20px' }}>
              {/* Order Info */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Order Information
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Order ID:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'monospace' }}>
                        {selectedOrder._id}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Order Date:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Customer Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Name:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                        {selectedOrder.user?.name || "Guest User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Order Status
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Current Status:</span>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: selectedOrder.status.toLowerCase() === 'pending' ? '#fbbf24' :
                                       selectedOrder.status.toLowerCase() === 'confirmed' ? '#3b82f6' :
                                       selectedOrder.status.toLowerCase() === 'shipped' ? '#8b5cf6' :
                                       selectedOrder.status.toLowerCase() === 'delivered' ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>
                        Update Status:
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                          }}
                          disabled={updatingStatus}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            cursor: updatingStatus ? 'not-allowed' : 'pointer',
                            opacity: updatingStatus ? 0.6 : 1,
                            flex: 1
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={async () => {
                            setUpdatingStatus(true);
                            try {
                              await updateOrderStatus(selectedOrder._id, selectedOrder.status);
                              // Refresh the orders list to show the updated status
                              fetchOrders(currentPage);
                              setSidebarOpen(false); // Close sidebar after successful save
                              showToast('Order status updated successfully!', 'success');
                            } catch (error) {
                              showToast('Failed to update order status: ' + error.message, 'error');
                            } finally {
                              setUpdatingStatus(false);
                            }
                          }}
                          disabled={updatingStatus}
                          style={{
                            padding: '8px 16px',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: updatingStatus ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: updatingStatus ? 0.6 : 1
                          }}
                        >
                          {updatingStatus ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                      {updatingStatus && (
                        <span style={{ color: 'var(--accent)', fontSize: '12px' }}>
                          Updating status...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Order Summary
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Items:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                        {selectedOrder.items?.length || 0} items
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Shipping Address
                  </h4>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordWrap: 'break-word'
                  }}>
                    {selectedOrder.shippingAddress ? (
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {selectedOrder.shippingAddress.name}
                        </div>
                        <div>
                          {selectedOrder.shippingAddress.address}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          Phone: {selectedOrder.shippingAddress.phone}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>No address provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Order Total
                  </h4>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    textAlign: 'center',
                    padding: '8px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px'
                  }}>
                    {formatCurrency(selectedOrder.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* Overlay for sidebar */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 2000,
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '300px',
              wordWrap: 'break-word'
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
