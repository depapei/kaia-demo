import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User } from "lucide-react";
import { useAdminLogin } from "../features/admin/useAdminLogin";
import { AxiosError } from "axios";

export interface Token {
  user_id: string;
  user_email: string;
  user_name: string;
  sub: string;
}

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const adminLoginMutation = useAdminLogin();
  const { isPending } = adminLoginMutation;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    adminLoginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            localStorage.setItem("adminToken", data.token);
            navigate("/admin/dashboard");
          } else {
            setError(data.message);
          }
        },
        onError: (err: AxiosError) => {
          type response = {
            message?: string;
          };
          const response: response = err.response.data;
          setError(response.message);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-kaia-cream flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-4xl p-10 shadow-xl border border-kaia-tan/30"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-display text-kaia-charcoal mb-2">
            Admin Login
          </h1>
          <p className="text-kaia-taupe font-script text-2xl">
            kaiapantry management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-kaia-taupe mb-2 ml-1">
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-kaia-taupe"
                size={18}
              />
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
            <label className="block text-xs uppercase tracking-widest font-bold text-kaia-taupe mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-kaia-taupe"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all text-kaia-charcoal"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-kaia-red text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`w-full  text-white py-4 rounded-xl font-bold hover:bg-kaia-charcoal transition-all shadow-lg ${isPending ? "bg-kaia-charcoal animate-pulse hover:cursor-not-allowed" : "bg-kaia-red"}`}
          >
            {isPending ? "Loading ..." : "Enter Admin Panel"}
          </button>
          <p className="text-center text-kaia-taupe text-sm">
            Back to the website?{" "}
            <Link to="/" className="text-kaia-red font-bold hover:underline">
              Click Here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
