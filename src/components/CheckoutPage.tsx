import { motion } from "motion/react";
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Download,
} from "lucide-react";
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
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const downloadInvoice = () => {
    if (!lastTransaction) {
      alert("No transaction data");
      return;
    }

    try {
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background color (Kaia Cream: #f0e8dc)
      doc.setFillColor(240, 232, 220); 
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Decorative Background Blobs (Kaia Tan: #e5d3c2)
      doc.setFillColor(229, 211, 194); 
      doc.circle(20, 20, 40, "F"); // Top left blob
      doc.circle(pageWidth - 20, 60, 30, "F"); // Middle right blob
      doc.circle(40, pageHeight - 30, 50, "F"); // Bottom left blob
      doc.circle(pageWidth - 30, pageHeight - 10, 40, "F"); // Bottom right blob

      const items =
        typeof lastTransaction.items === "string"
          ? JSON.parse(lastTransaction.items)
          : lastTransaction.items;

      // Header Section
      doc.setTextColor(129, 18, 9); // Kaia Red: #811209
      doc.setFontSize(36);
      doc.setFont("times", "bolditalic");
      doc.text("KAIAPANTRY", pageWidth / 2, 30, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(76, 75, 68); // Kaia Charcoal: #4c4b44
      doc.text("ARTISANAL BAKERY & TREATS", pageWidth / 2, 38, { align: "center" });

      doc.setDrawColor(129, 18, 9); // Kaia Red
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 20, 42, pageWidth / 2 + 20, 42);

      // Invoice Details & Bill To Section
      doc.setTextColor(76, 75, 68); // Kaia Charcoal
      
      // Left Column: Invoice Details
      doc.setFontSize(14);
      doc.setFont("times", "bolditalic");
      doc.text("Invoice Details", 25, 65);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(175, 159, 143); // Kaia Taupe: #af9f8f
      doc.text(`Invoice Date: ${lastTransaction.createdAt}`, 25, 73);
      doc.text(`Due Date: ${lastTransaction.createdAt}`, 25, 78);
      doc.text(`Invoice No: #${lastTransaction.id.split("-")[0].toUpperCase()}`, 25, 83);

      // Right Column: Bill To
      doc.setTextColor(129, 18, 9); // Kaia Red
      doc.setFontSize(14);
      doc.setFont("times", "bolditalic");
      doc.text(`To: ${lastTransaction.customerName || "Valued Customer"}`, pageWidth - 25, 65, { align: "right" });
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(175, 159, 143); // Kaia Taupe
      doc.text(lastTransaction.customerEmail || "-", pageWidth - 25, 73, { align: "right" });
      doc.text(lastTransaction.address || "-", pageWidth - 25, 78, { align: "right" });
      doc.text(`${lastTransaction.city || "-"}, ${lastTransaction.postalCode || "-"}`, pageWidth - 25, 83, { align: "right" });

      // Table Section
      const tableData = items.map((item: any) => [
        { content: item.name, styles: { fontStyle: 'bold', textColor: [129, 18, 9] } },
        item.slices ? `${item.slices} Slices` : "Standard",
        item.quantity,
        formatPrice(item.price),
        formatPrice(item.price * item.quantity),
      ]);

      autoTable(doc, {
        startY: 100,
        head: [["Item Description", "Option", "Qty", "Unit Price", "Amount"]],
        body: tableData,
        theme: "plain",
        headStyles: { 
          fillColor: [190, 194, 151], // Kaia Sage: #bec297
          textColor: [76, 75, 68], // Kaia Charcoal
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 6
        },
        bodyStyles: { 
          fontSize: 9, 
          textColor: [76, 75, 68], // Kaia Charcoal
          cellPadding: 6,
          fillColor: [240, 232, 220] // Kaia Cream
        },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [229, 211, 194] // Kaia Tan: #e5d3c2
        }
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 140;

      // Payment Method Section
      doc.setFontSize(12);
      doc.setFont("times", "bolditalic");
      doc.setTextColor(129, 18, 9); // Kaia Red
      doc.text("Payment Method", 25, finalY + 20);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(175, 159, 143); // Kaia Taupe
      doc.text("Account : 1234 5678 9101", 25, finalY + 28);
      doc.text(`A/C Name : ${lastTransaction.customerName || "Customer"}`, 25, finalY + 33);
      doc.text("Bank Name : Kaiapantry Central Bank", 25, finalY + 38);

      // Summary Section
      const summaryX = pageWidth - 25;
      const labelX = pageWidth - 85; // Increased space for labels

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(175, 159, 143); // Kaia Taupe
      doc.text("Sub Total", labelX, finalY + 20);
      doc.text(formatPrice(lastTransaction.totalPrice), summaryX, finalY + 20, { align: "right" });

      doc.text("Tax 0%", labelX, finalY + 28);
      doc.text(formatPrice(0), summaryX, finalY + 28, { align: "right" });

      // Grand Total Section - Unified Bar Design
      const barY = finalY + 35;
      const barHeight = 14;
      const barWidth = summaryX - labelX + 15;
      
      doc.setFillColor(129, 18, 9); // Kaia Red
      doc.rect(labelX - 5, barY, barWidth, barHeight, "F");
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(240, 232, 220); // Kaia Cream
      
      // Center text vertically in the bar
      const textY = barY + 9;
      doc.text("GRAND TOTAL", labelX, textY);
      doc.text(formatPrice(lastTransaction.totalPrice), summaryX, textY, { align: "right" });

      // Footer Section
      doc.setFontSize(10);
      doc.setFont("times", "italic");
      doc.setTextColor(175, 159, 143); // Kaia Taupe
      doc.text("Thank you for choosing Kaiapantry!", pageWidth / 2, pageHeight - 25, {
        align: "center",
      });
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Artisanal Treats Baked with Love", pageWidth / 2, pageHeight - 18, {
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
    const createdAt = new Date().toLocaleDateString("id-ID") as string;

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
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            slices: item.slices,
          })),
        }),
      });

      const data = await response.json();
      data.transaction.createdAt = createdAt;
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
          <h2 className="text-5xl font-display mb-4 text-kaia-charcoal">
            Order Successful!
          </h2>
          <p className="text-kaia-taupe font-light mb-8">
            Thank you for your purchase. You can now download your invoice
            below.
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
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs uppercase tracking-widest font-bold">
            Back to Pantry
          </span>
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-kaia-tan/30">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-kaia-cream rounded-full flex items-center justify-center text-kaia-red">
                  <Truck size={24} />
                </div>
                <h2 className="text-4xl font-display text-kaia-charcoal">
                  Shipping Information
                </h2>
              </div>

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                    Full Name
                  </label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                    Email Address
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                    Shipping Address
                  </label>
                  <input
                    required
                    name="address"
                    type="text"
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all"
                    placeholder="123 Bakery St, Flour District"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                    City
                  </label>
                  <input
                    required
                    name="city"
                    type="text"
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all"
                    placeholder="Paris"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                    Postal Code
                  </label>
                  <input
                    required
                    name="postalCode"
                    type="text"
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 transition-all"
                    placeholder="75004"
                  />
                </div>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-kaia-tan/30 sticky top-32">
              <h2 className="text-3xl font-display mb-10 text-kaia-charcoal">
                Order Summary
              </h2>

              <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.slices || "none"}`}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-kaia-cream rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-kaia-charcoal">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-kaia-taupe uppercase tracking-widest">
                          {item.quantity}x {formatPrice(item.price)}
                          {item.slices && ` (${item.slices} slices)`}
                        </p>
                      </div>
                    </div>
                    <span className="font-display text-xl text-kaia-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
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
                <ShieldCheck
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
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
