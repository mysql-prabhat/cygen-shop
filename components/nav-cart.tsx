"use client";

import React from "react";
import { useCart } from "../app/context/cartContext";

export default function NavCart() {
  const { cart } = useCart() || { cart: [] };
  const count = Array.isArray(cart) ? cart.length : 0;

  return (
    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
      {count}
    </span>
  );
}
