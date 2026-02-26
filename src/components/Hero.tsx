import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6 bg-kaia-cream">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=2000"
          alt="Artisanal bakery background"
          className="w-full h-full object-cover opacity-10 grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="font-script text-4xl text-kaia-red">Handcrafted with Love</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-8xl md:text-9xl lg:text-[12rem] font-display leading-[0.8] mb-12 text-kaia-charcoal"
        >
          kaia<span className="text-kaia-red">pantry</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl text-kaia-taupe max-w-xl mx-auto mb-12 font-light tracking-wide"
        >
          Where every crumb tells a story of tradition, patience, and the finest organic ingredients.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <a 
            href="#menu" 
            className="inline-flex items-center justify-center gap-2 bg-kaia-red text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-kaia-charcoal transition-all duration-300 group shadow-xl"
          >
            Explore the Pantry
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#about" 
            className="inline-flex items-center justify-center gap-2 bg-white text-kaia-charcoal border-2 border-kaia-tan px-10 py-4 rounded-2xl text-lg font-bold hover:bg-kaia-cream transition-all duration-300"
          >
            Our Story
          </a>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-kaia-red/30 animate-pulse" />
      </motion.div>
    </section>
  );
}
