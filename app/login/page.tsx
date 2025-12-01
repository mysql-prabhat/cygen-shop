"use client";
import { useState, FormEvent, useEffect } from "react";
import Login from "./login-form";
interface AuthFormProps {
  mode: "Signup" | "Login";
  onSubmit: (data: { email: string, password: string }) => void;
  resetForm?: boolean;
}
const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, resetForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (resetForm) {
      setEmail("");
      setPassword("");
    }
  }, [resetForm]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode}</h2>
      <div>
          <Login></Login>
      </div>
    </form>
  );
};
export default AuthForm;