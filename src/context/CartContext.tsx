import React, { createContext, useContext, useEffect, useState } from "react";

export interface Strategy {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  file_url: string;
  resale_enabled: boolean;
  approved: boolean;
}

interface CartContextType {
  cartItems: Strategy[];
  addToCart: (item: Strategy) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Strategy[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("pinescripers_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pinescripers_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Strategy) => {
    if (!cartItems.some((i) => i.id === item.id)) {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

