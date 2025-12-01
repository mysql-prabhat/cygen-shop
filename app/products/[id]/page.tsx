"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import { api } from "@/utils/api";
import { useCart } from "../../context/cartContext";

export default function ProductDetail({ params }: any) {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        api(`products/${id}`).then((data) => setProduct(data));
        
      } catch (err: any) {
        setError(err.message || "Failed to load product");
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <Container>
      <div className="p-10 text-lg text-center">Loading...</div>
    </Container>
  );

  if (error) return (
    <Container>
      <div className="p-10 text-lg text-center text-red-600">Error: {error}</div>
    </Container>
  );

  if (!product) return (
    <Container>
      <div className="p-10 text-lg text-center">Product not found</div>
    </Container>
  );

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-3 text-gray-700">
            {product.title}
          </h1>

          <img
            src={product.thumbnail || product.images?.[0]}
            className="w-full rounded-lg mb-4"
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
            }}
          />

          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-sm text-gray-500">
            Brand: {product.brand || "N/A"}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            Stock: {product.stock || "N/A"} items
          </p>

          <button
                onClick={() => addToCart(product)}
                className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                >
                Add to Cart
           </button>
        </div>
      </div>
    </Container>
  );
}
