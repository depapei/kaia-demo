import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogin } from "../features/auth/useLogin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import CartDrawer from "../components/CartDrawer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { isPending } = loginMutation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.success) {
            login(data.userData);
            navigate("/");
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
    <div className="min-h-screen flex flex-col bg-kaia-cream">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <main className="grow flex items-center justify-center p-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-kaia-tan/30"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-display text-kaia-charcoal mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-kaia-taupe text-center mb-8 font-script text-2xl">
              Sign in to your pantry account
            </p>

            {error && (
              <p className="animate-pulse text-kaia-red text-center mb-4 font-bold">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="john.doe@email.com"
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
                  placeholder="***"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full  text-white py-4 rounded-xl font-bold hover:bg-kaia-charcoal transition-all shadow-lg ${isPending ? "bg-kaia-charcoal animate-pulse hover:cursor-not-allowed" : "bg-kaia-red"}`}
              >
                {isPending ? "Loading ..." : "Sign In"}
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
          </motion.div>
        </motion.div>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => navigate("/checkout")}
        />
      </main>
      <Footer />
    </div>
  );
}
