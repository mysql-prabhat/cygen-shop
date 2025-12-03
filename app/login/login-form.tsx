"use client";
function googleLogin() {
  window.location.href = "https://cygen-shop-backend-production.up.railway.app/api/auth/google";
}

export default function Login() {
  return <button onClick={googleLogin} className="mx-auto block bg-blue-500 text-white px-4 py-2 rounded">Login with Google</button>;
}