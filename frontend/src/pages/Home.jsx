import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

import CategoryCarousel from '../components/CategoryCarousel';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setSearchResults(res.data);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const clearSearch = () => {
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  // Search Results View
  if (query) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">
          Search Results
        </h2>
        
        {searchLoading ? (
           <div className="flex items-center gap-2 text-lightTextSecondary dark:text-darkTextSecondary">
             <Loader2 className="animate-spin" size={20} /> Searching...
           </div>
        ) : searchResults.length > 0 ? (
          <div>
            <p className="mb-4 text-lightTextSecondary dark:text-darkTextSecondary">Found {searchResults.length} products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center bg-lightCard dark:bg-darkCard p-10 rounded-lg border border-lightBorder dark:border-darkBorder">
            <p className="text-lg text-lightTextSecondary dark:text-darkTextSecondary mb-4">No products found for "{query}"</p>
            <button onClick={clearSearch} className="btn-primary">
              Browse Categories
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default Home View
  return (
    <div className="space-y-12">
      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">Shop by Category</h2>
        <CategoryCarousel categories={categories} />
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
