import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MessageCircle, X, Send, Sparkles, Phone, ArrowUpRight } from 'lucide-react';

const WhatsAppFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const widgetRef = useRef(null);
  const popupRef = useRef(null);
  const btnRef = useRef(null);

  const phoneNumber = '918309897937'; // 8309897937

  // GSAP subtle pulse on button entry
  useGSAP(() => {
    gsap.from(btnRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.5
    });
  }, { scope: widgetRef });

  // GSAP smooth entrance on popup open
  useGSAP(() => {
    if (isOpen && popupRef.current) {
      gsap.from(popupRef.current, {
        scale: 0.85,
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  }, { dependencies: [isOpen], scope: widgetRef });

  const quickInquiries = [
    'Hi Bhaskara Readymades, I want to check latest festive collections.',
    'Can you share photos & prices for Men Shirts & Kurtas?',
    'Do you have Sarees and Kurtis available in store right now?',
    'I want to place an order for home delivery.'
  ];

  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hi Bhaskara Readymades, I would like to inquire about garments and delivery.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const handleSendQuickMessage = (text) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end notranslate">
      
      {/* Floating Popup Card */}
      {isOpen && (
        <div ref={popupRef} className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Bhaskara Readymades</h4>
                <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
                  <span>Online Assistance • Saripalli Store</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close Chat Window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 bg-slate-50 space-y-3.5 max-h-80 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200/70 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Namaste! How can we help you today?</span>
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Connect directly with our showroom on WhatsApp for fabric photos, sizing inquiries, or instant delivery orders.
              </p>
            </div>

            {/* Quick Inquiry Options */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                Quick Inquiries:
              </p>
              <div className="space-y-1.5">
                {quickInquiries.map((qText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuickMessage(qText)}
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-2.5 rounded-xl text-slate-800 transition flex items-center justify-between group shadow-2xs"
                  >
                    <span className="line-clamp-1">{qText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendCustomMessage} className="p-3 bg-white border-t border-slate-200/80 flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message / size request..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition shadow-md hover:scale-105 shrink-0"
              aria-label="Send WhatsApp Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Hotline */}
          <div className="px-4 py-2 bg-slate-100 text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1.5 border-t border-slate-200/60">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Direct WhatsApp & Call: <strong>+91 8309897937</strong></span>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 sm:px-5 rounded-full shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 border-2 border-white"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
        </div>
        <span className="text-xs sm:text-sm font-extrabold tracking-wide hidden sm:inline">
          Order on WhatsApp
        </span>
        <span className="sm:hidden text-xs font-bold">
          WhatsApp
        </span>
      </button>

    </div>
  );
};

export default WhatsAppFloatingWidget;
