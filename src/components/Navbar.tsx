import { motion, useScroll, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import { ShoppingBag, Heart, User, LogOut, Receipt } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

interface NavbarProps {
  onCartClick: () => void;
  onHomeClick: () => void;
}

export default function Navbar({ onCartClick, onHomeClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={onHomeClick}
            className="text-4xl font-display text-kaia-charcoal tracking-tighter"
          >
            kaia<span className="text-kaia-red">pantry</span>
          </button>

          <div className="md:flex gap-4 md:gap-8 items-center">
            <Link
              smooth
              to="/#menu"
              className="hidden md:block text-sm uppercase tracking-widest font-bold text-kaia-charcoal hover:text-kaia-red transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/about"
              className="hidden md:block text-sm uppercase tracking-widest font-bold text-kaia-charcoal hover:text-kaia-red transition-colors"
            >
              Our Story
            </Link>

            <div className="flex items-center gap-4 border-l border-kaia-tan/30 pl-8">
              <motion.button
                id="cart-icon"
                key={totalItems}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                onClick={onCartClick}
                className="relative p-2 text-kaia-charcoal hover:text-kaia-red transition-colors group"
              >
                <ShoppingBag size={24} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-kaia-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-kaia-charcoal hover:text-kaia-red transition-colors group"
                  >
                    <div className="w-8 h-8 bg-kaia-red/10 rounded-full flex items-center justify-center text-kaia-red group-hover:bg-kaia-red group-hover:text-white transition-all">
                      <User size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {user?.name.split(" ")[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl border border-kaia-tan/20 p-2 overflow-hidden"
                    >
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-kaia-taupe hover:bg-kaia-cream hover:text-kaia-red rounded-xl transition-all"
                      >
                        <Heart size={14} /> Wishlist
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-kaia-taupe hover:bg-kaia-cream hover:text-kaia-red rounded-xl transition-all"
                      >
                        <Receipt size={14} /> My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate("/");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-kaia-red hover:bg-kaia-red/5 rounded-xl transition-all"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-widest font-bold text-kaia-red hover:text-kaia-taupe transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-kaia-red z-60 origin-left"
        style={{ scaleX }}
      />
    </>
  );
}
