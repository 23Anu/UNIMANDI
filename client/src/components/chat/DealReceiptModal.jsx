import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  User,
  Sparkles,
  Download,
  Copy,
  Check,
  Building2,
  FileCheck
} from "lucide-react";

const formatINR = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return "0";
  return Number(val).toLocaleString("en-IN");
};

export const DealReceiptModal = ({ isOpen, onClose, chat, onOpenRating }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !chat) return null;

  const dealId = `KM-DEAL-${(chat.id || "000").replace("chat_", "").substring(0, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const finalPrice = Number(chat.finalAmount || chat.activeOffer?.amount || chat.listing?.price || 0);
  const originalPrice = Number(chat.listing?.price || finalPrice);
  const discountAmount = originalPrice > finalPrice ? originalPrice - finalPrice : 0;
  const discountPercent = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

  const completedTime = chat.dealConfirmation?.completedAt 
    ? new Date(chat.dealConfirmation.completedAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

  const handleCopyPass = () => {
    navigator.clipboard.writeText(
      `UniMandi Verified Deal Receipt\nRef: ${dealId}\nItem: ${chat.listing?.title}\nAgreed Price: ₹${finalPrice}\nSeller: ${chat.otherUser?.name}\nDate: ${completedTime}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-reveal-up">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden text-left">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#121417] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base tracking-tight flex items-center gap-1.5">
                <span>UniMandi Deal Pass</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">Verified Peer Handoff Receipt</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-500/30 text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Deal Sealed & Confirmed</p>
                <p className="text-[10px] text-emerald-700">Both parties verified the item on campus</p>
              </div>
            </div>
            <span className="font-mono text-[10px] font-extrabold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
              {dealId}
            </span>
          </div>

          {/* Item details */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Item Summary</span>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#121417] leading-tight line-clamp-2">
                  {chat.listing?.title || "Campus Listing"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{chat.listing?.category || "Marketplace"}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display font-black text-lg text-emerald-600 block">
                  ₹{formatINR(finalPrice)}
                </span>
                {discountAmount > 0 && (
                  <span className="text-[10px] text-slate-400 line-through block">
                    ₹{formatINR(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {discountAmount > 0 && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                <span>Negotiated Savings:</span>
                <span>₹{formatINR(discountAmount)} ({discountPercent}% discount)</span>
              </div>
            )}
          </div>

          {/* Verification Meta */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Campus Peer</span>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-800 truncate">{chat.otherUser?.name || "Student"}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                {chat.otherUser?.branch || "Campus Engineering"}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Handoff Spot</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-800 truncate">{chat.listing?.location || "Campus Quad / SAC"}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                {completedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenRating) {
                  onOpenRating({
                    listingId: chat.listingId,
                    targetUserId: chat.otherUser?.id,
                    targetUserName: chat.otherUser?.name,
                  });
                }
              }}
              className="w-full py-3 rounded-2xl bg-[#121417] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Leave Campus Rating & Trust Review</span>
            </button>

            <button
              onClick={handleCopyPass}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Receipt Details Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Receipt Summary</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
