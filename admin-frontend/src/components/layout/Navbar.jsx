import { useAdminAuth } from "../../auth/AdminAuthContext";

export default function Navbar() {
  const { logout } = useAdminAuth();

  return (
    <nav className="navbar" aria-label="Admin Navigation">
      <h1>k.venkat</h1>

      <button onClick={logout} className="danger">Logout</button>
    </nav>
  );
}
