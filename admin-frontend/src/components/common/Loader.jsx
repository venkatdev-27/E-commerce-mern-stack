export default function Loader({ size = 32, text = "Loading..." }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div
        style={{
          width: size,
          height: size,
          border: `4px solid var(--border-color)`,
          borderTop: `4px solid var(--accent)`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}
      />
      <span style={{ marginTop: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
        {text}
      </span>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
