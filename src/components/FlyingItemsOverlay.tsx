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
          <div key={item.id}>
            {/* Ghost Trail Particles */}
            {[0.1, 0.2, 0.3].map((delay) => (
              <motion.div
                key={`${item.id}-trail-${delay}`}
                initial={{
                  x: item.startPos.x - 24,
                  y: item.startPos.y - 24,
                  scale: 0.4,
                  opacity: 0,
                }}
                animate={{
                  x: [
                    item.startPos.x - 24,
                    (item.startPos.x + cartPos.x) / 2,
                    cartPos.x - 12,
                  ],
                  y: [
                    item.startPos.y - 24,
                    Math.min(item.startPos.y, cartPos.y) - 100,
                    cartPos.y - 12,
                  ],
                  scale: [0.4, 0.8, 0.1],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 0.9,
                  delay: delay,
                  times: [0, 0.4, 1],
                  ease: "easeInOut",
                }}
                className="fixed w-8 h-8 rounded-full bg-kaia-red/30 blur-sm"
              />
            ))}

            {/* Main Flying Item */}
            <motion.div
              initial={{
                x: item.startPos.x - 24,
                y: item.startPos.y - 24,
                scale: 0.5,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: [
                  item.startPos.x - 24,
                  (item.startPos.x + cartPos.x) / 2,
                  cartPos.x - 12,
                ],
                y: [
                  item.startPos.y - 24,
                  Math.min(item.startPos.y, cartPos.y) - 100,
                  cartPos.y - 12,
                ],
                scale: [0.5, 1.2, 0.2],
                opacity: [0, 1, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                times: [0, 0.4, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => removeFlyingItem(item.id)}
              className="fixed w-12 h-12 rounded-full overflow-hidden shadow-[0_0_20px_rgba(129,18,9,0.4)] border-2 border-white bg-white"
            >
              <img
                src={item.image}
                alt="flying item"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-kaia-red/20 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
