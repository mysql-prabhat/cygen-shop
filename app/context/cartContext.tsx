"use client";
import { createContext, useState, useContext } from "react";
type CartItem = {
  id: number;
  title: string;
  price: number;
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};
interface Product {
  id: string;
  name: string;
  price: number;
  // any other properties
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product:any) => {
    setCart((prev: any) => [...prev, product]);
  };

  const removeFromCart = (id:string) => {
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
