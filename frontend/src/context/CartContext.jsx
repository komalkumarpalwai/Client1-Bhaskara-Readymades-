import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import AddedToCartToast from '../components/common/AddedToCartToast.jsx';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Items structure: [{ id, name, code, sku, category, price, numericPrice, quantity, selectedSize }]
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaskara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastAddedNotification, setLastAddedNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('bhaskara_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0) * (item.numericPrice || 0), 0);
  }, [items]);

  const addToCart = (product, size = 'Free Size', quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.id === product.id && i.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            code: product.code || product.sku || '',
            sku: product.sku || '',
            category: product.category || 'Clothing',
            price: product.price,
            numericPrice: product.numericPrice || (typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.]/g, '')) : product.price) || 0,
            selectedSize: size,
            quantity: quantity,
            addedAt: new Date().toISOString(),
            imageUrl: product.imageUrl || (product.images && product.images[0]) || ''
          }
        ];
      }
    });

    // Trigger neat "Added to Cart" popup animation
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setLastAddedNotification({
      product,
      size,
      quantity,
      id: Date.now()
    });

    toastTimeoutRef.current = setTimeout(() => {
      setLastAddedNotification(null);
    }, 4000);
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId && item.selectedSize === size) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, size) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.selectedSize === size))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const closeNotification = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setLastAddedNotification(null);
  };

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }),
    [items, totalQuantity, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AddedToCartToast
        notification={lastAddedNotification}
        onClose={closeNotification}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
