import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, ShoppingBag, Package, Home, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isVendor, isSupplier } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <ShoppingBag className="inline-block mr-2" size={24} />
            StreetFood Connect
          </Link>

          <ul className="navbar-nav">
            <li>
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home size={18} />
                Dashboard
              </Link>
            </li>
            
            <li>
              <Link to="/products" className="flex items-center gap-2">
                <Package size={18} />
                Products
              </Link>
            </li>

            {isVendor() && (
              <li>
                <Link to="/vendor-orders" className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  My Orders
                </Link>
              </li>
            )}

            {isSupplier() && (
              <li>
                <Link to="/supplier-orders" className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Orders Received
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar-user">
            <div className="user-info">
              <User size={20} />
              <span>{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;