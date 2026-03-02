import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kaia-cream">
      <Navbar onCartClick={() => {}} onHomeClick={() => navigate("/")} />
      <main className="grow flex items-center justify-center p-6 pt-32">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-kaia-tan/30">
          <h2 className="text-5xl font-display text-kaia-charcoal mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-kaia-taupe text-center mb-8 font-script text-2xl">
            Sign in to your pantry account
          </p>

          {error && (
            <p className="text-kaia-red text-center mb-4 font-bold">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-kaia-red text-white py-4 rounded-xl font-bold hover:bg-kaia-charcoal transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-kaia-taupe text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-kaia-red font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
