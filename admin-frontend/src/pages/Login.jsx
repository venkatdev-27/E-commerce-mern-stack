import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAdminAuth } from "../auth/AdminAuthContext";
import { loginAdmin } from "../api/authApi";

export default function Login() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin(data);
      login(response.token);   // save token in context
      navigate("/");           // redirect to dashboard
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-theme">
      <div className="login">
        <form onSubmit={handleSubmit(onSubmit)} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{
              margin: '0 0 10px 0',
              color: '#f0f0f0',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Admin Login
            </h2>
            <p style={{
              margin: 0,
              color: '#f5f7fb',
              fontSize: '14px'
            }}>
              Sign in to access the admin panel
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: '#d2d6dc',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#111827',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <span style={{
                color: '#dc2626',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: '#cccfd4',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#111827',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={{
                color: '#dc2626',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 20px',
              backgroundColor: loading ? '#9ca3af' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              width: '100%',
              marginTop: '10px'
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
