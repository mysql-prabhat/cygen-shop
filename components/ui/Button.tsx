"use client";

import Link from "next/link";
import { cn } from "@/utils/cn"; // (optional helper)
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string; // Makes it act like a link
  variant?: "primary" | "secondary" | "danger" | "outline" | "success";
  className?: string;
  full?: boolean;
};

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  full = false,
}: ButtonProps) {
  
  // Tailwind variant styles
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
    success: "bg-green-500 text-white",        
  };

  const finalClass = `
    ${variants[variant]}
    px-4 py-2 rounded-md font-medium transition
    ${full ? "w-full" : ""}
    ${className}
  `;

  // If href exists → return Link button
  if (href) {
    return (
      <Link href={href} className={finalClass}>
        {children}
      </Link>
    );
  }

  // Otherwise return a normal button
  return (
    <button onClick={onClick} className={finalClass}>
      {children}
    </button>
  );
}
