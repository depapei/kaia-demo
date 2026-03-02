import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    if (!user) return;
    const res = await fetch(`/api/wishlist/${user.id}`);
    const data = await res.json();
    setWishlist(data);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    await fetch(`/api/wishlist/${user.id}/${productId}`, { method: "DELETE" });
    fetchWishlist();
  };

  return (
    <div className="min-h-screen flex flex-col bg-kaia-cream">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <main className="grow pt-32 px-6 max-w-6xl mx-auto w-full pb-24">
        <div className="flex items-center gap-4 mb-12">
          <Heart className="text-kaia-red fill-kaia-red" size={40} />
          <h1 className="text-6xl font-display text-kaia-charcoal">
            My Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-kaia-tan/30">
            <p className="text-kaia-taupe text-2xl font-light mb-8">
              Your wishlist is empty. Start adding some treats!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-kaia-red text-white px-10 py-4 rounded-2xl font-bold hover:bg-kaia-charcoal transition-all shadow-xl"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-kaia-tan/30 group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-kaia-red hover:bg-kaia-red hover:text-white transition-all shadow-md"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-display text-kaia-charcoal mb-2">
                    {product.name}
                  </h3>
                  <p className="text-kaia-red font-bold mb-6">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      addToCart({ ...product, quantity: 1 });
                      setIsCartOpen(true);
                    }}
                    className="w-full bg-kaia-cream text-kaia-charcoal py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-kaia-red hover:text-white transition-all"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
