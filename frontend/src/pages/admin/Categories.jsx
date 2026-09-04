import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image_url: category.image_url || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image_url: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");

    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast.success('Category added successfully');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect products linked to it.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={32} /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-lightBorder dark:border-darkBorder pb-4">
        <h1 className="text-2xl font-bold text-lightText dark:text-darkText">Manage Categories</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-lightCard dark:bg-darkCard rounded-lg border border-lightBorder dark:border-darkBorder overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lightBorder/50 dark:bg-darkBorder/50 text-lightTextSecondary dark:text-darkTextSecondary">
                <th className="p-4 font-medium border-b border-lightBorder dark:border-darkBorder w-20">Image</th>
                <th className="p-4 font-medium border-b border-lightBorder dark:border-darkBorder">Name</th>
                <th className="p-4 font-medium border-b border-lightBorder dark:border-darkBorder hidden md:table-cell">Description</th>
                <th className="p-4 font-medium border-b border-lightBorder dark:border-darkBorder text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-b border-lightBorder dark:border-darkBorder hover:bg-lightBorder/20 dark:hover:bg-darkBorder/20 transition-colors">
                  <td className="p-4">
                    {category.image_url ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-[#333]">
                        <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-lightText dark:text-darkText">{category.name}</td>
                  <td className="p-4 text-lightTextSecondary dark:text-darkTextSecondary hidden md:table-cell truncate max-w-xs">{category.description || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openModal(category)} className="text-lightBlue dark:text-aqua hover:opacity-80 transition-opacity">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="text-error-light dark:text-error-dark hover:opacity-80 transition-opacity">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-lightTextSecondary dark:text-darkTextSecondary">No categories found. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-lightCard dark:bg-darkCard rounded-lg shadow-xl w-full max-w-md border border-lightBorder dark:border-darkBorder overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-lightBorder dark:border-darkBorder bg-lightBorder/20 dark:bg-darkBorder/20">
              <h3 className="font-bold text-lg text-lightText dark:text-darkText">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={closeModal} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-error-light dark:hover:text-error-dark">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-lightTextSecondary dark:text-darkTextSecondary">Category Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Pulses"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-lightTextSecondary dark:text-darkTextSecondary">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[80px]"
                  placeholder="Optional description..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-lightTextSecondary dark:text-darkTextSecondary">Image URL</label>
                <input 
                  type="text" 
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="/images/categories/name.jpg or https://..."
                />
                <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-1">
                  Upload an image to /backend/public/images/categories/ and link it here, or use a remote URL.
                </p>
                {formData.image_url && (
                  <div className="mt-3 w-32 h-24 border border-lightBorder dark:border-darkBorder rounded overflow-hidden bg-white dark:bg-[#1a1a1a]">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src='https://placehold.co/320x240?text=Error'} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-lightBorder dark:border-darkBorder">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded font-medium text-lightText dark:text-darkText hover:bg-lightBorder dark:hover:bg-darkBorder transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 min-w-[100px] justify-center">
                  {saving ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
