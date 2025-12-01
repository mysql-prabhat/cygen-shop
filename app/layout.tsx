import "./globals.css";
import Link from "next/link";
import { CartProvider } from "./context/cartContext";
import ClientNav from "../components/ClientNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <title>Cygen - Your Online Store</title>
      <body className="bg-gray-50">
        <CartProvider>
          {/* HEADER */}
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              {/* Brand */}
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Cygen Shop
              </Link>

              {/* Client Navigation */}
              <ClientNav />
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="min-h-[80vh]">{children}</main>

          {/* FOOTER */}
          <footer className="bg-gray-900 text-white py-4 text-center mt-10">
            © {new Date().getFullYear()} Prabhat Mandal. All rights reserved.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}