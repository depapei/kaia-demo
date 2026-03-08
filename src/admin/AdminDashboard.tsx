import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  Package,
  History,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  PanelsTopLeftIcon,
} from "lucide-react";
import {
  useAdminProducts,
  useCreateAdminProduct,
} from "../features/admin/useAdminProducts";
import { useAdminTransactions } from "../features/admin/useAdminTransactions";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { Token } from "./AdminLogin";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  desc: string;
  longDesc: string;
  image: string;
  sliceOptions?: string | { slices: number | string; price: number }[];
}

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  totalPrice: number;
  items: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "transactions">(
    "products",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Cakes",
    desc: "",
    longDesc: "",
    image: "",
    sliceOptions: [] as { slices: number | string; price: number }[],
  });

  const navigate = useNavigate();
  const { data: products = [], refetch: refetchProducts } = useAdminProducts();
  const { data: transactions_raw = [] } = useAdminTransactions();
  const transactions = useMemo(() => {
    const trxs = transactions_raw;
    if (trxs !== null && trxs.length > 0) {
      return [...trxs].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return dateB.getTime() - dateA.getTime();
      });
    }

    return [];
  }, [transactions_raw]);
  const createProductMutation = useCreateAdminProduct();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminToken = jwtDecode<Token>(localStorage.getItem("adminToken"));
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      sliceOptions:
        formData.sliceOptions.length > 0 ? formData.sliceOptions : null,
      createdBy: adminToken.user_id,
    };

    if (editingProduct) {
      await api.put(`/admin/products/${editingProduct.id}`, productData);
      refetchProducts();
    } else {
      createProductMutation.mutate(productData);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "Cakes",
      desc: "",
      longDesc: "",
      image: "",
      sliceOptions: [],
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await api.delete(`/admin/products/${id}`);
        if (res.status === 200) {
          refetchProducts();
        } else {
          alert("Failed to delete product. Please try again.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    let sliceOptions = [];
    if (product.sliceOptions) {
      sliceOptions =
        typeof product.sliceOptions === "string"
          ? JSON.parse(product.sliceOptions)
          : product.sliceOptions;
    }
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      desc: product.desc,
      longDesc: product.longDesc,
      image: product.image,
      sliceOptions: sliceOptions,
    });
    setIsModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const token = localStorage.getItem("adminToken");
  const user = useMemo(() => {
    if (Object.keys(token).length > 0) {
      const user = jwtDecode(token);
      return user.sub;
    }
    return "?";
  }, [token]);
  const noSliceOptions = formData.sliceOptions.length === 0;
  return (
    <div className="min-h-screen bg-kaia-cream flex">
      {/* Sidebar */}
      <aside className="w-64 fixed h-screen bg-kaia-charcoal text-white p-8 flex flex-col">
        <div className="mb-12">
          <Link to="/" className="text-4xl font-display text-kaia-cream">
            kaia<span className="text-kaia-sage">pantry</span>
          </Link>
          <p className="text-sm text-kaia-taupe uppercase tracking-widest mt-2">
            Hello, {user}
          </p>
          <p className="text-xs text-kaia-taupe uppercase tracking-widest mt-2">
            Admin Panel
          </p>
        </div>

        <nav className="space-y-4 grow">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === "products" ? "bg-kaia-red text-white" : "text-kaia-taupe hover:text-white hover:bg-white/5"}`}
          >
            <Package size={20} />
            <span className="font-bold tracking-wide">Products</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === "transactions" ? "bg-kaia-red text-white" : "text-kaia-taupe hover:text-white hover:bg-white/5"}`}
          >
            <History size={20} />
            <span className="font-bold tracking-wide">Transactions</span>
          </button>
          <Link to="/">
            <button
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-kaia-taupe hover:text-white hover:bg-white/5`}
            >
              <PanelsTopLeftIcon size={20} />
              <span className="font-bold tracking-wide">Website</span>
            </button>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-kaia-taupe hover:text-white hover:bg-white/5 rounded-xl transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-bold tracking-wide">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="grow ms-64 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-6xl font-display text-kaia-charcoal">
            {activeTab === "products"
              ? "Manage Products"
              : "Transaction History"}
          </h2>
          {activeTab === "products" && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  price: "",
                  category: "Cakes",
                  desc: "",
                  longDesc: "",
                  image: "",
                  sliceOptions: [],
                });
                setIsModalOpen(true);
              }}
              className="bg-kaia-red text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-kaia-charcoal transition-all shadow-lg"
            >
              <Plus size={20} />
              Add Product
            </button>
          )}
        </header>

        {activeTab === "products" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {products !== null &&
              products.length > 0 &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-kaia-tan/30 flex gap-6 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-2xl"
                  />
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-kaia-red">
                          {product.category}
                        </span>
                        <h3 className="text-2xl font-display text-kaia-charcoal">
                          {product.name}
                        </h3>
                      </div>
                      <span className="font-display text-xl text-kaia-taupe">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="text-sm text-kaia-taupe line-clamp-1 mt-1 italic">
                      "{product.desc}"
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-kaia-cream text-kaia-taupe hover:text-kaia-red rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-kaia-cream text-kaia-taupe hover:text-kaia-red rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-kaia-tan/30 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-kaia-cream/50 border-bottom border-kaia-tan/30">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-kaia-taupe">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kaia-tan/20">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-kaia-cream/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-kaia-taupe">
                      {tx.id.split("-")[0]}...
                    </td>
                    <td className="px-6 py-4 text-sm text-kaia-charcoal">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-kaia-charcoal">
                        {tx.customerName}
                      </div>
                      <div className="text-xs text-kaia-taupe">
                        {tx.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-kaia-taupe max-w-50">
                      <div className="truncate font-bold">{tx.address}</div>
                      <div>
                        {tx.city}, {tx.postalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-kaia-red">
                      {formatPrice(tx.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-xs text-kaia-taupe">
                      {tx.items !== undefined &&
                        tx.items !== null &&
                        tx.items.length > 0 &&
                        tx.items.map((item: any) => (
                          <li>
                            {item.quantity}x {item.name}
                            {item.slices ? ` (${item.slices} slices)` : ""}
                          </li>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-kaia-charcoal/60 z-50 flex items-center justify-center p-6"
            // onClick={() => setIsModalOpen(false)}
            // aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-2xl rounded-4xl p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-kaia-taupe hover:text-kaia-red"
              >
                <X size={24} />
              </button>
              <h3 className="text-5xl font-display text-kaia-charcoal mb-8">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                      Price (IDR)
                    </label>
                    <input
                      onWheel={(e) => e.currentTarget.blur()}
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Breads">Breads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.longDesc}
                    onChange={(e) =>
                      setFormData({ ...formData, longDesc: e.target.value })
                    }
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20 h-32"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full bg-kaia-cream/30 border border-kaia-tan/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kaia-red/20"
                    required
                  />
                </div>

                {/* Slice Options Management */}
                <div className="border-t border-kaia-tan/30 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-kaia-taupe">
                      Slice Options
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (noSliceOptions) {
                          setFormData({
                            ...formData,
                            sliceOptions: [
                              ...formData.sliceOptions,
                              {
                                slices: "Full",
                                price: parseFloat(formData.price),
                              },
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            sliceOptions: [
                              ...formData.sliceOptions,
                              {
                                slices: "",
                                price: null,
                              },
                            ],
                          });
                        }
                      }}
                      className="text-kaia-red text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Option
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.sliceOptions.map((opt, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-end bg-kaia-cream/20 p-4 rounded-xl border border-kaia-tan/20"
                      >
                        <div className="grow grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] uppercase tracking-widest font-bold text-kaia-taupe mb-1">
                              Slices (e.g. 3, 10, Full)
                            </label>
                            <input
                              type="text"
                              value={opt.slices}
                              onChange={(e) => {
                                const newOptions = [...formData.sliceOptions];
                                newOptions[index].slices = e.target.value;
                                setFormData({
                                  ...formData,
                                  sliceOptions: newOptions,
                                });
                              }}
                              className="w-full bg-white border border-kaia-tan/30 rounded-lg px-3 py-2 text-sm"
                              placeholder="3 or Full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-widest font-bold text-kaia-taupe mb-1">
                              Price (IDR)
                            </label>
                            <input
                              type="number"
                              onWheel={(e) => e.currentTarget.blur()}
                              value={
                                formData.price &&
                                opt.slices.toUpperCase() === "FULL"
                                  ? formData.price
                                  : opt.price
                              }
                              onChange={(e) => {
                                const newOptions = [...formData.sliceOptions];
                                const newValue = e.target.value;
                                newOptions[index].price =
                                  newValue !== 0 ? parseInt(newValue) : null;
                                setFormData({
                                  ...formData,
                                  sliceOptions: newOptions,
                                });
                              }}
                              className={`${opt.slices.toUpperCase() === "FULL" && "hover:cursor-not-allowed"} w-full bg-white border border-kaia-tan/30 rounded-lg px-3 py-2 text-sm`}
                              disabled={opt.slices.toUpperCase() === "FULL"}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = formData.sliceOptions.filter(
                              (_, i) => i !== index,
                            );
                            setFormData({
                              ...formData,
                              sliceOptions: newOptions,
                            });
                          }}
                          className="p-2 text-kaia-taupe hover:text-kaia-red"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {formData.sliceOptions.length === 0 && (
                      <p className="text-xs text-kaia-taupe italic text-center py-2">
                        No slice options defined (standard product)
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={noSliceOptions}
                  className={`${noSliceOptions ? "hover:cursor-not-allowed bg-kaia-charcoal" : "bg-kaia-red"} w-full  text-white py-4 rounded-xl font-bold hover:bg-kaia-charcoal transition-all shadow-lg`}
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
