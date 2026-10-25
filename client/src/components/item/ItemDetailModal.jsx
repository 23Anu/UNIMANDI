import React, { useState } from "react";
import {
  X,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Tag,
  Handshake,
  Check,
  Percent,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { StatusBadge, TypeBadge } from "../common/Badge";
import { SellerCard } from "./SellerCard";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useListings } from "../../context/ListingsContext";
import { UpiQrPayment } from "../common/UpiQrPayment";
import { PickupPassModal } from "../store/PickupPassModal";
import { storeApi } from "../../services/api";

export const ItemDetailModal = ({
  listing,
  isOpen,
  onClose,
  onOpenReportModal,
}) => {
  const { currentUser } = useAuth();
  const { startChat, makeOffer } = useChat();
  const { deleteListing, updateListingStatus } = useListings();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customOfferPrice, setCustomOfferPrice] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);

  if (!isOpen || !listing) return null;

  const isOwner = currentUser?.id === listing.userId;
  const isAvailable = listing.status === "Available" || listing.status === "Reserved";

  const originalPrice = listing.price || 0;
  const offerPresets = [
    { label: "10% OFF", amount: Math.round(originalPrice * 0.9) },
    { label: "15% OFF", amount: Math.round(originalPrice * 0.85) },
    { label: "20% OFF", amount: Math.round(originalPrice * 0.8) },
  ];

  const handleMessageSeller = async () => {
    onClose();
    await startChat(listing.id);
  };

  const handleSendOffer = async (offerAmount) => {
    if (!offerAmount || offerAmount <= 0) return;
    onClose();
    const chatId = await startChat(listing.id);
    if (chatId) {
      makeOffer(chatId, offerAmount);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on UniMandi Campus Marketplace!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Listing link copied to clipboard!");
    }
  };

  const handleGenerateListingPaymentPass = async () => {
    if (!listing) return;

    const amount = Number(listing.price || 0);
    const buyerName = currentUser?.name || "Campus Buyer";
    const buyerRoll = currentUser?.rollNo || `STU-${Math.floor(1000 + Math.random() * 9000)}`;

    setIsGeneratingPass(true);

    try {
      const orderPayload = {
        studentId: currentUser?.id || "guest",
        studentName: buyerName,
        studentRoll: buyerRoll,
        studentBranch: currentUser?.branch || "Campus Deal",
        items: [
          {
            productId: listing.id,
            name: listing.title || "Campus Item",
            price: amount,
            quantity: 1,
            category: listing.category || "Marketplace",
          },
        ],
        totalAmount: amount,
        paymentMethod: "UPI QR",
        paymentId: `listing_${Date.now()}`,
      };

      const res = await storeApi.createOrder(orderPayload);
      setGeneratedPass(
        res.order || {
          id: `listing_ord_${Date.now()}`,
          pickupCode: `UM-${Math.floor(100000 + Math.random() * 900000)}`,
          studentId: currentUser?.id || "guest",
          studentName: buyerName,
          studentRoll: buyerRoll,
          studentBranch: currentUser?.branch || "Campus Deal",
          items: orderPayload.items,
          totalAmount: amount,
          paymentMethod: "UPI QR",
          status: "Ready for Pickup",
          placedAt: new Date().toISOString(),
          pickupSlot: "Today, Counter Pickup (SAC Counter #2)",
          pickupLocation: "UniMandi SAC Counter #2",
          qrDataPayload: `UNIMANDI-LISTING-${Date.now()}-${currentUser?.id || "guest"}`,
        }
      );
      setShowPaymentModal(false);
    } catch (err) {
      const fallback = {
        id: `listing_ord_${Date.now()}`,
        pickupCode: `UM-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: currentUser?.id || "guest",
        studentName: buyerName,
        studentRoll: buyerRoll,
        studentBranch: currentUser?.branch || "Campus Deal",
        items: [
          {
            productId: listing.id,
            name: listing.title || "Campus Item",
            price: amount,
            quantity: 1,
            category: listing.category || "Marketplace",
          },
        ],
        totalAmount: amount,
        paymentMethod: "UPI QR",
        status: "Ready for Pickup",
        placedAt: new Date().toISOString(),
        pickupSlot: "Today, Counter Pickup (SAC Counter #2)",
        pickupLocation: "UniMandi SAC Counter #2",
        qrDataPayload: `UNIMANDI-LISTING-${Date.now()}-${currentUser?.id || "guest"}`,
      };
      setGeneratedPass(fallback);
      setShowPaymentModal(false);
    } finally {
      setIsGeneratingPass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden z-10 my-6 animate-reveal-up max-h-[92vh] flex flex-col text-left">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={listing.type} />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {listing.category}
            </span>
            {listing.subcategory && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-600">
                  {listing.subcategory}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#121417] transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#121417] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={(listing.images && listing.images[activeImageIndex]) || listing.image || (listing.images && listing.images[0])}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 right-3 flex items-center gap-2">
                {listing.isUrgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    Urgent Deal
                  </span>
                )}
                <StatusBadge status={listing.status} />
              </div>

              {listing.images && listing.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? listing.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === listing.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-[#FF5A1F] scale-105"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display font-black text-3xl text-[#121417]">
                ₹{listing.price != null ? Number(listing.price).toLocaleString("en-IN") : "0"}
              </span>
              {listing.type === "Rent" && listing.rentDuration && (
                <span className="text-sm text-slate-500 font-medium">
                  /{listing.rentDuration.replace("per ", "")}
                </span>
              )}
              {listing.type === "Sell" && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                  Open to Offer
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#121417] leading-snug">
              {listing.title}
            </h1>
          </div>

          {!isOwner && isAvailable && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-[#FF5A1F]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF5A1F]" />
                  <span className="font-display font-bold text-sm text-[#121417]">
                    Negotiate / Make an Offer (OLX Model)
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded-full">
                  Fast Handshake
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {offerPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendOffer(p.amount)}
                    className="p-2.5 rounded-xl bg-white border border-[#FF5A1F]/30 hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] text-center transition-all group shadow-xs active:scale-95"
                  >
                    <span className="text-[10px] font-bold text-[#FF5A1F] group-hover:text-white block">
                      {p.label}
                    </span>
                    <span className="font-display font-extrabold text-sm text-[#121417] group-hover:text-white">
                      ₹{p.amount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Enter custom offer price..."
                    value={customOfferPrice}
                    onChange={(e) => setCustomOfferPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                  />
                </div>
                <button
                  onClick={() => handleSendOffer(Number(customOfferPrice))}
                  disabled={!customOfferPrice || Number(customOfferPrice) <= 0}
                  className="btn-primary text-xs py-2 px-4 shadow-sm disabled:opacity-50"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Send Offer</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Condition
              </span>
              <span className="font-semibold text-[#121417]">{listing.condition}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Campus Meetup
              </span>
              <span className="font-semibold text-[#121417] truncate block">
                {listing.location}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Academic Relevance
              </span>
              <span className="font-semibold text-[#121417]">
                {listing.targetBranch || "All Branches"}
              </span>
            </div>

            {listing.genderTarget && listing.genderTarget !== "Any" && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  Hostel / PG Gender
                </span>
                <span className={`font-bold text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-0.5 ${listing.genderTarget === "Girls Only"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : listing.genderTarget === "Boys Only"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-purple-50 text-purple-700 border border-purple-200"
                }`}>
                  {listing.genderTarget === "Girls Only" ? "🌸 Girls Only" : listing.genderTarget === "Boys Only" ? "🔷 Boys Only" : "👥 Co-ed / Any"}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display font-bold text-sm text-[#121417] uppercase tracking-wider mb-2">
              Description & Details
            </h3>
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {listing.description || "No additional description provided."}
            </p>
          </div>

          <SellerCard seller={listing.seller} />

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-500/30 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>UniMandi Verified Handover Protocol</span>
            </div>
            <ul className="space-y-1 text-[11px] text-emerald-800 list-disc list-inside">
              <li>Meet in verified public campus spots (SAC, Central Library, Department Gate).</li>
              <li>Inspect item condition thoroughly before completing payment.</li>
              <li>Confirm deal in chat to boost your campus trust rating.</li>
            </ul>
          </div>

          {isOwner && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#121417] uppercase tracking-wider">
                  Manage Your Post Status
                </h4>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete "${listing.title}"?`)) {
                      deleteListing(listing.id);
                      onClose();
                    }
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors"
                >
                  Delete Listing
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Available", "Reserved", "Sold", "Rented Out"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateListingStatus(listing.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${listing.status === st
                      ? "bg-[#121417] text-white border-[#121417]"
                      : "bg-white hover:bg-slate-200 text-[#121417] border-slate-300"
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>Listing ID: {listing.id}</span>
            <button
              onClick={() => onOpenReportModal(listing)}
              className="hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report this post</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 backdrop-blur-sm shrink-0 flex items-center gap-3">
          {isOwner ? (
            <div className="w-full text-center text-xs text-slate-500 font-medium py-2">
              This is your listing. Use the status buttons above or check your messages.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 w-full">
              <button
                onClick={() => handleSendOffer(Math.round(originalPrice * 0.9))}
                disabled={!isAvailable && listing.status !== "Reserved"}
                className="btn-secondary py-3 text-xs sm:text-sm font-bold shadow-xs border-[#FF5A1F]/30 text-[#FF5A1F] hover:bg-orange-50"
              >
                <Tag className="w-4 h-4" />
                <span>Offer</span>
              </button>

              <button
                onClick={handleMessageSeller}
                disabled={!isAvailable && listing.status !== "Reserved"}
                className="btn-primary py-3 text-xs sm:text-sm font-bold shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={!isAvailable && listing.status !== "Reserved" && !isGeneratingPass}
                className="py-3 text-xs sm:text-sm font-bold shadow-md rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isGeneratingPass ? "Processing..." : "Pay Now"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-4 border border-slate-200 shadow-modal">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">UniMandi Checkout</p>
                <h3 className="text-base font-display font-extrabold text-[#121417]">Pay & Generate QR Pickup Pass</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Amount due</span>
                <span className="font-black text-[#121417]">₹{Number(listing.price || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">Securely pay through the official UniMandi checkout flow and receive a QR pickup pass for collection.</div>
            </div>

            <UpiQrPayment
              amount={Number(listing.price || 0)}
              description={`UniMandi Campus Purchase - ${listing.title || "Item"}`}
              accentColor="#FF5A1F"
              onPaymentConfirmed={async () => {
                await handleGenerateListingPaymentPass();
              }}
              onCancel={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}

      {generatedPass && (
        <PickupPassModal
          isOpen={Boolean(generatedPass)}
          onClose={() => setGeneratedPass(null)}
          order={generatedPass}
        />
      )}
    </div>
  );
};

