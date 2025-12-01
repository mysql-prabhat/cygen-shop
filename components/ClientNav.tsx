"use client";

import Link from "next/link";
import NavCart from "../components/nav-cart";
import { useEffect, useState } from "react";

export default function ClientNav() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  return (
    <nav className="flex items-center gap-6 text-gray-700 font-medium">
      <Link href="/products" className="hover:text-blue-600">
        Products |
      </Link>

      <Link href="/cart" className="hover:text-blue-600 relative">
        Cart <NavCart /> |
      </Link>

      {!token ? (
        <>
          <Link href="/login" className="hover:text-blue-600">
            Login |
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            Register
          </Link>
        </>
      ) : (
        <>
          <Link href="/my-orders" className="hover:text-blue-600">
            Profile |
          </Link>
          <Link href="/logout" className="hover:text-blue-600">
            Logout
          </Link>
        </>
      )}
    </nav>
  );
}