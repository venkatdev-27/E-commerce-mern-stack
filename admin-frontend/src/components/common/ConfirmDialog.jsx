export default function ConfirmDialog({
  isOpen,
  message = "Are you sure?",
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true">
      <div className="confirm-dialog">
        <h3>Confirm Action</h3>
        <p>{message}</p>

        <div className="dialog-actions">
          <button onClick={onCancel} style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="danger"
          >
            {loading ? "Please wait..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
