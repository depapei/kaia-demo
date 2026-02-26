import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-kaia-charcoal text-kaia-tan py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-5xl font-display text-white">kaia<span className="text-kaia-red">pantry</span></h2>
            <p className="max-w-sm text-kaia-taupe font-light leading-relaxed">
              Crafting artisanal moments of joy through handcrafted cakes and pantry staples. Made with love, shared with passion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-kaia-red transition-colors"><Instagram size={24} /></a>
              <a href="#" className="hover:text-kaia-red transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-kaia-red transition-colors"><Mail size={24} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">Visit Our Pantry</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-kaia-red" />
                <span>45 Artisans Lane <br /> Flour District, KA 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-kaia-red" />
                <span>+1 (555) KAIA-PAN</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">Pantry Hours</h4>
            <ul className="space-y-2 text-sm font-light">
              <li className="flex justify-between">
                <span>Mon - Sat</span>
                <span>8:00 - 19:00</span>
              </li>
              <li className="flex justify-between text-kaia-taupe">
                <span>Sunday</span>
                <span>Rest Day</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-kaia-taupe/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-kaia-taupe uppercase tracking-widest">
          <p>© {new Date().getFullYear()} kaiapantry. Handcrafted with care.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
