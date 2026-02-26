import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-kaia-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl border border-kaia-tan/30"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-display text-kaia-charcoal mb-2">Admin Login</h1>
          <p className="text-kaia-taupe font-script text-2xl">kaiapantry management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-kaia-taupe mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-kaia-taupe" size={18} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all text-kaia-charcoal"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-kaia-taupe mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-kaia-taupe" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all text-kaia-charcoal"
                required
              />
            </div>
          </div>

          {error && <p className="text-kaia-red text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-kaia-red text-white py-4 rounded-xl font-bold hover:bg-kaia-charcoal transition-all duration-300 shadow-lg"
          >
            Enter Pantry
          </button>
        </form>
      </motion.div>
    </div>
  );
}
