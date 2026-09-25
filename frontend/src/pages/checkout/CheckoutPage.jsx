import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import api from '../../services/api.js';

const CheckoutPage = () => {
  const { items, totalQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    shippingAddress: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty. Please add garments before placing an order.');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.shippingAddress.trim()) {
      setErrorMessage('Please fill in your name, mobile number, and delivery/store pickup address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        notes: formData.notes.trim(),
        totalAmount: subtotal,
        items: items.map(item => ({
          id: item.id,
          sfId: item.sfId || item.id,
          name: item.name,
          quantity: item.quantity,
          numericPrice: item.numericPrice || 0,
          selectedSize: item.selectedSize || 'Free Size'
        }))
      };

      const res = await api.post('/orders', payload);
      const createdOrder = res.data?.order || res.order;
      const orderId = createdOrder?.id || createdOrder?.sfId || 'NEW-ORDER';

      // Clear the local cart
      clearCart();

      // Navigate to Order Confirmation
      navigate(`/order-confirmation/${orderId}`, {
        state: {
          order: createdOrder,
          customerDetails: formData,
          purchasedItems: items,
          totalAmount: subtotal
        }
      });
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(
        err.response?.data?.message || 
        err.message || 
        'Unable to complete order placement. Please check your internet connection or call our showroom directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <ShoppingBag className="w-7 h-7 text-amber-600" />
              <span>Checkout & Order Placement</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide your details to create an order directly with Bhaskara Readymades showroom.
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Your bag is empty</h2>
              <p className="text-xs text-slate-500">Please choose your garments before proceeding to checkout.</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Clothing Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Customer Info Form (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Customer & Delivery Details</span>
                <h2 className="text-xl font-extrabold text-slate-900">Where should we deliver your order?</h2>
                <p className="text-xs text-slate-500">
                  Direct delivery across Ganapavaram mandal or fast in-store pickup at our Saripalli showroom.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-5">
                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Varma"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Contact: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Delivery Address / House Details <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="shippingAddress"
                      rows={3}
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      placeholder="e.g. Door No. 3-45, Near Ramalayam Temple, Saripalli village"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Town / City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Ganapavaram"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Andhra Pradesh"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 534198"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Order Notes / Sizing Instructions (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Please pack in festive gift box or prepare for 6 PM pickup"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl text-sm uppercase flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Placing Order with Showroom...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Order (₹{subtotal})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Order Summary Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Order Items ({totalQuantity})</span>
                  <Link to="/cart" className="text-xs text-amber-700 underline font-semibold">
                    Edit
                  </Link>
                </h3>

                {/* Items List */}
                <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="space-y-0.5 max-w-[200px]">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} • Size: <span className="font-semibold text-slate-700">{item.selectedSize}</span>
                        </p>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₹{item.numericPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery / Pickup</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (Included)</span>
                    <span className="font-mono text-slate-900">₹0</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-extrabold text-slate-900 uppercase">Total Amount</span>
                    <span className="text-2xl font-black text-slate-900 font-mono">₹{subtotal}</span>
                  </div>
                </div>

                {/* Direct Delivery Assistance */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-900">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Doorstep Delivery & Order Support</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your garments will be carefully packed and dispatched directly to your shipping address upon order confirmation.
                  </p>
                </div>
              </div>

              {/* Quality Guarantee */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 text-xs space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bhaskara Readymades Promise</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  100% genuine readymade fabrics, inspected stitching, and effortless size exchanges directly at our store counter.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;
