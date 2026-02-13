import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Define input style for consistency
const inputStyle = {
  padding: '8px 12px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  height: '36px'
};

export default function CategoryForm({
  onSubmit,
  initialData = {},
  loading = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      ...initialData,
      image: initialData.image?.url || initialData.image || ""
    }
  });

  /* ================================
     RESET FORM ON EDIT CHANGE
  ================================ */
  useEffect(() => {
    reset({
      ...initialData,
      image: initialData.image?.url || initialData.image || ""
    });
  }, [initialData, reset]);
  
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("image", reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  /* ================================
     SUBMIT
  ================================ */
  const handleFormSubmit = (data) => {
    if (!data.image) {
      alert("Category image is required");
      return;
    }

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      image: data.image, // ✅ base64 OR URL
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
      {/* =========================
          NAME FIELD
      ========================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
          Category Name *
        </label>
        <input
          {...register("name", {
            required: "Name is required",
            validate: (v) => v.trim() !== "" || "Name cannot be empty"
          })}
          style={inputStyle}
          placeholder="Enter category name"
        />
        {errors.name && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.name.message}</span>}
      </div>

      {/* =========================
          DESCRIPTION FIELD
      ========================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
          Description
        </label>
        <textarea
          {...register("description")}
          style={{
            ...inputStyle,
            minHeight: '60px',
            resize: 'vertical'
          }}
          placeholder="Enter category description (optional)"
        />
      </div>

      {/* =========================
          IMAGE INPUT FIELD
      ========================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          style={{
            color: "var(--text-primary)",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Category Image *
        </label>

        {/* FILE UPLOAD */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageFileChange}
            style={{
              padding: "6px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "4px",
              color: "var(--text-primary)",
              fontSize: "14px",
              cursor: "pointer",
              height: "36px",
            }}
          />
          <small
            style={{
              color: "var(--text-secondary)",
              fontSize: "11px",
            }}
          >
            Upload JPG or PNG file (recommended)
          </small>
        </div>

        {/* OR DIVIDER */}
        <div
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "12px",
            margin: "8px 0",
            position: "relative",
          }}
        >
          <span
            style={{
              background: "var(--bg-main)",
              padding: "0 8px",
              position: "relative",
              zIndex: 1,
            }}
          >
            OR
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              background: "var(--border-color)",
              zIndex: 0,
            }}
          />
        </div>

        {/* IMAGE URL */}
        <input
          type="text"
          placeholder="https://example.com/category-image.jpg"
          {...register("image", {
            required: "Category image is required",
          })}
          style={inputStyle}
        />
        <small
          style={{
            color: "var(--text-secondary)",
            fontSize: "12px",
          }}
        >
          Alternative: Provide image URL
        </small>
        {errors.image && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.image.message}</span>}
      </div>

      {/* =========================
          ACTION BUTTONS
      ========================= */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginTop: '8px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: loading ? 'var(--bg-secondary)' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            height: '36px'
          }}
        >
          {loading ? "Saving..." : "Save Category"}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            padding: '8px 16px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            height: '36px'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
