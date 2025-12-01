"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "../../utils/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await apiGet("orders?search=''&page=1").then((data) => setOrders(data.items));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div className="p-5">Loading...</div>;

  if (!orders.length)
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-semibold">You have no orders.</h1>
        <Link href="/products" className="text-blue-500 underline">
          Start shopping now!
          
        </Link>
      </div>
    );

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p>Status: {order.status}</p>
            </div>
            <div className="text-right">
              <p>Total: ₹{order.amount / 100}</p>

              <Link
                href={`/order/${order.id}`}
                className="text-blue-600 underline"
              >
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}