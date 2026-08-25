import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPrice: number; // Suggested or custom
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  referralCode: string | null;
  addToCart: (product: Product, quantity?: number, customPrice?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setReferralCode: (code: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shadhin_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [referralCode, setReferralCodeState] = useState<string | null>(() => {
    return localStorage.getItem('shadhin_ref_code') || null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check URL parameters for referral codes on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      const cleanRef = ref.trim().toUpperCase();
      setReferralCodeState(cleanRef);
      localStorage.setItem('shadhin_ref_code', cleanRef);
      // Track referral click in backend
      api.trackReferralClick(cleanRef).catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shadhin_cart', JSON.stringify(items));
  }, [items]);

  const setReferralCode = (code: string | null) => {
    setReferralCodeState(code);
    if (code) {
      localStorage.setItem('shadhin_ref_code', code);
      api.trackReferralClick(code).catch(() => {});
    } else {
      localStorage.removeItem('shadhin_ref_code');
    }
  };

  const addToCart = (product: Product, quantity = 1, customPrice?: number) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      const price = customPrice || product.suggestedSellingPrice;
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [...prev, { product, quantity, selectedPrice: price }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce((acc, it) => acc + it.selectedPrice * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        referralCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setReferralCode,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
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
