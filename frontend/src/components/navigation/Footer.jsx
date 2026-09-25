import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ArrowRight,
  Shirt
} from 'lucide-react';
import { logo } from '../../assets/index.js';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-indigo-950 text-indigo-400 rounded-lg shrink-0">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Complete Family Wear</h4>
              <p className="text-xs text-slate-400 mt-0.5">Kids, Women's & Men's readymade garments all under one roof.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-amber-950 text-amber-400 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Trusted Quality Fabrics</h4>
              <p className="text-xs text-slate-400 mt-0.5">Durable, comfortable materials curated for daily and festive wear.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Best Local Value</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fair pricing for Saripalli, Ganapavaram & West Godavari.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-rose-950 text-rose-400 rounded-lg shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Warm Customer Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">Friendly assistance in-store and prompt order support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Bhaskara Readymades" 
                className="h-16 sm:h-20 w-auto max-w-[280px] object-contain bg-white/95 p-1.5 rounded-lg shadow-sm" 
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Your premier clothing destination in Ganapavaram. We bring you the latest readymades, traditional ethnic wear, festive collections, and daily casuals for Men, Women, and Kids.
            </p>

            {/* Address Badge */}
            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sivalayam Street, Saripalli, Ganapavaram, Andhra Pradesh — 534198
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Open All Days: 9:00 AM – 9:30 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919396977779" className="hover:text-amber-400 transition-colors font-semibold text-white">
                  +91 9396977779 (Call & WhatsApp)
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Garment Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/kids" className="hover:text-amber-400 transition-colors flex items-center font-semibold text-amber-300">
                  <ArrowRight className="w-3 h-3 mr-1 text-amber-400" /> Kids' Clothing (Full Range)
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-amber-400 transition-colors flex items-center font-semibold text-amber-300">
                  <ArrowRight className="w-3 h-3 mr-1 text-amber-400" /> Women's Clothing (Complete)
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-amber-400 transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1 text-slate-600" /> New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-amber-400 transition-colors flex items-center text-amber-400 font-medium">
                  <ArrowRight className="w-3 h-3 mr-1 text-slate-600" /> Festive Offers
                </Link>
              </li>
              <li>
                <Link to="/category/men" className="hover:text-amber-400 transition-colors flex items-center text-slate-400">
                  <ArrowRight className="w-3 h-3 mr-1 text-slate-600" /> Men's Night Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Our Shop</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact & Directions</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Customer Login</Link>
              </li>
            </ul>
          </div>

          {/* Store Hours & Visiting */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Visit Our Store
            </h4>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <p className="text-slate-300">
                Experience fabrics firsthand! Visit our shop at <strong className="text-white">Saripalli, Ganapavaram</strong>.
              </p>
              <div className="pt-1">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1.5" /> Get Directions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Bhaskara Readymades. All rights reserved.</p>
          <p className="text-slate-400">
            Sivalayam Street, Saripalli, Ganapavaram, 534198, AP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
