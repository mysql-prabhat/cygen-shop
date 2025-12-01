"use client";
function googleLogin() {
  window.location.href = "http://localhost:4000/api/auth/google";
}

export default function Login() {
  return <button onClick={googleLogin} className="mx-auto block bg-blue-500 text-white px-4 py-2 rounded">Login with Google</button>;
}