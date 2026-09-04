import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products')
        ]);
        
        const orders = ordersRes.data;
        const products = productsRes.data;
        
        const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
        const revenue = todayOrders.reduce((sum, o) => sum + o.total_price, 0);
        const lowStock = products.filter(p => p.stock < 5);
        
        setStats({
          todayCount: todayOrders.length,
          revenue,
          pendingCount: orders.filter(o => o.status === 'Pending').length,
          lowStock: lowStock.length,
          lowStockItems: lowStock
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-lightText dark:text-darkText">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6 border-t-4 border-t-brand-cyan">
          <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">Today's Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats.todayCount}</p>
        </div>
        <div className="card p-6 border-t-4 border-t-success-light dark:border-t-success-dark">
          <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">Today's Revenue</h3>
          <p className="text-3xl font-bold mt-2">Rs {stats.revenue}</p>
        </div>
        <div className="card p-6 border-t-4 border-t-yellow-500">
          <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats.pendingCount}</p>
        </div>
        <div className="card p-6 border-t-4 border-t-error-light dark:border-t-error-dark">
          <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">Low Stock Alerts</h3>
          <p className="text-3xl font-bold mt-2 text-error-light dark:text-error-dark">{stats.lowStock}</p>
        </div>
      </div>
      
      {stats.lowStockItems.length > 0 && (
        <div className="card p-6 border-l-4 border-l-error-light dark:border-l-error-dark">
          <h3 className="text-xl font-bold text-error-light dark:text-error-dark mb-4">Low Stock Items</h3>
          <ul className="space-y-2">
            {stats.lowStockItems.map(item => (
              <li key={item.id} className="flex justify-between border-b border-lightBorder dark:border-darkBorder pb-2">
                <span>{item.name}</span>
                <span className="font-bold text-error-light dark:text-error-dark">{item.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Stats;
