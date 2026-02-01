import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const wrapperStyle = {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#374151"
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "12px"
  };

  const textStyle = {
    fontSize: "16px",
    marginBottom: "20px"
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  return (
    <div style={wrapperStyle} role="alert">
      <h2 style={titleStyle}>404</h2>
      <p style={textStyle}>Page not found</p>

      <button style={buttonStyle} onClick={() => navigate("/")}>
        Go to Dashboard
      </button>
    </div>
  );
}
