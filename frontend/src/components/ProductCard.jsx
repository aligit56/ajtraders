import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card hover:shadow-lg transition-transform hover:scale-[1.02] flex flex-col h-full overflow-hidden">
      <Link to={`/product/${product.id}`} className="block relative h-48 bg-lightBg dark:bg-darkBg">
        {/* Placeholder for real images */}
        <div className="w-full h-full flex items-center justify-center text-lightTextSecondary dark:text-darkTextSecondary">
           {product.image_url ? (
               <img src={product.image_url} alt={product.name} className="object-cover h-full w-full" />
           ) : (
               <span>No Image</span>
           )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-darkBlue dark:hover:text-cyan line-clamp-2">{product.name}</h3>
        </Link>
        <div className="text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-3 flex-grow">
          {product.stock > 0 ? (
             <span className="text-success-light dark:text-success-dark text-xs">In Stock ({product.stock})</span>
          ) : (
             <span className="text-error-light dark:text-error-dark text-xs">Out of Stock</span>
          )}
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-lightBlue dark:text-aqua">Rs {product.price}</span>
          <button 
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="bg-darkBlue dark:bg-cyan text-black p-2 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
