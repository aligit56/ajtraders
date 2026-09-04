import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Sun, Moon } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-lightCard dark:bg-darkCard border-b border-lightBorder dark:border-darkBorder sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-darkBlue dark:text-cyan" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-darkBlue dark:text-cyan flex-shrink-0 mx-4 md:mx-0">
          AJ<span className="text-lightBlue dark:text-aqua">Traders</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-grow max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input-field pl-10 w-full"
          />
          <Search className="absolute left-3 top-2.5 text-lightTextSecondary dark:text-darkTextSecondary" size={20} />
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button onClick={toggleDarkMode} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-darkBlue dark:hover:text-cyan transition-colors" aria-label="Toggle Dark Mode">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="hover:text-darkBlue dark:hover:text-cyan flex items-center gap-1">
                  <User size={16}/> {user.name}
                </Link>
                <button onClick={handleLogout} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-error-light dark:hover:text-error-dark">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-darkBlue dark:hover:text-cyan">Login</Link>
            )}
          </div>
          
          <Link to="/cart" className="relative text-lightText dark:text-darkText hover:text-darkBlue dark:hover:text-cyan transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-darkBlue dark:bg-cyan text-white dark:text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-lightCard dark:bg-darkCard border-t border-lightBorder dark:border-darkBorder p-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-lightTextSecondary dark:text-darkTextSecondary" size={20} />
          </div>
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="text-darkBlue dark:text-cyan" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-error-light dark:text-error-dark">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-darkBlue dark:text-cyan" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
