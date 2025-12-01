"use client";

import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useCart } from "../context/cartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    api("products").then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
          Product List
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <article
              key={p.id}
              className="border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition bg-white flex flex-col"
            >
              <div className="mb-3 h-48 sm:h-56 w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                <img
                  src={p.thumbnail || p.images?.[0]}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                {p.title}
              </h2>

              <p className="text-blue-600 font-bold text-xl mb-3">₹{p.price}</p>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {p.description}
              </p>

              <div className="mt-auto flex gap-3">

                {/* View Product Button */}
                <Button
                  href={`/products/${p.id}`}
                  variant="primary"
                  full
                >
                  View Product
                </Button>

                {/* Add to Cart Button */}
                <Button
                  variant="success"
                  full
                  onClick={() => {
                    addToCart(p);
                    setSuccessMessage(`${p.title} added to cart!`);
                    setTimeout(() => setSuccessMessage(null), 2000);
                  }}
                >
                  Add to Cart
                </Button>

              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}