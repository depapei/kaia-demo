import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Check } from "lucide-react";
import { MenuItem, useCart } from "../context/CartContext";

interface ProductDetailModalProps {
  product: MenuItem | null;
  onClose: () => void;
}

const SLICE_OPTIONS = [3, 4, 10]; // This is now dynamic

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart } = useCart();

  const sliceOptions = useMemo(() => {
    if (!product?.sliceOptions) return [];
    return typeof product.sliceOptions === "string"
      ? JSON.parse(product.sliceOptions)
      : product.sliceOptions;
  }, [product?.sliceOptions]);

  const [selectedSlices, setSelectedSlices] = useState<number | string | null>(
    sliceOptions.length > 0 ? sliceOptions[0].id : null,
  );

  useEffect(() => {
    if (sliceOptions.length > 0) {
      setSelectedSlices(sliceOptions[0].id);
    }
  }, [sliceOptions]);

  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (!selectedSlices || sliceOptions.length === 0) return product.price;
    const option = sliceOptions.find(
      (opt: any) => opt.slices === selectedSlices,
    );
    return option ? option.price : product.price;
  }, [selectedSlices, sliceOptions, product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!product) return;
    const startPos = { x: e.clientX, y: e.clientY };
    const sliceObj = sliceOptions.filter(
      (slice) => slice.id === selectedSlices,
    )[0];
    addToCart(
      { ...product, price: currentPrice, id: sliceObj.id },
      sliceObj.slices || undefined,
      startPos,
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-kaia-charcoal/60 backdrop-blur-sm z-150"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white z-151 rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-kaia-charcoal hover:bg-kaia-red hover:text-white transition-all z-20 shadow-md"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto bg-kaia-tan/30 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent"></div>
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="mb-auto">
                <span className="text-kaia-red font-display text-2xl tracking-widest uppercase mb-2 block">
                  {product.category}
                </span>
                <h2 className="text-4xl md:text-6xl font-display text-kaia-charcoal mb-4 leading-tight">
                  {product.name}
                </h2>
                <p className="text-3xl font-display text-kaia-taupe mb-6">
                  {formatPrice(currentPrice)}
                </p>
                <div className="space-y-4 text-kaia-charcoal/80 font-light leading-relaxed">
                  <p className="text-lg font-medium italic text-kaia-sage">
                    "{product.desc}"
                  </p>
                  <p className="text-sm md:text-base">
                    {product.longDesc ||
                      "Handcrafted with the finest ingredients, our " +
                        product.name +
                        " is a testament to our passion for artisanal baking. Perfect for celebrations or a simple moment of indulgence."}
                  </p>
                </div>

                {sliceOptions.length > 0 && (
                  <div className="mt-8">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe block mb-3">
                      Select Slices
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {sliceOptions.map((option: any) => (
                        <button
                          key={option.slices}
                          onClick={() =>
                            setSelectedSlices(
                              option.slices === selectedSlices
                                ? null
                                : option.id,
                            )
                          }
                          className={`px-6 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                            selectedSlices === option.id
                              ? "border-kaia-red bg-kaia-red text-white shadow-lg"
                              : "border-kaia-tan/30 text-kaia-taupe hover:border-kaia-tan"
                          }`}
                        >
                          {option.slices}{" "}
                          {option.slices === "Full" ? "" : "Slices"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-kaia-cream/50 p-4 rounded-xl border border-kaia-tan/50">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe block mb-1">Ingredients</span>
                    <span className="text-xs font-medium">Premium Flour, Organic Eggs, Pure Butter</span>
                  </div>
                  <div className="bg-kaia-cream/50 p-4 rounded-xl border border-kaia-tan/50">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe block mb-1">Serving</span>
                    <span className="text-xs font-medium">Best served at room temperature</span>
                  </div>
                </div> */}
              </div>

              <div className="mt-10 flex gap-4 sticky bottom-0 bg-white pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`grow py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isAdded
                      ? "bg-kaia-sage text-white"
                      : "bg-kaia-red text-white hover:bg-kaia-charcoal"
                  }`}
                >
                  {isAdded ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      Added to Bag
                    </motion.div>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
