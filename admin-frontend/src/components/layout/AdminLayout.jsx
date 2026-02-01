import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar-wrapper" aria-label="Admin Sidebar">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <Navbar />
        </header>

        <main className="content">
          <div className="content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
