import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Define input style for consistency
const inputStyle = {
  padding: '10px 12px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontSize: '14px'
};

export default function ProductForm({
  onSubmit,
  initialData = {},
  categories = [],
  loading = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      ...initialData,
      category: initialData.category?._id || initialData.category || "", // ✅ Extract ID if object
      image: initialData.image?.url || initialData.image || "" // ✅ Handle both object and string cases
    }
  });

  /* ================================
     RESET FORM ON EDIT MODE CHANGE
  ================================ */
  useEffect(() => {
    reset({
      ...initialData,
      category: initialData.category?._id || initialData.category || "",
      image: initialData.image?.url || initialData.image || ""
    });
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    if (!data.image || !data.image.trim()) {
      alert("Product image is required");
      return;
    }

    // ✅ VALIDATION: Image is required
    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      category: data.category,
      price: Number(data.price),
      reviews: Number(data.reviews || 0),
      image: data.image.trim() // ✅ Cloudinary input
    };

    onSubmit(payload);
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =========================
          ROW 1: NAME & DESCRIPTION
      ========================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* NAME */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Product Name *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            style={inputStyle}
            placeholder="Enter product name"
          />
          {errors.name && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.name.message}</span>}
        </div>

        {/* DESCRIPTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Description
          </label>
          <textarea
            {...register("description")}
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Enter product description (optional)"
          />
        </div>
      </div>

      {/* =========================
          ROW 2: CATEGORY, REVIEWS & IMAGE
      ========================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* CATEGORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            style={inputStyle}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.category.message}</span>}
        </div>

        {/* REVIEWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Reviews
          </label>
          <input
            type="number"
            {...register("reviews", {
              min: { value: 0, message: "Reviews cannot be negative" }
            })}
            style={inputStyle}
            placeholder="0"
          />
          {errors.reviews && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.reviews.message}</span>}
        </div>

        {/* IMAGE INPUT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Product Image *
          </label>
          <input
            {...register("image", { required: "Product image is required" })}
            placeholder="Paste image URL or base64"
            style={inputStyle}
          />
          <small style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            Cloudinary supports URL or base64 (data:image/...)
          </small>
          {errors.image && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.image.message}</span>}
        </div>
      </div>

      {/* =========================
          ROW 3: PRICE
      ========================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
          Price *
        </label>
        <input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price cannot be negative" }
          })}
          style={inputStyle}
          placeholder="Enter product price"
        />
        {errors.price && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.price.message}</span>}
      </div>

      {/* =========================
          ROW 4: SAVE & CANCEL BUTTONS
      ========================= */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginTop: '8px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: loading ? 'var(--bg-secondary)' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
