"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface CartContextType {
  cartCount: number;
  cartTotal: number;
  isFreeShipping: boolean;
  shippingProgress: number;
  addToCart: (item: CartItem) => void;
  addKitToCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const isFreeShipping = cartTotal >= 50000;
  const shippingProgress = Math.min(100, (cartTotal / 50000) * 100);

  const addToCart = (item: CartItem) => {
    setCartCount(prev => prev + 1);
    setCartTotal(prev => prev + item.price);
  };

  const addKitToCart = (items: CartItem[]) => {
    setCartCount(prev => prev + items.length);
    const kitTotal = items.reduce((sum, item) => sum + item.price, 0);
    // Apply progressive discount logic here or elsewhere
    setCartTotal(prev => prev + kitTotal);
  };

  return (
    <CartContext.Provider value={{ cartCount, cartTotal, isFreeShipping, shippingProgress, addToCart, addKitToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
