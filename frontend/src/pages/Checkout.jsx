import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { generateWhatsAppLink } from '../utils/whatsapp';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        notes: ''
      });
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.price })),
        total_price: cartTotal,
        delivery_address: formData.address,
        notes: formData.notes
      };

      await api.post('/orders', orderPayload);
      
      const whatsappUrl = generateWhatsAppLink(
        { items: cart, total_price: cartTotal },
        formData
      );
      
      clearCart();
      window.open(whatsappUrl, '_blank');
      navigate('/orders');
      toast.success("Order placed successfully!");
      
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">Checkout</h1>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Phone Number (WhatsApp)</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="03XXXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Delivery Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required className="input-field h-24" placeholder="House 1, Street 2, G-6 Islamabad"></textarea>
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Special Instructions (Optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field h-16"></textarea>
          </div>
          
          <div className="bg-lightBg dark:bg-darkBg p-4 rounded mt-6 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay:</span>
              <span className="text-lightBlue dark:text-aqua">Rs {cartTotal}</span>
            </div>
            <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-2">Payment will be handled via WhatsApp directly with the store.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg flex justify-center items-center gap-2 bg-success-light dark:bg-success-dark text-black hover:bg-green-500">
            {loading && <Loader2 className="animate-spin" size={20} />}
            Confirm & Open WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
