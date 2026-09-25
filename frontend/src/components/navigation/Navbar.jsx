import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Sparkles, 
  Tag, 
  ChevronRight,
  Globe
} from 'lucide-react';
import { logo } from '../../assets/index.js';
import { useCart } from '../../context/CartContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { currentLanguage, toggleLanguage } = useLanguage();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: "Kids' Wear", path: '/category/kids' },
    { name: "Women's Wear", path: '/category/women' },
    { name: 'Shop All', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Offers', path: '/offers', highlight: true },
    { name: "Men's Night Wear", path: '/category/men' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];


  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 transition-all duration-200">
      {/* Top Notification / Address Bar with Language Toggle */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Location & Tagline */}
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong className="text-white">Bhaskara Readymades:</strong> Sivalayam Street, Saripalli, Ganapavaram, 534198, AP
            </span>
          </div>

          {/* Quick Contact & Language Switcher at Top Right */}
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="hidden lg:inline-flex items-center text-amber-300 text-[11px]">
              <Sparkles className="w-3 h-3 mr-1" /> Complete Kids' & Women's Wear • Men's Night Wear
            </span>
            <a href="tel:+919396977779" className="hover:text-amber-400 transition-colors flex items-center text-[11px] font-semibold text-amber-300">
              <Phone className="w-3 h-3 mr-1 text-emerald-400" /> +91 9396977779
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center text-[11px]">
              Visit Store
            </Link>
            
            {/* Top Right English <-> Telugu Language Toggle Switch */}
            <div className="flex items-center pl-2 border-l border-slate-700">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 font-bold px-2.5 py-1 rounded-full text-[11px] transition shadow-sm notranslate"
                title="Toggle Language / భాష మార్చండి"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLanguage === 'te' ? 'English' : 'తెలుగు'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center group shrink-0 py-1">
          <img 
            src={logo} 
            alt="Bhaskara Readymades" 
            className="h-12 sm:h-16 md:h-18 max-w-[220px] sm:max-w-[280px] md:max-w-[320px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shirts, sarees, kurtis, kids wear..."
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right Actions: Cart & Mobile Language Switch */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Cart Icon with badge */}
          <Link
            to="/cart"
            className="relative flex items-center p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6 group-hover:scale-105 transition-transform text-slate-700" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {totalQuantity}
              </span>
            )}
            <span className="hidden sm:inline-block ml-2 text-sm font-semibold text-slate-800">
              Cart
            </span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="hidden md:block border-t border-slate-100 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 lg:space-x-3 overflow-x-auto py-1.5 scrollbar-none">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center space-x-1 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : link.highlight
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.highlight && <Tag className="w-3 h-3 mr-1 text-amber-600" />}
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothes & fabrics..."
              className="w-full pl-9 pr-20 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-md"
            >
              Search
            </button>
          </form>

          {/* Mobile Language Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl notranslate">
            <span className="text-xs font-semibold text-slate-700 flex items-center">
              <Globe className="w-4 h-4 mr-1.5 text-indigo-600" /> Language / భాష
            </span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg"
            >
              {currentLanguage === 'te' ? 'Switch to English' : 'తెలుగు లోకి మార్చండి'}
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-1 border-t border-slate-100 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : link.highlight
                      ? 'text-amber-700 bg-amber-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span className="flex items-center">
                  {link.highlight && <Tag className="w-3.5 h-3.5 mr-2 text-amber-600" />}
                  <span>{link.name}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}
          </div>

          {/* Store Location Card on Mobile */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 mr-1" /> Bhaskara Readymades
            </p>
            <p>Sivalayam Street, Saripalli, Ganapavaram, 534198, AP</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


