import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "Artisanal Baking",
    subtitle: "Handcrafted with Love",
    description:
      "Every treat in our pantry is baked fresh daily using traditional methods and organic ingredients.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    color: "bg-kaia-cream",
  },
  {
    id: 2,
    title: "Pure Ingredients",
    subtitle: "Nature's Finest",
    description:
      "We source only the best organic flour, farm-fresh eggs, and pure butter for that authentic home-baked taste.",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=1200",
    color: "bg-kaia-tan",
  },
  {
    id: 3,
    title: "Shared Moments",
    subtitle: "Joy in Every Crumb",
    description:
      "Whether it's a celebration or a quiet afternoon, our treats are made to be shared and savored.",
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=1200",
    color: "bg-kaia-sage",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      handleComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-kaia-charcoal z-200 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns effect */}
          <motion.img
            initial={{ scale: 1.1, filter: "brightness(0.7) blur(2px)" }}
            animate={{ scale: 1, filter: "brightness(0.5) blur(0px)" }}
            transition={{ duration: 10, ease: "linear" }}
            src={SLIDES[currentSlide].image}
            alt={SLIDES[currentSlide].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <span className="text-3xl font-display text-white tracking-tighter">
          kaia<span className="text-kaia-red">pantry</span>
        </span>
        <button
          onClick={handleComplete}
          className="text-xs uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors"
        >
          Skip Experience
        </button>
      </div>

      {/* Content Area */}
      <div className="relative grow flex flex-col items-center justify-center px-6 text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-script text-4xl text-kaia-red mb-6 block"
            >
              {SLIDES[currentSlide].subtitle}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-8xl md:text-[10rem] font-display text-white mb-8 leading-[0.8] tracking-tight"
            >
              {SLIDES[currentSlide].title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-4xl max-w-xl mx-auto"
            >
              <p className="text-white/90 text-lg font-light leading-relaxed">
                {SLIDES[currentSlide].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 p-8 md:p-12 flex flex-col items-center gap-8">
        {/* Progress Dots */}
        <div className="flex gap-3">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentSlide
                  ? "w-12 bg-kaia-red"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="group relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-kaia-red blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white text-kaia-charcoal px-16 py-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-kaia-red hover:text-white transition-all duration-500 shadow-2xl overflow-hidden">
            <span className="relative z-10 text-lg uppercase tracking-widest">
              {currentSlide === SLIDES.length - 1
                ? "Enter the Pantry"
                : "Continue Journey"}
            </span>
            <ArrowRight
              size={20}
              className="relative z-10 group-hover:translate-x-2 transition-transform"
            />
          </div>
        </button>
      </div>

      {/* Decorative side text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <span className="writing-mode-vertical text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">
          EST. 2024 — ARTISANAL BAKERY
        </span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <span className="writing-mode-vertical text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">
          SCROLL TO EXPLORE — {currentSlide + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}
