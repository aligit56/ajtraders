import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const Category = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
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
        if (cat) setCategoryName(cat.name);
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
      <h2 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">
        {categoryName || 'Category'}
      </h2>
      
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
