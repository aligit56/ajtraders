import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-lightText dark:text-darkText mb-2">Your cart is empty</h2>
        <p className="text-lightTextSecondary dark:text-darkTextSecondary mb-6">Add items from categories to get started.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">Shopping Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 space-y-4">
          {cart.map(item => (
            <div key={item.product_id} className="card p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 bg-lightBg dark:bg-darkBg rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="object-cover" /> : <span className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Img</span>}
              </div>
              <div className="flex-grow">
                <Link to={`/product/${item.product_id}`} className="font-semibold text-lg hover:text-darkBlue dark:hover:text-cyan">{item.name}</Link>
                <div className="text-lightBlue dark:text-aqua font-bold">Rs {item.price}</div>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center bg-lightBg dark:bg-darkBg rounded border border-lightBorder dark:border-darkBorder">
                  <button className="px-3 py-1 hover:bg-lightBorder dark:hover:bg-darkBorder" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                  <span className="px-3 py-1 font-bold">{item.quantity}</span>
                  <button className="px-3 py-1 hover:bg-lightBorder dark:hover:bg-darkBorder" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.product_id)} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-error-light dark:hover:text-error-dark p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3">
          <div className="card p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 border-b border-lightBorder dark:border-darkBorder pb-2">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-lightTextSecondary dark:text-darkTextSecondary">Subtotal</span>
              <span>Rs {cartTotal}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-lightTextSecondary dark:text-darkTextSecondary">Delivery</span>
              <span>Calculated on WhatsApp</span>
            </div>
            <div className="flex justify-between items-center border-t border-lightBorder dark:border-darkBorder pt-4 mb-6">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-lightBlue dark:text-aqua">Rs {cartTotal}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
