import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import { getOrderById, updateOrderStatus } from "../api/orderApi";
import { formatDate, formatCurrency } from "../utils/formatDate";

import { ORDER_STATUSES } from "../utils/constants";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  /* ================================
     FETCH ORDER
  ================================ */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* ================================
     HANDLE STATUS SELECTION
  ================================ */
  const handleStatusSelection = (newStatus) => {
    setSelectedStatus(newStatus);
    setHasChanges(newStatus !== order.status);
  };

  /* ================================
     SAVE STATUS CHANGE
  ================================ */
  const handleSaveStatus = async () => {
    if (!order || selectedStatus === order.status) return;

    setUpdating(true);
    try {
      const updated = await updateOrderStatus(id, selectedStatus);
      setOrder(updated);
      setHasChanges(false);
    } catch (error) {
      alert(error.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  /* ================================
     LOADING / EMPTY
  ================================ */
  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p>Order not found</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, marginBottom: '20px', color: 'var(--text-primary)' }}>Order Details</h2>

          {/* Order Information Card */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '10px',
            padding: '24px',
            border: '1px solid var(--border-color)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Order ID
                </label>
                <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '16px', margin: 0 }}>
                  {order._id}
                </p>
              </div>

              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Customer
                </label>
                <p style={{ color: 'var(--text-primary)', fontSize: '16px', margin: 0 }}>
                  {order.user?.name || "Guest User"}
                </p>
              </div>

              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Total Amount
                </label>
                <p style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>

              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Order Date
                </label>
                <p style={{ color: 'var(--text-primary)', fontSize: '16px', margin: 0 }}>
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Order Status
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusSelection(e.target.value)}
                    disabled={updating}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      cursor: updating ? 'not-allowed' : 'pointer',
                      opacity: updating ? 0.5 : 1
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  {hasChanges && (
                    <button
                      onClick={handleSaveStatus}
                      disabled={updating}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {updating ? 'Saving...' : 'Save Status'}
                    </button>
                  )}

                  {updating && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      Updating...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Order Items</h3>

            <div style={{ background: 'var(--bg-card)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#020617' }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Product Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>Quantity</th>
                    <th style={{ padding: '15px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>Unit Price</th>
                    <th style={{ padding: '15px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.product?._id || index} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '15px', textAlign: 'left', color: 'var(--text-primary)' }}>
                        {item.product?.name || "Deleted product"}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'left', color: 'var(--text-primary)' }}>
                        {item.product?.category}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', color: 'var(--text-primary)' }}>
                        {formatCurrency(item.price)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', color: 'var(--text-primary)', fontWeight: '600' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-secondary)', borderTop: '2px solid var(--border-color)' }}>
                    <td colSpan="3" style={{ padding: '15px', textAlign: 'right', color: 'var(--text-primary)', fontWeight: '600' }}>
                      Order Total:
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', color: 'var(--text-primary)', fontWeight: '700', fontSize: '18px' }}>
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
