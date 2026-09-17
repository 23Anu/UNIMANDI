import React, { useState } from "react";
import {
  Store,
  ShoppingBag,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { PickupPassModal } from "./PickupPassModal";

const STORE_CATEGORIES = [
  "All",
  "Drawing & Drafting",
  "Lab Records & Manuals",
  "Notebooks & Stationery",
  "Electronics & Tech"
];

export const TanishStoreView = () => {
  const { currentUser } = useAuth();
  const { products, placeStoreOrder, studentOrders, activePickupPass, setActivePickupPass } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPassToView, setSelectedPassToView] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Campus Direct UPI");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            quantity: 1,
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayAndGeneratePass = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessingOrder(true);
    setTimeout(() => {
      const newOrder = placeStoreOrder(cart, paymentMethod);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsProcessingOrder(false);
      setSelectedPassToView(newOrder);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left animate-reveal-up pb-12">
      
      {/* Official Tanish Store Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121417] text-white p-6 sm:p-8 border border-slate-700 shadow-card">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF5A1F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A1F] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                <Store className="w-3.5 h-3.5" />
                <span>Official Campus Partner</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#10B981] text-[11px] font-bold border border-[#10B981]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NIT Certified Stationery</span>
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              UniMandi SAC Store — Digital Campus Counter
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Order lab manuals, mini drafters, A2 drawing sheets, records, and calculators online. Pay via Razorpay / UPI and show your <strong>Instant QR Pickup Pass</strong> at the counter to skip all long queues!
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>SAC Building (Near Canteen)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>9:00 AM – 7:30 PM Open</span>
              </span>
            </div>
          </div>

          {/* Quick Cart Summary Badge if items added */}
          {cart.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <p className="text-xs text-slate-300 font-medium">Cart: {totalCartItemsCount} items</p>
              <p className="font-display font-black text-2xl text-white my-1">
                ₹{totalCartAmount.toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="btn-primary w-full text-xs py-2 px-4 mt-2 font-bold shadow-md"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Checkout & Get Pass</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {STORE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-[#121417] text-white border-[#121417] shadow-xs"
                  : "bg-white hover:bg-slate-100 text-[#121417] border-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => {
          const cartItem = cart.find((item) => item.productId === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  {prod.isBestseller && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF5A1F] text-white shadow-sm">
                      Campus Bestseller
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                    In Stock ({prod.stockCount})
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {prod.category}
                  </span>

                  <h3 className="font-display font-bold text-sm sm:text-base text-[#121417] line-clamp-2 leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display font-black text-xl text-[#121417]">
                      ₹{prod.price}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{prod.originalPrice}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Official Rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart / Quantity controls */}
              <div className="p-4 pt-0">
                {cartItem ? (
                  <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      onClick={() => updateQuantity(prod.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white text-[#121417] flex items-center justify-center font-bold hover:bg-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-[#121417]">
                      {cartItem.quantity} in cart
                    </span>
                    <button
                      onClick={() => updateQuantity(prod.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[#FF5A1F] text-white flex items-center justify-center font-bold hover:bg-[#E04812]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(prod)}
                    className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Digital Pickup Pass</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Checkout Bottom Bar for Mobile / Sticky */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-xl mx-auto z-40 animate-reveal-up">
          <div className="p-4 bg-[#121417] text-white rounded-3xl shadow-modal border border-slate-700 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {totalCartItemsCount} Stationery Items Selected
              </span>
              <p className="font-display font-black text-xl text-white">
                Total: ₹{totalCartAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg"
            >
              <QrCode className="w-4 h-4" />
              <span>Get Digital Pickup QR</span>
            </button>
          </div>
        </div>
      )}

      {/* Student's Active Tanish Store Orders */}
      {studentOrders.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#121417] flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#FF5A1F]" />
              <span>Your UniMandi Store Pickup Passes</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {studentOrders.length} passes generated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-[#121417]">
                      {ord.pickupCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === "Picked Up"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-500/30"
                          : "bg-amber-50 text-amber-700 border border-amber-500/30"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {ord.items.length} items • ₹{ord.totalAmount} (Prepaid)
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPassToView(ord)}
                  className="btn-secondary text-xs py-2 px-3 shrink-0"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>View Pass</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-reveal-up">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-modal text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-[#121417] flex items-center gap-2">
                <Store className="w-5 h-5 text-[#FF5A1F]" />
                <span>Checkout & Generate Pickup Pass</span>
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-[#121417]"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs"
                >
                  <div className="truncate max-w-[200px]">
                    <p className="font-bold text-[#121417] truncate">{item.name}</p>
                    <span className="text-slate-400 text-[10px]">
                      {item.quantity} x ₹{item.price}
                    </span>
                  </div>
                  <strong className="text-[#121417]">
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="block font-bold uppercase text-slate-400 text-[10px]">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Campus Direct UPI", "Prepaid Student Card"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      paymentMethod === method
                        ? "bg-[#121417] text-white border-[#121417]"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Total & Place Order */}
            <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center text-sm font-bold">
              <span>Total Payable:</span>
              <span className="font-display text-xl text-[#FF5A1F]">
                ₹{totalCartAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="btn-secondary flex-1 text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handlePayAndGeneratePass}
                disabled={isProcessingOrder}
                className="btn-primary flex-1 text-xs py-2.5 font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                {isProcessingOrder ? (
                  <span>Generating Pass...</span>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Pay & Generate QR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Pass Modal */}
      <PickupPassModal
        isOpen={Boolean(selectedPassToView || activePickupPass)}
        order={selectedPassToView || activePickupPass}
        onClose={() => {
          setSelectedPassToView(null);
          setActivePickupPass(null);
        }}
      />

    </div>
  );
};
