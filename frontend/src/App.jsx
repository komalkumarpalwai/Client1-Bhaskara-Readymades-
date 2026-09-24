import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;


