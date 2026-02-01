export default function EmptyState({
  message = "No data available",
  icon = "📭"
}) {
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    color: "#6b7280",
    textAlign: "center"
  };

  const iconStyle = {
    fontSize: "32px",
    marginBottom: "12px"
  };

  const textStyle = {
    fontSize: "14px"
  };

  return (
    <div
      style={wrapperStyle}
      role="status"
      aria-live="polite"
    >
      <div style={iconStyle}>{icon}</div>
      <p style={textStyle}>{message}</p>
    </div>
  );
}
