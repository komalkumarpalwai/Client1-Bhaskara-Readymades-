import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingBag, CheckCircle, ArrowRight, X } from 'lucide-react';
import { getProductImageUrl } from '../../config/env.js';

/**
 * AddedToCartToast
 * Floating animated toast notification that smoothly pops up whenever an item is added to cart.
 */
const AddedToCartToast = ({ notification, onClose }) => {
  const toastRef = useRef(null);

  useGSAP(() => {
    if (!notification) return;

    const el = toastRef.current;
    // Entrance bounce & slide animation
    gsap.fromTo(
      el,
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
    );
  }, { dependencies: [notification], scope: toastRef });

  if (!notification) return null;

  const { product, size, quantity } = notification;
  const imgUrl = getProductImageUrl(product.imageUrl || (product.images && product.images[0]));

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full px-4 sm:px-0 pointer-events-auto">
      <div
        ref={toastRef}
        className="bg-slate-900 text-white border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 relative overflow-hidden"
      >
        {/* Animated glowing success top indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 animate-pulse" />

        {/* Thumbnail Preview */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0 flex items-center justify-center p-0.5">
          {imgUrl ? (
            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <ShoppingBag className="w-6 h-6 text-amber-400" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold font-mono tracking-wide">
            <CheckCircle className="w-4 h-4 fill-emerald-500 text-slate-900" />
            <span>Added to Cart!</span>
          </div>
          
          <h4 className="text-sm font-bold text-white truncate mt-0.5">
            {product.name}
          </h4>

          <div className="flex items-center space-x-2 text-[11px] text-slate-300 mt-1">
            <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-amber-300 font-semibold font-mono">
              Size: {size || 'Free Size'}
            </span>
            <span>Qty: {quantity || 1}</span>
            <span className="font-extrabold text-white">{product.price}</span>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <Link
              to="/cart"
              onClick={onClose}
              className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/checkout"
              onClick={onClose}
              className="inline-flex items-center bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Checkout
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AddedToCartToast;
