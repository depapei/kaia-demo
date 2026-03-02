import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartDrawer from "../components/CartDrawer";

export default function AboutPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <main className="grow pt-24">
        <About />
      </main>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => navigate("/checkout")}
      />
      <Footer />
    </div>
  );
}
