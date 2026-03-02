/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./components/CheckoutPage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./pages/WishlistPage";
import UserTransactionsPage from "./pages/UserTransactionsPage";
import OnboardingPage from "./pages/OnboardingPage";
import FlyingItemsOverlay from "./components/FlyingItemsOverlay";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function LandingPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      navigate("/onboarding");
    }
  }, [navigate]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <main className="grow">
        <Hero />
        <Menu />
      </main>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Footer />
    </div>
  );
}

function CheckoutView() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <CheckoutPage onBack={() => navigate("/")} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCartOpen(false)}
      />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FlyingItemsOverlay />
        <Router>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutView />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<UserTransactionsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
