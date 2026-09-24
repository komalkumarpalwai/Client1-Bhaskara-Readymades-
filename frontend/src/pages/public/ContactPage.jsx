import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

import api from '../../services/api.js';

const ContactPage = () => {
  // Contact / Lead Form State
  // Structured to map directly to Salesforce Lead SObject:
  // FirstName, LastName, Phone, Email, Company, LeadSource, Description
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    categoryInterest: "Men's Clothing",
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name and phone number so we can reach you.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/customers/lead', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        categoryInterest: formData.categoryInterest,
        message: formData.message.trim(),
        leadSource: 'Web Storefront'
      });

      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        categoryInterest: "Men's Clothing",
        message: ''
      });
    } catch (err) {
      console.error('Lead creation error:', err);
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while submitting. Please try again or call us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const googleMapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=Sivalayam+Street,+Saripalli,+Ganapavaram,+Andhra+Pradesh+534198";
  const googleMapsEmbedUrl = "https://maps.google.com/maps?q=Sivalayam+Street,+Saripalli,+Ganapavaram,+534198,+Andhra+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-700">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          <span>Saripalli, Ganapavaram, Andhra Pradesh</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch & Visit Our Store
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Have a question about garment sizes, upcoming festive collections, or bulk order pricing? Reach out to our friendly team or visit our store in Saripalli!
        </p>
      </div>

      {/* Main Grid: Contact Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Store Details & Timings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Store Location</span>
              <h2 className="text-2xl font-extrabold text-white">Bhaskara Readymades</h2>
              <p className="text-slate-400 text-xs">Complete Family Clothing & Readymade Center</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Store Address</strong>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Sivalayam Street, Saripalli, Ganapavaram, West Godavari District, Andhra Pradesh — 534198
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-xl shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Business Hours</strong>
                  <p className="text-slate-300 mt-0.5">
                    Monday to Sunday: <span className="text-amber-300 font-medium">9:00 AM – 9:30 PM</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">Open throughout all festivals and weekends.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Direct Customer Care & WhatsApp</strong>
                  <p className="text-slate-300 mt-0.5">+91 8309897937 (Showroom & Orders)</p>
                  <p className="text-slate-400 text-xs mt-0.5">+91 8309897937 (Ganapavaram Desk)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-slate-800 text-rose-400 rounded-xl shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Email Us</strong>
                  <p className="text-slate-300 mt-0.5">info@bhaskarareadymades.com</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-md"
              >
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs space-y-2">
            <h4 className="font-bold flex items-center">
              <Sparkles className="w-4 h-4 text-amber-600 mr-1.5" /> Landmark & Visiting Note
            </h4>
            <p className="leading-relaxed text-amber-800">
              Located conveniently along Sivalayam Street in Saripalli village. Ample two-wheeler and four-wheeler parking is available right in front of the store.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Lead / Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Send an Inquiry</span>
            <h2 className="text-2xl font-extrabold text-slate-900">We'd Love to Hear From You</h2>
            <p className="text-slate-500 text-xs">
              Fill out the form below. Inquiries are stored directly for our customer relations team.
            </p>
          </div>

          {/* Success Banner */}
          {isSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-sm">Thank You for Reaching Out!</p>
                <p>
                  Your message has been captured. Our store representative will connect with you on your phone number shortly.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
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
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Collection of Interest
              </label>
              <select
                name="categoryInterest"
                value={formData.categoryInterest}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Men's Clothing">Men's Ready-to-Wear (Shirts, Kurtas, Trousers)</option>
                <option value="Women's Clothing">Women's Collection (Sarees, Kurtis, Sets)</option>
                <option value="Kids' Clothing">Kids' Clothing (Boys & Girls Wear)</option>
                <option value="Festive & Wedding Orders">Festive, Wedding & Bulk Purchase</option>
                <option value="General Inquiry">General Store Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Message / Inquiry
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you're looking for (sizes, colors, bulk quantities)..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Inquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

          {/* Store Direct Assistance Note */}
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono text-[10px] mr-2">Fast Response</span>
            Our showroom team in Saripalli will follow up with your inquiry within 24 hours.
          </div>
        </div>
      </div>

      {/* Embedded Google Maps Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Find Us on the Map</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Interactive Store Location Map
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sivalayam Street, Saripalli, Ganapavaram, Andhra Pradesh — 534198
            </p>
          </div>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm shrink-0"
          >
            <span>Open Full Google Map</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

        {/* Map Container */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
          <iframe
            title="Bhaskara Readymades Google Maps Location"
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </section>
      </div>
    </div>
  );
};

export default ContactPage;

