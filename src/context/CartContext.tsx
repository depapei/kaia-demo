import { createContext, useContext, useState, ReactNode } from "react";

export interface SliceOption {
  slices: number | string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  longDesc?: string;
  image: string;
  category: "Cakes" | "Pastries" | "Breads";
  sliceOptions?: string | SliceOption[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  slices?: number | string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, slices?: number | string, startPos?: { x: number, y: number }) => void;
  removeFromCart: (id: string, slices?: number | string) => void;
  updateQuantity: (id: string, delta: number, slices?: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  flyingItems: { id: string, image: string, startPos: { x: number, y: number } }[];
  removeFlyingItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flyingItems, setFlyingItems] = useState<{ id: string, image: string, startPos: { x: number, y: number } }[]>([]);

  const addToCart = (item: MenuItem, slices?: number | string, startPos?: { x: number, y: number }) => {
    if (startPos) {
      const flyId = `${item.id}-${Date.now()}`;
      setFlyingItems(prev => [...prev, { id: flyId, image: item.image, startPos }]);
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.slices === slices);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.slices === slices ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, slices }];
    });
  };

  const removeFlyingItem = (id: string) => {
    setFlyingItems(prev => prev.filter(item => item.id !== id));
  };

  const removeFromCart = (id: string, slices?: number | string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.slices === slices)));
  };

  const updateQuantity = (id: string, delta: number, slices?: number | string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.slices === slices ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        flyingItems,
        removeFlyingItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
