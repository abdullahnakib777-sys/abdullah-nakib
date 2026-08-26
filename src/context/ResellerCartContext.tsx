import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export interface ResellerCartItem {
  product: Product;
  quantity: number;
  unitSellingPrice: number; // The price the reseller decides to charge customer (>= product.resellerPrice)
}

interface ResellerCartContextType {
  items: ResellerCartItem[];
  itemCount: number;
  totalWholesaleCost: number;
  totalCustomerPrice: number;
  grossProfit: number;
  packagingFee: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, unitSellingPrice?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSellingPrice: (productId: string, unitSellingPrice: number) => void;
  clearCart: () => void;
}

const ResellerCartContext = createContext<ResellerCartContextType | undefined>(undefined);

export const ResellerCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ResellerCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shadhin_reseller_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shadhin_reseller_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, unitSellingPrice?: number) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      const price = unitSellingPrice !== undefined && unitSellingPrice >= product.resellerPrice
        ? unitSellingPrice
        : (existing?.unitSellingPrice || product.suggestedSellingPrice);

      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id
            ? { ...it, quantity: it.quantity + quantity, unitSellingPrice: price }
            : it
        );
      }
      return [...prev, { product, quantity, unitSellingPrice: price }];
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

  const updateSellingPrice = (productId: string, unitSellingPrice: number) => {
    setItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, unitSellingPrice } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const totalWholesaleCost = items.reduce((acc, it) => acc + it.product.resellerPrice * it.quantity, 0);
  const totalCustomerPrice = items.reduce((acc, it) => acc + it.unitSellingPrice * it.quantity, 0);
  const grossProfit = Math.max(0, totalCustomerPrice - totalWholesaleCost);
  // Fixed packaging fee of 30 TK per order as requested
  const packagingFee = items.length > 0 ? 30 : 0;

  return (
    <ResellerCartContext.Provider
      value={{
        items,
        itemCount,
        totalWholesaleCost,
        totalCustomerPrice,
        grossProfit,
        packagingFee,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSellingPrice,
        clearCart,
      }}
    >
      {children}
    </ResellerCartContext.Provider>
  );
};

export const useResellerCart = () => {
  const context = useContext(ResellerCartContext);
  if (!context) {
    throw new Error('useResellerCart must be used within a ResellerCartProvider');
  }
  return context;
};
