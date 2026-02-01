import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";

const AdminAuthContext = createContext({
  admin: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================================
     LOAD ADMIN FROM STORAGE
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdmin({ token });
    }
    setLoading(false);
  }, []);

  /* ================================
     LOGIN
  ================================ */
  const login = useCallback((token) => {
    localStorage.setItem("adminToken", token);
    setAdmin({ token });
  }, []);

  /* ================================
     LOGOUT
  ================================ */
  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, setAdmin, login, logout, loading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
