import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Package, ListOrdered, LayoutDashboard } from 'lucide-react';
import Products from './Products';
import Orders from './Orders';
import Stats from './Stats';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ListOrdered size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder rounded-lg p-4 h-fit">
        <h2 className="text-xl font-bold mb-6 text-lightBlue dark:text-aqua border-b border-lightBorder dark:border-darkBorder pb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive ? 'bg-darkBlue dark:bg-cyan/20 text-darkBlue dark:text-cyan' : 'text-lightTextSecondary dark:text-darkTextSecondary hover:bg-lightBorder dark:hover:bg-darkBorder hover:text-lightText dark:text-darkText'
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Stats />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
