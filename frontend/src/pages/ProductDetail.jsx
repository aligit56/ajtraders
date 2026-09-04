import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const handleAdd = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} to cart!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-lightTextSecondary dark:text-darkTextSecondary hover:text-darkBlue dark:hover:text-cyan mb-6">
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <div className="card p-6 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 h-64 md:h-96 bg-lightBg dark:bg-darkBg rounded-lg flex items-center justify-center">
          {product.image_url ? (
               <img src={product.image_url} alt={product.name} className="object-cover h-full w-full rounded-lg" />
           ) : (
               <span className="text-lightTextSecondary dark:text-darkTextSecondary">No Image</span>
           )}
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-lightText dark:text-darkText mb-2">{product.name}</h1>
          <p className="text-lightBlue dark:text-aqua text-2xl font-bold mb-4">Rs {product.price}</p>
          
          <div className="mb-6">
            {product.stock > 0 ? (
               <span className="inline-block bg-success-light dark:bg-success-dark/20 text-success-light dark:text-success-dark px-3 py-1 rounded-full text-sm font-semibold">
                 In Stock ({product.stock} available)
               </span>
            ) : (
               <span className="inline-block bg-error-light dark:bg-error-dark/20 text-error-light dark:text-error-dark px-3 py-1 rounded-full text-sm font-semibold">
                 Out of Stock
               </span>
            )}
          </div>

          <div className="text-lightTextSecondary dark:text-darkTextSecondary mb-8 flex-grow">
            <h4 className="text-sm text-lightTextSecondary dark:text-darkTextSecondary uppercase tracking-wider mb-2">Description</h4>
            <p>{product.description || 'No description available.'}</p>
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center bg-lightBg dark:bg-darkBg rounded border border-lightBorder dark:border-darkBorder">
              <button 
                className="px-4 py-2 hover:bg-lightBorder dark:hover:bg-darkBorder disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >-</button>
              <span className="px-4 py-2 font-bold">{quantity}</span>
              <button 
                className="px-4 py-2 hover:bg-lightBorder dark:hover:bg-darkBorder disabled:opacity-50"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >+</button>
            </div>
            <button 
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="btn-primary flex-grow flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
