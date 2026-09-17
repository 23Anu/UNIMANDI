import React, { useState } from "react";
import {
  Store,
  QrCode,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
  Package,
  IndianRupee,
  Check,
  AlertCircle,
  Edit2,
  Trash2,
  ShieldCheck,
  X,
  Sparkles,
  Camera,
  ScanLine,
  Volume2
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

export const TanishMerchantDashboard = () => {
  const {
    orders,
    products,
    verifyAndDispenseOrder,
    addStoreProduct,
    updateStoreProduct,
    deleteStoreProduct,
  } = useStore();

  const [verifyCodeInput, setVerifyCodeInput] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const [activeTab, setActiveTab] = useState("queue"); // queue | inventory | fulfilled
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);

  // New Product Form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Drawing & Drafting");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("50");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState(
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
  );

  const pendingOrders = orders.filter((o) => o.status === "Pending Pickup");
  const fulfilledOrders = orders.filter((o) => o.status === "Picked Up");

  const totalSalesRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 chime
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleVerifyCode = (e, codeToVerify = null) => {
    e?.preventDefault();
    const code = codeToVerify || verifyCodeInput;
    if (!code || !code.trim()) return;

    playBeepSound();
    const result = verifyAndDispenseOrder(code);
    setVerificationResult(result);
    if (result.success) {
      setVerifyCodeInput("");
    }
  };

  const handleSimulateScan = (order) => {
    setIsScanningActive(true);
    setTimeout(() => {
      handleVerifyCode(null, order.pickupCode);
      setIsScanningActive(false);
      setIsScannerOpen(false);
    }, 900);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    addStoreProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: newProdOriginalPrice ? Number(newProdOriginalPrice) : null,
      stockCount: Number(newProdStock),
      description: newProdDesc,
      image: newProdImage,
      unit: "piece",
    });

    setIsAddProductOpen(false);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdOriginalPrice("");
    setNewProdDesc("");
  };

  return (
    <div className="space-y-6 text-left animate-reveal-up pb-12">
      
      {/* Merchant Header Bar */}
      <div className="bg-[#121417] text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-bold uppercase tracking-wider">
              <Store className="w-3 h-3" />
              <span>Merchant Terminal</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#10B981] text-[10px] font-bold border border-[#10B981]/30">
              <ShieldCheck className="w-3 h-3" />
              <span>Double Verification Active</span>
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            UniMandi SAC Store — Campus Manager Dashboard
          </h1>

          <p className="text-xs text-slate-300">
            Verify student pickup QR passes, manage official college stock, and monitor daily requests.
          </p>
        </div>

        {/* Quick Revenue Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto z-10">
          <span className="text-[10px] uppercase font-bold text-slate-300">
            Total Prepaid Revenue
          </span>
          <p className="font-display font-black text-2xl text-[#FF7A45] my-0.5">
            ₹{totalSalesRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">
            {fulfilledOrders.length} Handed Over • {pendingOrders.length} In Queue
          </span>
        </div>
      </div>

      {/* QUICK VERIFICATION SCANNER / CODE BOX (Double Verification) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-display font-bold text-lg text-[#121417] flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#FF5A1F]" />
              <span>Instant Student Token / QR Code Verifier</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the 6-digit code shown on student's phone or use the live camera scanner
            </p>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#121417] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs border border-slate-700"
          >
            <Camera className="w-4 h-4 text-[#FF5A1F]" />
            <span>Open Camera Scanner Simulation</span>
          </button>
        </div>

        <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={verifyCodeInput}
              onChange={(e) => setVerifyCodeInput(e.target.value)}
              placeholder="Enter student 6-digit code e.g. TN-849201 or 849201"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono font-bold text-[#121417] tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={!verifyCodeInput.trim()}
            className="btn-primary py-3 px-6 text-xs font-bold shadow-md shrink-0 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Dispense Items</span>
          </button>
        </form>

        {/* Verification Result Feedback */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border text-xs animate-reveal-up flex items-start justify-between gap-3 ${
              verificationResult.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-500/30"
                : "bg-rose-50 text-rose-800 border-rose-500/30"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {verificationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block text-sm font-bold">
                  {verificationResult.success ? "Pass Verified & Dispensed!" : "Verification Issue"}
                </strong>
                <p className="mt-0.5 leading-relaxed">{verificationResult.message}</p>
              </div>
            </div>

            <button
              onClick={() => setVerificationResult(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CAMERA QR SCANNER SIMULATION MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-reveal-up">
          <div className="relative w-full max-w-lg bg-[#121417] rounded-3xl border border-slate-700 p-6 text-white shadow-modal text-left space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FF5A1F] text-white">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Live Counter QR Scanner
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    SAC Counter Terminal Point-and-Scan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsScannerOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Graphic with Laser Beam */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border-2 border-dashed border-[#FF5A1F]/50 overflow-hidden flex flex-col items-center justify-center p-4">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#FF5A1F]" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#FF5A1F]" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#FF5A1F]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#FF5A1F]" />

              {/* Laser beam */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#FF5A1F] to-transparent shadow-[0_0_12px_#FF5A1F] animate-pulse" />

              {isScanningActive ? (
                <div className="text-center space-y-2 z-10 animate-pulse">
                  <ScanLine className="w-10 h-10 text-[#FF5A1F] mx-auto animate-spin" />
                  <p className="text-xs font-bold text-white">Reading QR Data & Verifying Token...</p>
                </div>
              ) : (
                <div className="text-center space-y-2 z-10">
                  <QrCode className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300">
                    Align student QR code within counter viewport
                  </p>
                </div>
              )}
            </div>

            {/* Pending Passes to Simulate Instant Scan */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Tap Any Active Student Pass to Simulate Scan:
              </span>

              {pendingOrders.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No pending student passes in queue right now.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {pendingOrders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => handleSimulateScan(ord)}
                      className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-[#FF5A1F]/20 border border-white/10 text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#FF7A45]">
                            {ord.pickupCode}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {ord.studentName} ({ord.studentRoll})
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {ord.items.length} items • ₹{ord.totalAmount}
                        </p>
                      </div>

                      <span className="text-[10px] bg-[#FF5A1F] text-white px-2 py-1 rounded-lg font-bold group-hover:scale-105 transition-transform">
                        Scan Pass
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "queue"
                ? "bg-[#121417] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-4 h-4 text-[#FF5A1F]" />
            <span>Pending Pickup Queue ({pendingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-[#121417] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stationery Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("fulfilled")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "fulfilled"
                ? "bg-[#121417] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Handed Over Logs ({fulfilledOrders.length})</span>
          </button>
        </div>

        {activeTab === "inventory" && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 font-bold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Stationery Item</span>
          </button>
        )}
      </div>

      {/* TAB 1: Pending Pickup Queue */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              All student orders are fulfilled! No pending pickup queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-lg text-[#121417] bg-slate-100 px-2.5 py-1 rounded-xl">
                        {ord.pickupCode}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Pickup
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Student:</span>
                      <p className="font-bold text-[#121417] text-sm">
                        {ord.studentName} ({ord.studentRoll})
                      </p>
                      <p className="text-slate-500 text-[11px]">{ord.studentBranch}</p>
                    </div>

                    {/* Ordered Items List */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Items to Hand Over:
                      </span>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700 font-semibold">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-[#121417]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Payment:</span>
                      <strong className="text-emerald-600 text-xs">
                        ₹{ord.totalAmount} (Prepaid Verified)
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        const res = verifyAndDispenseOrder(ord.pickupCode);
                        setVerificationResult(res);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Dispense & Confirm</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Stationery Inventory Manager */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block truncate">
                      {prod.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-[#121417] truncate">
                      {prod.name}
                    </h4>
                    <span className="font-bold text-sm text-[#121417]">₹{prod.price}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                  <span className="text-slate-500">Live Stock:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateStoreProduct(prod.id, {
                          stockCount: Math.max(0, prod.stockCount - 5),
                        })
                      }
                      className="w-6 h-6 rounded bg-slate-200 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold px-2">{prod.stockCount}</span>
                    <button
                      onClick={() =>
                        updateStoreProduct(prod.id, {
                          stockCount: prod.stockCount + 5,
                        })
                      }
                      className="w-6 h-6 rounded bg-slate-200 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-emerald-600 font-bold">
                  {prod.stockCount > 0 ? "Available" : "Out of Stock"}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${prod.name} from UniMandi Store?`)) {
                      deleteStoreProduct(prod.id);
                    }
                  }}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Fulfilled / Handed Over Logs */}
      {activeTab === "fulfilled" && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card">
          <div className="divide-y divide-slate-100">
            {fulfilledOrders.map((ord) => (
              <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#121417]">{ord.pickupCode}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      Verified & Picked Up
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Student: <strong>{ord.studentName}</strong> ({ord.studentRoll}) • {ord.studentBranch}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Items: {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display font-bold text-sm text-[#121417] block">
                    ₹{ord.totalAmount}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(ord.verifiedAt || ord.orderedAt) ? new Date(ord.verifiedAt || ord.orderedAt).toLocaleString() : "Just now"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Stationery Item Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-reveal-up">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-modal text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-[#121417]">
                Add Stationery Item to UniMandi Store
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-[#121417]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A2 Sheet Folder or Lab Coat"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Drawing & Drafting">Drawing & Drafting</option>
                    <option value="Lab Records & Manuals">Lab Records & Manuals</option>
                    <option value="Notebooks & Stationery">Notebooks & Stationery</option>
                    <option value="Electronics & Tech">Electronics & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Official college specifications, paper thickness, brand..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 font-bold shadow-xs"
                >
                  Save to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
