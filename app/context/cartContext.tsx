"use client";
import { createContext, useState, useContext } from "react";
type CartItem = {
  id: number;
  title: string;
  price: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product:any) => {
    setCart((prev: any) => [...prev, product]);
  };

  const removeFromCart = (id:number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };
  const clearCart = () => {
      setCart([]);
      localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
