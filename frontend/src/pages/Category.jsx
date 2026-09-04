import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const Category = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?category=${id}`),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        const cat = catRes.data.find(c => c.id === parseInt(id));
        if (cat) setCategory(cat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  return (
    <div>
      {category && (
        <div className="flex flex-col md:flex-row items-stretch bg-lightCard dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 border border-lightBorder dark:border-[#333]">
          
          {category.image_url && (
            <div className="w-full md:w-2/5 lg:w-1/3 aspect-video md:aspect-auto flex-shrink-0 relative bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
              {/* Blurred background effect */}
              <div 
                className="absolute inset-0 opacity-30 dark:opacity-20 blur-xl scale-110" 
                style={{ backgroundImage: `url(${category.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
              
              {/* Actual Image (Fully Visible) */}
              <img 
                src={category.image_url} 
                alt={category.name} 
                className="relative z-10 w-full h-full object-contain max-h-[250px] md:max-h-[300px] drop-shadow-md" 
              />
            </div>
          )}
          
          <div className={`p-6 md:p-8 flex flex-col justify-center w-full ${category.image_url ? 'md:w-3/5 lg:w-2/3' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-4 mb-4">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-base md:text-lg text-lightTextSecondary dark:text-darkTextSecondary pl-4 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
          
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="text-center py-20 text-lightTextSecondary dark:text-darkTextSecondary">
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
