"use client";

import { useCart } from "../context/cartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const { cart, removeFromCart } =  useCart() ?? {};
  const [token, setToken] = useState<string | null>(null); // <-- create state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);     // <-- store it in state
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart?.length === 0 && <p>No items in cart</p>}

      <ul className="space-y-3">
        {cart?.map((item) => (
          <li key={item.id} className="border p-4 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p>₹{item.price}</p>
            </div>

            <button
              onClick={() => removeFromCart?.(item.id)}
              className="px-5 py-2 bg-red-500 text-white rounded"
            >
              Remove ❌
            </button>
          </li>
        ))}
      </ul>

      {cart && (
        <div className="mt-4">
          <Link
            href={token ? "/checkout" : "/login"}  // <-- now works
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Checkout →
          </Link>
        </div>
      )}
    </div>
  );
}