import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function FlyingItemsOverlay() {
  const { flyingItems, removeFlyingItem } = useCart();
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCartPos = () => {
      // Try desktop icon first, then mobile
      let cartIcon = document.getElementById("cart-icon");
      if (cartIcon && cartIcon.offsetParent === null) {
        cartIcon = document.getElementById("cart-icon-mobile");
      }

      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setCartPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    return () => window.removeEventListener("resize", updateCartPos);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-200">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startPos.x - 24,
              y: item.startPos.y - 24,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: cartPos.x - 12,
              y: cartPos.y - 12,
              scale: 0.2,
              opacity: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => removeFlyingItem(item.id)}
            className="fixed w-12 h-12 rounded-full overflow-hidden shadow-xl border-2 border-white"
          >
            <img
              src={item.image}
              alt="flying item"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
