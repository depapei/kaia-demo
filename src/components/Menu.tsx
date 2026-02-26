import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart, MenuItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductDetailModal from "./ProductDetailModal";
import { Info, Search, Check, Heart, ShoppingBag } from "lucide-react";

const CATEGORIES = ["All", "Cakes", "Pastries", "Breads"];

interface MenuCardProps {
  item: MenuItem;
  onInfoClick: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onInfoClick }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  
  const sliceOptions = useMemo(() => {
    if (!item.sliceOptions) return [];
    return typeof item.sliceOptions === "string" 
      ? JSON.parse(item.sliceOptions) 
      : item.sliceOptions;
  }, [item.sliceOptions]);

  const [selectedSlices, setSelectedSlices] = useState<number | string | undefined>(
    sliceOptions.length > 0 ? sliceOptions[0].slices : undefined
  );
  
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkWishlist();
    }
  }, [isAuthenticated, user]);

  const currentPrice = useMemo(() => {
    if (!selectedSlices || sliceOptions.length === 0) return item.price;
    const option = sliceOptions.find((opt: any) => opt.slices === selectedSlices);
    return option ? option.price : item.price;
  }, [selectedSlices, sliceOptions, item.price]);

  const checkWishlist = async () => {
    const res = await fetch(`/api/wishlist/${user?.id}`);
    const data = await res.json();
    setIsWishlisted(data.some((p: any) => p.id === item.id));
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to add to wishlist");
      return;
    }
    if (isWishlisted) {
      await fetch(`/api/wishlist/${user?.id}/${item.id}`, { method: "DELETE" });
      setIsWishlisted(false);
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, productId: item.id }),
      });
      setIsWishlisted(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price).replace("Rp", "Rp ");
  };

  const handleAdd = () => {
    addToCart({ ...item, price: currentPrice }, selectedSlices);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-kaia-tan/30 flex flex-col hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={toggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isWishlisted ? "bg-kaia-red text-white" : "bg-white/90 text-kaia-taupe hover:text-kaia-red"
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => onInfoClick(item)}
            className="w-10 h-10 bg-white/90 text-kaia-taupe rounded-full flex items-center justify-center hover:text-kaia-red transition-all shadow-lg"
          >
            <Info size={18} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-kaia-charcoal px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-display text-kaia-charcoal leading-tight">{item.name}</h3>
          <span className="text-xl font-display text-kaia-red font-bold">{formatPrice(currentPrice)}</span>
        </div>
        
        <p className="text-kaia-taupe text-sm font-light mb-6 line-clamp-2">
          {item.longDesc || item.desc}
        </p>

        {sliceOptions.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-3">Select Slices</p>
            <div className="flex flex-wrap gap-2">
              {sliceOptions.map((opt: any) => (
                <button
                  key={opt.slices}
                  onClick={() => setSelectedSlices(opt.slices)}
                  className={`flex-1 min-w-[60px] py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedSlices === opt.slices 
                      ? "bg-kaia-red border-kaia-red text-white shadow-md" 
                      : "bg-kaia-cream/50 border-kaia-tan/30 text-kaia-taupe hover:border-kaia-tan"
                  }`}
                >
                  {opt.slices}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={handleAdd}
          disabled={isAdded}
          className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-auto ${
            isAdded ? "bg-kaia-sage text-white" : "bg-kaia-red text-white hover:bg-kaia-charcoal"
          }`}
        >
          {isAdded ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
              <Check size={20} />
              Added!
            </motion.div>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="font-script text-3xl text-kaia-taupe">Preparing the pantry...</p>
      </div>
    );
  }

  return (
    <section id="menu" className="py-24 px-6 bg-kaia-cream/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="font-script text-3xl text-kaia-red mb-2 block">Freshly Baked</span>
            <h2 className="text-6xl md:text-8xl font-display text-kaia-charcoal mb-4">Our Pantry Selection</h2>
            <p className="text-kaia-taupe text-lg font-light">Explore our curated collection of artisanal treats, baked fresh daily with love and the finest ingredients.</p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-kaia-taupe" size={20} />
            <input 
              type="text"
              placeholder="Search treats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-kaia-tan/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all text-kaia-charcoal shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                  ? "bg-kaia-red border-kaia-red text-white shadow-xl -translate-y-1" 
                  : "bg-white border-kaia-tan/30 text-kaia-taupe hover:border-kaia-tan"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onInfoClick={setSelectedProduct} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-kaia-tan/30">
            <p className="text-kaia-taupe font-script text-4xl">No treats found matching your search...</p>
          </div>
        )}
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
