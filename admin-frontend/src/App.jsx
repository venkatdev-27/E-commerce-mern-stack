import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./auth/AdminAuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import SupportMessages from "./pages/SupportMessages";
import NotFound from "./pages/NotFound";

// Dashboard sub-pages
import RevenueCharts from "./pages/RevenueCharts";

import Users from "./pages/Users";
import PieCharts from "./pages/PieCharts";

function App() {
  return (
    <div className="admin-theme">
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard sub-pages */}
            <Route
              path="/dashboard/revenue"
              element={
                <ProtectedRoute>
                  <RevenueCharts />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/pie-charts"
              element={
                <ProtectedRoute>
                  <PieCharts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={(
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              )}
            />

            <Route
              path="/support-messages"
              element={(
                <ProtectedRoute>
                  <SupportMessages />
                </ProtectedRoute>
              )}
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
