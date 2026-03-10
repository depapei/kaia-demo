import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../features/transactions/useTransactions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { Receipt, Package, Calendar, MapPin, DownloadIcon } from "lucide-react";
import { motion } from "motion/react";
import { downloadInvoice } from "../lib/helpers/DownloadInvoice";

export default function UserTransactionsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading } = useTransactions(user?.id);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-kaia-cream">
        <Navbar
          onCartClick={() => setIsCartOpen(true)}
          onHomeClick={() => navigate("/")}
        />
        <main className="grow flex items-center justify-center animate-pulse">
          <p className="font-script text-3xl text-kaia-taupe">
            Fetching your orders...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kaia-cream">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      <main className="grow pt-32 px-6 max-w-6xl mx-auto w-full pb-24">
        <div className="flex items-center gap-4 mb-12">
          <Receipt className="text-kaia-red" size={40} />
          <h1 className="text-6xl font-display text-kaia-charcoal">
            My Orders
          </h1>
        </div>

        {transactions === null || transactions.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-kaia-tan/30">
            <p className="text-kaia-taupe text-2xl font-light mb-8">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/#menu")}
              className="bg-kaia-red text-white px-10 py-4 rounded-2xl font-bold hover:bg-kaia-charcoal transition-all shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {transactions.length > 0 &&
              transactions.map((tx) => (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div
                    key={tx.id}
                    className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-kaia-tan/30"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-6 mb-8 pb-8 border-b border-kaia-tan/20">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                          Order ID
                        </p>
                        <p className="text-sm font-mono text-kaia-charcoal">
                          {tx.id}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                          Date
                        </p>
                        <div className="flex items-center gap-2 text-kaia-charcoal">
                          <Calendar size={14} />
                          <p className="text-sm">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                          Status
                        </p>
                        <span className="bg-kaia-sage/20 text-yellow-600 font-bold py-1 rounded-full text-[10px] uppercase tracking-widest">
                          {tx.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                          Total Amount
                        </p>
                        <p className="text-2xl font-display text-kaia-red">
                          {formatPrice(tx.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Package size={18} className="text-kaia-red" />
                          <h3 className="text-lg font-bold text-kaia-charcoal">
                            Items Ordered
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {tx.items !== null &&
                            tx.items.length > 0 &&
                            tx.items.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-kaia-charcoal">
                                  {item.quantity}x {item.name}
                                  {item.slices && (
                                    <span className="text-kaia-taupe ml-2">
                                      ({item.slices} slices)
                                    </span>
                                  )}
                                </span>
                                <span className="font-bold text-kaia-charcoal">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin size={18} className="text-kaia-red" />
                          <h3 className="text-lg font-bold text-kaia-charcoal">
                            Delivery Details
                          </h3>
                        </div>
                        <div className="text-sm text-kaia-taupe space-y-1">
                          <p className="font-bold text-kaia-charcoal">
                            {tx.customerName}
                          </p>
                          <p>{tx.address}</p>
                          <p>
                            {tx.city}, {tx.postalCode}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadInvoice(tx)}
                          className={`w-fit p-4 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-auto bg-kaia-red text-white hover:bg-kaia-charcoal`}
                        >
                          <>
                            <DownloadIcon size={18} />
                            Download Invoice
                          </>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </main>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => navigate("/checkout")}
      />
      <Footer />
    </div>
  );
}
