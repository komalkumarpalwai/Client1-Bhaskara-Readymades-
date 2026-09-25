import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Clock,
  Printer,
  Truck
} from 'lucide-react';


const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const orderDetails = location.state || {};
  const { customerDetails, purchasedItems = [], totalAmount } = orderDetails;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header Banner */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Order Confirmed & Created
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thank You For Your Order!
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Your garments order has been recorded with our showroom team. We are packing your items with care.
            </p>
          </div>

          <div className="inline-block bg-slate-900 text-white font-mono text-sm px-5 py-2.5 rounded-2xl shadow-md">
            Order Reference: <strong className="text-amber-400">{orderId}</strong>
          </div>
        </div>

        {/* Order Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer & Delivery Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Delivery & Customer Details
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900">Recipient:</strong>{' '}
                {customerDetails ? `${customerDetails.firstName} ${customerDetails.lastName}` : 'Valued Customer'}
              </p>
              {customerDetails?.phone && (
                <p>
                  <strong className="text-slate-900">Mobile Phone:</strong> {customerDetails.phone}
                </p>
              )}
              {customerDetails?.email && (
                <p>
                  <strong className="text-slate-900">Email:</strong> {customerDetails.email}
                </p>
              )}
              {customerDetails?.shippingAddress && (
                <p className="pt-1 border-t border-slate-100">
                  <strong className="text-slate-900 block">Address:</strong>
                  {customerDetails.shippingAddress}, {customerDetails.city}, {customerDetails.state} — {customerDetails.postalCode}
                </p>
              )}
            </div>
          </div>

          {/* Order Delivery & Tracking */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Delivery & Dispatch Details
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Bhaskara Readymades Delivery Support</p>
              <p className="text-[11px] leading-relaxed">
                Your order is being processed and will be delivered directly to the shipping address provided.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl">
                For order tracking or delivery questions, our customer support desk is available at <strong>+91 9396977779</strong>.
              </div>
            </div>
          </div>

        </div>

        {/* Purchased Items List */}
        {purchasedItems.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Ordered Garments ({purchasedItems.length})
            </h3>

            <div className="space-y-3">
              {purchasedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Quantity: {item.quantity} • Size: {item.selectedSize || 'Free Size'}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{(item.numericPrice || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-slate-900">Total Paid / Payable</span>
              <span className="text-xl font-black text-slate-900 font-mono">₹{totalAmount || 0}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase flex items-center justify-center space-x-2 shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-xl text-xs uppercase flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
