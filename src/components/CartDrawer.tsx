import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price).replace("Rp", "Rp ");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-kaia-charcoal/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[201] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-kaia-cream flex justify-between items-center bg-kaia-cream/30">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-kaia-red" />
                <h2 className="text-3xl font-display text-kaia-charcoal">Your Pantry Bag ({totalItems})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-kaia-cream rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-kaia-cream rounded-full flex items-center justify-center text-kaia-taupe">
                    <ShoppingBag size={48} />
                  </div>
                  <p className="text-kaia-taupe font-script text-3xl">Pantry is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-kaia-red font-bold uppercase tracking-widest text-xs border-b-2 border-kaia-red pb-1"
                  >
                    Fill it up
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.slices || 'none'}`} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-kaia-cream rounded-2xl flex-shrink-0 p-2 border border-kaia-tan/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <div>
                          <h4 className="text-xl font-display text-kaia-charcoal">{item.name}</h4>
                          {item.slices && (
                            <span className="text-[10px] uppercase tracking-widest font-bold text-kaia-sage">
                              {item.slices === 'Full' ? 'Full Product' : `${item.slices} Slices`}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.slices)}
                          className="text-kaia-taupe hover:text-kaia-red transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-kaia-red font-display text-lg mb-3">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-kaia-tan rounded-xl overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, -1, item.slices)}
                            className="p-2 hover:bg-kaia-cream transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1, item.slices)}
                            className="p-2 hover:bg-kaia-cream transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-lg font-display text-kaia-charcoal ml-auto">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-kaia-tan/30 bg-kaia-cream/20 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-kaia-taupe font-bold uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-4xl font-display text-kaia-red">{formatPrice(totalPrice)}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-kaia-red text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-kaia-charcoal transition-all shadow-xl group"
                >
                  Checkout Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
