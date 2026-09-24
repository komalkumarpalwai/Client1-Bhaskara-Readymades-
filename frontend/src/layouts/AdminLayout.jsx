import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Contact Leads', path: '/admin/customers' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' }
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-black px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/admin/dashboard" className="text-base font-bold uppercase tracking-wider">
            Bhaskara Readymades <span className="text-xs font-normal text-gray-500">| Admin</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs uppercase font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-black text-white font-bold'
                      : 'text-black hover:bg-gray-100'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center space-x-4 text-xs">
          <span className="hidden sm:inline text-gray-600 font-mono">
            {user?.email || 'admin'}
          </span>
          <Link to="/" target="_blank" className="text-gray-600 hover:text-black underline">
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="border border-black px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="md:hidden border-b border-gray-200 px-4 py-2 flex space-x-2 text-xs uppercase overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2.5 py-1 whitespace-nowrap ${
                isActive ? 'bg-black text-white font-bold' : 'text-black hover:bg-gray-100'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        Bhaskara Readymades • Admin Console • Saripalli, Ganapavaram, AP
      </footer>
    </div>
  );
};

export default AdminLayout;
