import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', category_id: 1, price: '', stock: '', description: '', image_url: '' });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        await api.put(`/products/${currentProduct.id}`, currentProduct);
        toast.success('Product updated');
      } else {
        await api.post('/products', currentProduct);
        toast.success('Product added');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const openModal = (product = { name: '', category_id: 1, price: '', stock: '', description: '', image_url: '' }) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex justify-center"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-lightText dark:text-darkText">Product Management</h2>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus size={18}/> Add Product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-lightBg dark:bg-darkBg border-b border-lightBorder dark:border-darkBorder">
              <th className="p-4 text-darkBlue dark:text-cyan">Name</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Price (Rs)</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Stock</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-lightBorder dark:border-darkBorder hover:bg-lightBg dark:bg-darkBg transition-colors">
                <td className="p-4">{p.name}</td>
                <td className="p-4 font-bold text-lightBlue dark:text-aqua">{p.price}</td>
                <td className="p-4">
                  <span className={p.stock < 5 ? "text-error-light dark:text-error-dark font-bold" : "text-success-light dark:text-success-dark"}>{p.stock}</span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openModal(p)} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-darkBlue dark:hover:text-cyan"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-error-light dark:hover:text-error-dark"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{currentProduct.id ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm mb-1">Name</label><input type="text" value={currentProduct.name} onChange={e=>setCurrentProduct({...currentProduct, name: e.target.value})} className="input-field" required /></div>
              <div className="flex gap-4">
                <div className="flex-1"><label className="block text-sm mb-1">Price (Rs)</label><input type="number" value={currentProduct.price} onChange={e=>setCurrentProduct({...currentProduct, price: e.target.value})} className="input-field" required /></div>
                <div className="flex-1"><label className="block text-sm mb-1">Stock</label><input type="number" value={currentProduct.stock} onChange={e=>setCurrentProduct({...currentProduct, stock: e.target.value})} className="input-field" required /></div>
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select value={currentProduct.category_id} onChange={e=>setCurrentProduct({...currentProduct, category_id: e.target.value})} className="input-field">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm mb-1">Image URL (Optional)</label><input type="text" value={currentProduct.image_url} onChange={e=>setCurrentProduct({...currentProduct, image_url: e.target.value})} className="input-field" /></div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-lightBorder dark:hover:bg-darkBorder rounded">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
