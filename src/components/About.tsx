import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-kaia-cream overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000" 
                alt="Baker at work" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-kaia-red rounded-full flex items-center justify-center text-white text-center p-6 shadow-xl hidden md:flex">
              <p className="font-display text-3xl leading-tight">Est. 2012 <br /> in the Heart</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="font-script text-3xl text-kaia-red">Our Story</span>
            <h2 className="text-6xl md:text-7xl font-display leading-tight text-kaia-charcoal">
              The Soul of <br /> <span className="text-kaia-red">kaiapantry.</span>
            </h2>
            <div className="space-y-6 text-kaia-charcoal/80 font-light leading-relaxed text-lg">
              <p>
                Founded on the belief that food is a universal language of love. At kaiapantry, we don't just bake; we create memories.
              </p>
              <p>
                Our journey began in a small home kitchen with a single goal: to bring back the authentic, unhurried taste of traditional pantry staples. Today, we continue that legacy with every loaf and cake we craft.
              </p>
              <p>
                We source our ingredients from local artisans and organic farms, ensuring that every bite is as wholesome as it is delicious.
              </p>
            </div>
            
            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-kaia-tan">
              <div>
                <h4 className="font-display text-4xl mb-1 text-kaia-red">100%</h4>
                <p className="text-[10px] uppercase tracking-widest text-kaia-taupe font-bold">Organic Sourcing</p>
              </div>
              <div>
                <h4 className="font-display text-4xl mb-1 text-kaia-red">Daily</h4>
                <p className="text-[10px] uppercase tracking-widest text-kaia-taupe font-bold">Freshly Baked</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
