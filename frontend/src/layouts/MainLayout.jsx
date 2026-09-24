import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/navigation/index.js';
import WhatsAppFloatingWidget from '../components/common/WhatsAppFloatingWidget.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 w-full overflow-x-hidden relative">
      {/* Top Header & Navigation */}
      <Navbar />

      {/* Main Page Content Body - Full Width */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Floating WhatsApp Live Order & Inquiry Widget */}
      <WhatsAppFloatingWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;


