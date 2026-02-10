import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ProductForm from "../components/forms/ProductForm";
import { getProducts, deleteProduct, createProduct, updateProduct } from "../api/productApi";
import { getCategories } from "../api/categoryApi";

// Create a map for category names


// Products Management Page
export default function Products() {
  const [products, setProducts] = useState([]);

  // ✅ Helper to fix Image URLs

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    page: 1
  });

  /* ================================
     FETCH PRODUCTS
  ================================ */
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts({ page, limit: 10 });
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  /* ================================
     SET CATEGORIES
  ================================ */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  /* ================================
     DELETE PRODUCT
  ================================ */
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteProduct(id);

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchProducts(currentPage);
      }
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  /* ================================
     ADD / EDIT
  ================================ */
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  /* ================================
     FORM SUBMIT (MULTER)
  ================================ */
  const handleFormSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchProducts(currentPage);
    } catch (err) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     HANDLE FORM CANCEL
  ================================ */
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  /* ================================
     LOADING STATE
  ================================ */
  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  /* ================================
     ERROR STATE
  ================================ */
  if (error) {
    return (
      <AdminLayout>
        <p style={{ color: "red" }}>{error}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Products Management</h2>
          <button onClick={handleAddProduct} style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Add New Product
          </button>
        </div>



        {showForm && (
          <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <ProductForm
              onSubmit={handleFormSubmit}
              initialData={editingProduct || {}}
              categories={categories}
              loading={saving}
            />
            <button
              onClick={handleFormCancel}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <EmptyState message="No products found. Create your first product to get started." />
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: '600px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minHeight: '580px' }}>
              <thead>
                <tr style={{ background: '#020617' }}>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', width: '60px' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Image</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Price</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Reviews</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    {console.log("Rendering Product:", product.name, "Image:", product.image?.url)}
                    <td style={{ padding: '15px', color: 'var(--text-primary)', textAlign: 'center', fontWeight: '600' }}>
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>
                      {product.image?.url ? (
                        <img
                          src={product.image.url}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{product.name}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{product.category?.name || product.category || 'N/A'}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>₹{product.price}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{product.reviews}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          padding: '6px 12px',
                          marginRight: '8px',
                          background: 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(product._id)}
                        className="danger"
                        disabled={deleting}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: deleting ? 'not-allowed' : 'pointer',
                          opacity: deleting ? 0.5 : 1
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
