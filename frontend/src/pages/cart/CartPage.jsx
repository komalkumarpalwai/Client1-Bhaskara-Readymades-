import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Tag,
  Truck 
} from 'lucide-react';

import { useCart } from '../../context/CartContext.jsx';

const CartPage = () => {
  const { items, totalQuantity, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <ShoppingBag className="w-7 h-7 text-amber-600" />
              <span>Shopping Bag ({totalQuantity} items)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review your selected garments before placing your order.</p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline self-start sm:self-auto"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Your shopping bag is empty</h2>
              <p className="text-xs text-slate-500">Explore our authentic readymade collections and add your favorite items.</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Catalogue</span>
            </Link>
          </div>
        ) : (
          /* Bag Items & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Item Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-8 h-8 text-amber-700" />
                    </div>

                    <div className="space-y-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-amber-700 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                          Size: {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-400">{item.category}</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        ₹{item.numericPrice} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-slate-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 font-mono">
                        ₹{item.numericPrice * item.quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center space-x-1 mt-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-amber-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-xs">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-mono font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery & Handling</span>
                  <span className="text-emerald-700 font-bold">FREE DELIVERY</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes (GST Included)</span>
                  <span className="font-mono text-slate-900">₹0</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900 uppercase">Estimated Total</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">₹{subtotal}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  to="/checkout"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition"
                >
                  <span>Proceed to Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1 text-center">
                  <div className="flex items-center justify-center space-x-1 text-xs font-bold text-amber-900">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Doorstep Delivery & Store Assistance</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Fast order dispatch across Saripalli, Ganapavaram, and surrounding regions.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bhaskara Readymades Quality Guarantee</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
