import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    defaultValues: initialData
  });

  /* ================================
     RESET FORM ON EDIT MODE CHANGE
  ================================ */
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      reviews: Number(data.reviews)
    });
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
            style={{
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
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
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Enter product description (optional)"
          />
        </div>
      </div>

      {/* =========================
          ROW 2: CATEGORY, STOCK & IMAGE
      ========================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* CATEGORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            style={{
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
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
            style={{
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
            placeholder="0"
          />
          {errors.reviews && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.reviews.message}</span>}
        </div>

        {/* IMAGE INPUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>
            Product Image
          </label>

          {/* File Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              {...register("imageFile")}
              style={{
                padding: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Upload JPG or PNG file (recommended)</small>
          </div>

          {/* OR Separator */}
          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            margin: '8px 0',
            position: 'relative'
          }}>
            <span style={{
              background: 'var(--bg-main)',
              padding: '0 8px',
              position: 'relative',
              zIndex: 1
            }}>OR</span>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'var(--border-color)',
              zIndex: 0
            }}></div>
          </div>

          {/* Image URL */}
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            {...register("image")}
            style={{
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Alternative: Provide image URL</small>
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
          style={{
            padding: '10px 12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '14px'
          }}
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
