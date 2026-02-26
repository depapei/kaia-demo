import { motion } from "motion/react";
import { ArrowLeft, Truck, ShieldCheck, CheckCircle2, Download } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, FormEvent } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


interface CheckoutPageProps {
  onBack: () => void;
}

export default function CheckoutPage({ onBack }: CheckoutPageProps) {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price).replace("Rp", "Rp ");
  };

const downloadInvoice = () => {
  if (!lastTransaction) {
    alert("No transaction data");
    return;
  }

  try {
    const doc = new jsPDF();

    const items =
      typeof lastTransaction.items === "string"
        ? JSON.parse(lastTransaction.items)
        : lastTransaction.items;

    // Header
    doc.setFontSize(22);
    doc.text("KAIAPANTRY", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text("Artisanal Bakery & Treats", 105, 26, { align: "center" });

    doc.line(20, 35, 190, 35);

    // Info
    doc.setFontSize(12);
    doc.text(`Invoice: ${lastTransaction.id}`, 20, 45);
    doc.text(
      `Date: ${new Date(lastTransaction.createdAt).toLocaleDateString("id-ID")}`,
      20,
      52
    );

    doc.text("Bill To:", 20, 65);
    doc.setFontSize(10);
    doc.text(lastTransaction.customerName || "-", 20, 72);
    doc.text(lastTransaction.customerEmail || "-", 20, 77);
    doc.text(lastTransaction.address || "-", 20, 82);
    doc.text(
      `${lastTransaction.city || "-"}, ${lastTransaction.postalCode || "-"}`,
      20,
      87
    );

    const tableData = items.map((item: any) => [
      item.name + (item.slices ? ` (${item.slices} slices)` : ""),
      item.quantity,
      formatPrice(item.price),
      formatPrice(item.price * item.quantity),
    ]);

    // Table
    autoTable(doc, {
      startY: 100,
      head: [["Item", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [242, 125, 38] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 120;

    // Total
    doc.setFontSize(14);
    doc.text(
      `Total Amount: ${formatPrice(lastTransaction.totalPrice)}`,
      190,
      finalY + 20,
      { align: "right" }
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for choosing Kaiapantry!", 105, 280, {
      align: "center",
    });

    doc.save(`invoice-${lastTransaction.id}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
    alert("Failed to generate invoice PDF");
  }
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const customerName = formData.get("fullName") as string;
    const customerEmail = formData.get("email") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          customerName,
          customerEmail,
          address,
          city,
          postalCode,
          totalPrice,
          items: cart.map(item => ({ 
            id: item.id, 
            name: item.name, 
            quantity: item.quantity, 
            price: item.price,
            slices: item.slices 
          }))
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setLastTransaction(data.transaction);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-kaia-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border-8 border-kaia-tan/20"
        >
          <div className="w-24 h-24 bg-kaia-sage/20 text-kaia-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-5xl font-display mb-4 text-kaia-charcoal">Order Successful!</h2>
          <p className="text-kaia-taupe font-light mb-8">
            Thank you for your purchase. You can now download your invoice below.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={downloadInvoice}
              className="w-full bg-kaia-sage text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-kaia-charcoal transition-all shadow-lg"
            >
              <Download size={20} />
              Download Invoice
            </button>
            
            <button 
              onClick={() => {
                clearCart();
                onBack();
              }}
              className="w-full bg-kaia-cream text-kaia-taupe py-4 rounded-2xl font-bold hover:bg-kaia-tan transition-all"
            >
              Return to Pantry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaia-cream pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-kaia-taupe hover:text-kaia-red transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">Back to Pantry</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-kaia-tan/30">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-kaia-cream rounded-full flex items-center justify-center text-kaia-red">
                  <Truck size={24} />
                </div>
                <h2 className="text-4xl font-display text-kaia-charcoal">Shipping Information</h2>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">Full Name</label>
                  <input required name="fullName" type="text" className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">Email Address</label>
                  <input required name="email" type="email" className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">Shipping Address</label>
                  <input required name="address" type="text" className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all" placeholder="123 Bakery St, Flour District" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">City</label>
                  <input required name="city" type="text" className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all" placeholder="Paris" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">Postal Code</label>
                  <input required name="postalCode" type="text" className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all" placeholder="75004" />
                </div>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-kaia-tan/30 sticky top-32">
              <h2 className="text-3xl font-display mb-10 text-kaia-charcoal">Order Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.slices || 'none'}`} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-kaia-cream rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-kaia-charcoal">{item.name}</p>
                        <p className="text-[10px] text-kaia-taupe uppercase tracking-widest">
                          {item.quantity}x {formatPrice(item.price)}
                          {item.slices && ` (${item.slices} slices)`}
                        </p>
                      </div>
                    </div>
                    <span className="font-display text-xl text-kaia-charcoal">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-kaia-tan/30">
                <div className="flex justify-between text-sm text-kaia-taupe font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-kaia-taupe font-medium">
                  <span>Shipping</span>
                  <span className="text-kaia-sage font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-4xl font-display pt-4 text-kaia-red">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                className="w-full bg-kaia-red text-white py-5 rounded-2xl font-bold mt-10 hover:bg-kaia-charcoal transition-all shadow-xl flex items-center justify-center gap-3 group"
              >
                Place Order
                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-8 text-kaia-taupe">
                <ShieldCheck size={14} />
                <p className="text-[10px] text-kaia-taupe uppercase tracking-widest font-bold">
                  Secure Encrypted Checkout
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
