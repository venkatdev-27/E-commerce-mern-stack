import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDashboardData } from '../../api/dashboardApi';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State kept in case you need to re-enable chart logic later
  const [paymentData, setPaymentData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setPaymentData(data.stats?.paymentMethods || []);
        setOrderStatusData(data.orderStatusStats || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- REUSABLE BUTTON COMPONENT ---
  // This ensures every button looks exactly the same and responds to active states
  const NavButton = ({ path, label }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        style={{
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          width: '100%',
          padding: '12px 20px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          background: isActive ? 'var(--accent)' : 'var(--bg-primary)',
          color: isActive ? 'white' : 'var(--text-primary)',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0 // Prevents buttons from squishing
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="sidebar" style={{ 
      height: '100vh', 
      background: 'var(--bg-secondary)',
      minWidth: '230px',
      maxWidth: '300px',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 1. Header (Fixed at top) */}
      <div className="sidebar-header" style={{ padding: '20px', flexShrink: 0 }}>
        <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>LuxeMarket Admin</h2>
      </div>

      {/* 2. Unified Scrollable Container for ALL buttons */}
      <div className="sidebar-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',            // <--- EXACT SAME GAP FOR EVERYTHING
        padding: '0 20px 20px', // Padding around the buttons
        overflowY: 'auto'       // Allows scrolling if list gets too long
      }}>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          style={{
            width: 'fit-content',
            padding: '6px 12px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: '500',
            marginBottom: '5px' // Slight extra space after back button
          }}
        >
          ← Back
        </button>

        {/* Standard Navigation */}
        <NavButton path="/" label="Dashboard" />
        <NavButton path="/products" label="Products" />
        <NavButton path="/categories" label="Categories" />
        <NavButton path="/orders" label="Orders" />
        <NavButton path="/support-messages" label="Support Messages" />

        {/* Divider (Optional: Remove if you want absolutely no separation) */}
        <hr style={{ width: '100%', border: '0', borderTop: '1px solid var(--border-color)', margin: '5px 0' }} />

        {/* Charts Navigation */}
        <NavButton path="/dashboard/revenue" label="Revenue Charts" />
       
        <NavButton path="/dashboard/users" label="Users" />
        <NavButton path="/dashboard/pie-charts" label="Pie Charts" />

      </div>
    </div>
  );
}