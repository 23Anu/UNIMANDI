import React, { useState } from "react";
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  ShoppingBag,
  FileText,
  Copy,
  Check,
  Download
} from "lucide-react";

export const PickupPassModal = ({ isOpen, onClose, order }) => {
  const [viewMode, setViewMode] = useState("pass"); // "pass" | "receipt"
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const isPickedUp = order.status === "Picked Up";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-reveal-up">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden text-left my-6 flex flex-col">
        
        {/* Pass Top Banner */}
        <div className="bg-[#121417] text-white p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF5A1F]/20 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF7A45] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#FF5A1F]/30">
            <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
            <span>Official Campus Store Pass</span>
          </div>

          <h2 className="font-display font-extrabold text-xl text-white tracking-tight">
            UniMandi SAC Store
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Student Activity Center (SAC) Counter #2
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => setViewMode("pass")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === "pass"
                  ? "bg-[#FF5A1F] text-white shadow-xs"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Digital QR Pass</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode("receipt")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === "receipt"
                  ? "bg-[#FF5A1F] text-white shadow-xs"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Official Receipt</span>
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {viewMode === "pass" ? (
          <div className="p-6 text-center space-y-4">
            
            {/* QR Graphic Container with Animated Laser Scanner */}
            <div className="relative inline-block p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl shadow-md overflow-hidden group">
              
              {/* Laser Scanner Bar Moving Up & Down */}
              <div className="laser-scanner-line" />

              <svg
                className="w-44 h-44 mx-auto text-[#121417]"
                viewBox="0 0 200 200"
                fill="currentColor"
              >
                {/* QR Corners */}
                <rect x="15" y="15" width="45" height="45" rx="8" fill="#121417" />
                <rect x="25" y="25" width="25" height="25" rx="4" fill="white" />
                <rect x="30" y="30" width="15" height="15" rx="2" fill="#FF5A1F" />

                <rect x="140" y="15" width="45" height="45" rx="8" fill="#121417" />
                <rect x="150" y="25" width="25" height="25" rx="4" fill="white" />
                <rect x="155" y="30" width="15" height="15" rx="2" fill="#FF5A1F" />

                <rect x="15" y="140" width="45" height="45" rx="8" fill="#121417" />
                <rect x="25" y="150" width="25" height="25" rx="4" fill="white" />
                <rect x="30" y="155" width="15" height="15" rx="2" fill="#FF5A1F" />

                {/* Data Pattern Dots */}
                <rect x="75" y="20" width="12" height="12" rx="2" />
                <rect x="95" y="20" width="12" height="12" rx="2" fill="#FF5A1F" />
                <rect x="115" y="20" width="12" height="12" rx="2" />
                <rect x="75" y="40" width="12" height="12" rx="2" />
                <rect x="95" y="40" width="12" height="12" rx="2" />
                <rect x="115" y="40" width="12" height="12" rx="2" />

                <rect x="20" y="75" width="12" height="12" rx="2" fill="#FF5A1F" />
                <rect x="40" y="75" width="12" height="12" rx="2" />
                <rect x="20" y="95" width="12" height="12" rx="2" />
                <rect x="40" y="95" width="12" height="12" rx="2" fill="#FF5A1F" />

                <rect x="70" y="70" width="60" height="60" rx="8" fill="#121417" />
                <rect x="80" y="80" width="40" height="40" rx="4" fill="white" />
                <rect x="90" y="90" width="20" height="20" rx="2" fill="#FF5A1F" />

                <rect x="145" y="75" width="12" height="12" rx="2" />
                <rect x="165" y="75" width="12" height="12" rx="2" fill="#FF5A1F" />
                <rect x="145" y="95" width="12" height="12" rx="2" />
                <rect x="165" y="95" width="12" height="12" rx="2" />

                <rect x="75" y="145" width="12" height="12" rx="2" fill="#FF5A1F" />
                <rect x="95" y="145" width="12" height="12" rx="2" />
                <rect x="115" y="145" width="12" height="12" rx="2" fill="#FF5A1F" />
                <rect x="145" y="145" width="12" height="12" rx="2" />
                <rect x="165" y="145" width="12" height="12" rx="2" />
              </svg>

              {/* Token Text & Copy */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Pickup Token Code
                  </span>
                  <p className="font-mono font-black text-2xl text-[#121417] tracking-widest">
                    {order.pickupCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                  title="Copy token code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {isPickedUp ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified & Dispensed at Counter</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-500/30 animate-pulse">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Ready for Instant Pickup at SAC Counter</span>
                </span>
              )}
            </div>

            {/* Student & Item Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Student:</span>
                <strong className="text-[#121417]">{order.studentName} ({order.studentRoll})</strong>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Items to Pickup:</span>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-700 font-medium">
                    <span className="truncate max-w-[200px]">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-[#121417]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-slate-200 pt-2 font-bold text-sm text-[#121417]">
                <span>Total Paid:</span>
                <span className="text-[#FF5A1F]">₹{order.totalAmount} (Prepaid UPI)</span>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-500/30 text-left text-xs text-emerald-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-900">Campus Pickup Directions:</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  UniMandi SAC Counter #2, SAC Building (Near Central Canteen). Show this QR / Code on your phone to pick up items instantly.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* Official Printable Receipt View */
          <div className="p-6 text-left text-xs space-y-4 font-mono bg-slate-50/50">
            <div className="p-5 bg-white rounded-2xl border border-slate-300 shadow-xs space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h3 className="font-bold text-base text-[#121417]">
                  UNIMANDI SAC STORE & ESSENTIALS
                </h3>
                <p className="text-[11px] text-slate-500">Student Activity Center, NIT Campus</p>
                <p className="text-[10px] text-slate-400">GSTIN / Campus Auth: NIT/SAC/2026/KM02</p>
              </div>

              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span>Pass Token:</span>
                  <strong className="text-[#121417]">{order.pickupCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Student:</span>
                  <span>{order.studentName} ({order.studentRoll})</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{order.orderedAt ? new Date(order.orderedAt).toLocaleString() : new Date().toLocaleString()}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between text-[11px] font-bold text-[#121417]">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                    <span className="truncate max-w-[220px]">{it.quantity}x {it.name}</span>
                    <span>₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between font-bold text-sm text-[#121417]">
                  <span>NET TOTAL PAID:</span>
                  <span>₹{order.totalAmount}.00</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Payment Mode:</span>
                  <span className="text-emerald-600 font-bold">PREPAID VIA CAMPUS UPI</span>
                </div>
              </div>

              {/* Counter Stamp */}
              <div className="pt-3 border-t border-dashed border-slate-300 text-center">
                <span className="inline-block px-3 py-1 border-2 border-emerald-600 text-emerald-700 font-bold text-[10px] uppercase tracking-wider rounded-md transform -rotate-1">
                  OFFICIAL NIT STORE CERTIFIED
                </span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="btn-secondary w-full py-2.5 text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>Print Campus Receipt</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyCode}
            className="btn-secondary py-2.5 px-4 text-xs font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Code Copied" : "Copy Code"}</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary py-2.5 px-6 text-xs font-bold flex-1"
          >
            Done / Close Pass
          </button>
        </div>

      </div>
    </div>
  );
};

