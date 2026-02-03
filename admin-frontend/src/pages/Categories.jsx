import { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import CategoryForm from '../components/forms/CategoryForm';
import { getCategories, deleteCategory, createCategory, updateCategory } from '../api/categoryApi';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  // ✅ Helper to fix Image URLs
  const getImageUrl = (image) => {
    if (!image) return "";

    // 1. Check for Base64 Data URI (Return as is)
    if (image.startsWith("data:")) {
      return image;
    }

    // 2. Fix Windows Backslashes
    let finalImage = image.replace(/\\/g, "/");

    if (finalImage.startsWith("http://localhost:5174")) {
      finalImage = finalImage.replace("5174", "5000"); // Fix bad data
    }
    if (finalImage.startsWith("http")) {
      return finalImage; // Already valid absolute URL
    }
    // Ensure leading slash for relative paths
    if (!finalImage.startsWith("/")) {
      finalImage = "/" + finalImage;
    }
    return `\${import.meta.env.VITE_ADMIN_API_BASE_URL || "https://e-commerce-mern-stack-i66g.onrender.com"}\${finalImage}`; // Prepend backend URL
  };
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================================
     DELETE CATEGORY
  ================================ */
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      alert("Delete failed");
    } finally {
      setConfirmDelete(null);
    }
  };

  /* ================================
     ADD / EDIT
  ================================ */
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  /* ================================
     FORM SUBMIT (MULTER)
  ================================ */
  const handleFormSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Categories Management</h2>
          <button onClick={handleAddCategory} style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Add New Category
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <CategoryForm
              onSubmit={handleFormSubmit}
              initialData={editingCategory || {}}
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

        {categories.length === 0 ? (
          <EmptyState message="No categories found. Create your first category to get started." />
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#020617' }}>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', width: '60px' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Description</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Image</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id} style={{ borderTop: '1px solid var(--border-color)' }}>

                    <td style={{ padding: '15px', color: 'var(--text-primary)', textAlign: 'center', fontWeight: '600' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{category.name}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{category.description || '-'}</td>
                    <td style={{ padding: '15px', color: 'var(--text-primary)' }}>
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEditCategory(category)}
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
                        onClick={() => setConfirmDelete(category._id)}
                        className="danger"
                        style={{
                          padding: '6px 12px',
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
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
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminLayout>
  );
}
