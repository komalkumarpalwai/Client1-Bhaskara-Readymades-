import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAdmin) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAdmin, navigate, redirectPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await login(email.trim(), password.trim(), 'ADMIN');
      if (loggedUser && loggedUser.role === 'ADMIN') {
        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid admin credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@bhaskarareadymades.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm border border-black p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold uppercase tracking-wider text-black">
            Bhaskara Readymades
          </h1>
          <p className="text-xs text-gray-600 uppercase tracking-widest mt-1">
            Admin Console
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-black text-white text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bhaskarareadymades.com"
              required
              className="w-full px-3 py-2 border border-black text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-black text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-gray-600 hover:text-black underline"
          >
            Fill Demo Login
          </button>
          <Link to="/" className="text-gray-600 hover:text-black">
            Storefront →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
