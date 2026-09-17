import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ShieldCheck,
  CheckCheck,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft,
  Tag,
  Handshake,
  Check,
  X,
  RotateCcw,
  ExternalLink,
  MapPin,
  SlidersHorizontal,
  DollarSign,
  FileCheck,
  ChevronDown,
  Info,
  Flame
} from "lucide-react";
import { QuickReplies } from "./QuickReplies";
import { DealReceiptModal } from "./DealReceiptModal";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useListings } from "../../context/ListingsContext";
import { StatusBadge } from "../common/Badge";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

const formatINR = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return "0";
  return Number(val).toLocaleString("en-IN");
};

export const MessageThread = ({ chat, onBack, onOpenRatingModal }) => {
  const { currentUser } = useAuth();
  const { sendMessage, makeOffer, respondToOffer, confirmDeal, isTyping } = useChat();
  const { updateListingStatus } = useListings();

  if (!chat) return null;

  const currentUserId = currentUser?.id || "guest";
  const [inputMessage, setInputMessage] = useState("");
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  const listingPrice = chat.listing?.price ? Number(chat.listing.price) : 0;
  const currentProposed = (chat.activeOffer?.amount != null) 
    ? Number(chat.activeOffer.amount) 
    : (listingPrice > 0 ? Math.round(listingPrice * 0.9) : 100);

  const [negotiatePrice, setNegotiatePrice] = useState(currentProposed);
  const [offerNote, setOfferNote] = useState("");
  const [isSettingFinal, setIsSettingFinal] = useState(false);
  const [counterPriceInput, setCounterPriceInput] = useState("");
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterNote, setCounterNote] = useState("");

  const messagesEndRef = useRef(null);

  const isBuyer = chat.buyerId === currentUserId;
  const isSeller = chat.sellerId === currentUserId;

  const userConfirmed = isBuyer
    ? chat.dealConfirmation?.buyerConfirmed
    : chat.dealConfirmation?.sellerConfirmed;

  const otherConfirmed = isBuyer
    ? chat.dealConfirmation?.sellerConfirmed
    : chat.dealConfirmation?.buyerConfirmed;

  const isBothConfirmed =
    Boolean(chat.dealConfirmation?.buyerConfirmed && chat.dealConfirmation?.sellerConfirmed);

  const finalAgreedAmount = chat.finalAmount || (chat.activeOffer?.status === "accepted" && chat.activeOffer?.amount != null ? chat.activeOffer.amount : null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, isTyping]);

  useEffect(() => {
    if (chat.activeOffer?.amount != null) {
      setNegotiatePrice(Number(chat.activeOffer.amount));
    } else if (chat.listing?.price) {
      setNegotiatePrice(Math.round(Number(chat.listing.price) * 0.85));
    }
  }, [chat.activeOffer?.amount, chat.listing?.price]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(chat.id, inputMessage);
    setInputMessage("");
  };

  const handlePromptSelect = (prompt) => {
    sendMessage(chat.id, prompt);
  };

  const handleSubmitNegotiation = (asFinal = false) => {
    if (!negotiatePrice || Number(negotiatePrice) <= 0) return;
    makeOffer(chat.id, Number(negotiatePrice), offerNote, asFinal);
    setShowNegotiationModal(false);
    setOfferNote("");
  };

  const handleDirectLockDeal = () => {
    const targetPrice = finalAgreedAmount || chat.activeOffer?.amount || chat.listing?.price || 0;
    confirmDeal(chat.id, targetPrice);
  };

  const handleToggleReserved = () => {
    if (chat.listing) {
      const nextStatus = chat.listing.status === "Reserved" ? "Available" : "Reserved";
      updateListingStatus(chat.listing.id, nextStatus);
    }
  };

  // Calculate discount specs
  const numNegotiatePrice = Number(negotiatePrice) || 0;
  const discountAmount = listingPrice > numNegotiatePrice ? listingPrice - numNegotiatePrice : 0;
  const discountPercent = listingPrice > 0 ? Math.round((discountAmount / listingPrice) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#FAFBFD] text-left min-w-0 overflow-hidden relative">
      
      {/* 1. TOP HEADER: Peer Profile + Listing Info & Negotiate Trigger */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 gap-3 shadow-2xs">
        {/* Left: Peer Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-[#121417] md:hidden shrink-0"
              title="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            <img
              src={chat.otherUser?.avatar || DEFAULT_AVATAR}
              alt={chat.otherUser?.name || "Student"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm text-[#121417] truncate">
                {chat.otherUser?.name || "Campus Student"}
              </h3>
              {chat.otherUser?.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" title="Verified Campus Student" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {chat.otherUser?.branch || "Campus Engineering"} • {isBuyer ? "Seller" : "Buyer"}
            </p>
          </div>
        </div>

        {/* Right: Item Miniature Preview & Price Negotiation Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 truncate max-w-[110px] lg:max-w-[160px]">
              {chat.listing?.title || "Campus Item"}
            </span>
            <span className="font-extrabold text-[#121417] bg-white px-2 py-0.5 rounded-md border border-slate-200">
              ₹{formatINR(chat.listing?.price)}
            </span>
          </div>

          {/* Negotiate / Change Price Trigger (Available for both Buyer and Seller) */}
          {!isBothConfirmed && (
            <button
              onClick={() => setShowNegotiationModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#E04F1A] hover:brightness-105 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Negotiate / Set Price</span>
              <span className="sm:hidden">Price</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC DEAL FINALIZATION RIBBON */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs shrink-0 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Status:</span>
          <StatusBadge status={chat.listing?.status || "Available"} />
          
          {/* Final Agreed Price display */}
          {finalAgreedAmount != null ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-500/40 text-emerald-800 font-bold text-xs animate-reveal-up">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agreed Deal: ₹{formatINR(finalAgreedAmount)}</span>
            </div>
          ) : (chat.activeOffer?.status === "pending" && chat.activeOffer?.amount != null) ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-400/40 text-orange-800 font-bold text-xs">
              <Handshake className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Pending Offer: ₹{formatINR(chat.activeOffer.amount)}</span>
            </div>
          ) : null}

          {/* Location meetup pill */}
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[130px]">{chat.listing?.location || "Campus Quad"}</span>
          </span>
        </div>

        {/* Action Controls on the Right */}
        <div className="flex items-center gap-2 shrink-0">
          {isSeller && !isBothConfirmed && (
            <button
              onClick={handleToggleReserved}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-[#121417] border border-slate-200 transition-colors"
            >
              {chat.listing?.status === "Reserved" ? "Unreserve" : "Reserve Post"}
            </button>
          )}

          {/* Two-Sided Deal Locking Button */}
          {!isBothConfirmed ? (
            <button
              onClick={handleDirectLockDeal}
              disabled={userConfirmed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                userConfirmed
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-500/40 cursor-default"
                  : "bg-[#121417] hover:bg-black text-white hover:scale-102 active:scale-95"
              }`}
            >
              {userConfirmed ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>Waiting for {chat.otherUser?.name?.split(" ")[0] || "peer"} to confirm</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Lock Deal {finalAgreedAmount ? `at ₹${finalAgreedAmount}` : "Complete"}
                  </span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deal Receipt</span>
              </button>

              <button
                onClick={() =>
                  onOpenRatingModal({
                    listingId: chat.listingId,
                    targetUserId: chat.otherUser?.id,
                    targetUserName: chat.otherUser?.name,
                  })
                }
                className="px-3 py-1 rounded-xl text-xs font-bold bg-[#121417] hover:bg-black text-white flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Rate Deal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. MESSAGES SCROLL CANVAS */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 min-w-0">
        {chat.messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.senderId === "system";
          const isOffer = msg.type === "offer";

          if (isSystem) {
            const isCompletedSystem = msg.text.includes("Deal Sealed") || msg.text.includes("Deal Complete") || msg.text.includes("Ratings unlocked");
            return (
              <div
                key={msg.id || index}
                className={`py-2.5 px-4 rounded-2xl text-center my-3 max-w-lg mx-auto shadow-2xs animate-reveal-up ${
                  isCompletedSystem
                    ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-500/40 text-emerald-900"
                    : "bg-slate-200/80 border border-slate-300/60 text-[#121417]"
                }`}
              >
                {isCompletedSystem && (
                  <div className="flex items-center justify-center gap-1.5 text-base mb-1">
                    <span>🎉</span>
                    <span>🤝</span>
                    <span>✨</span>
                  </div>
                )}
                <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>
                {isCompletedSystem && (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all"
                  >
                    <FileCheck className="w-3 h-3" />
                    <span>View Handshake Receipt Pass</span>
                  </button>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          }

          if (isOffer) {
            const isOfferAccepted = chat.activeOffer?.status === "accepted" && chat.activeOffer?.amount === msg.offerAmount;
            const isOfferDeclined = chat.activeOffer?.status === "declined" && chat.activeOffer?.amount === msg.offerAmount;

            return (
              <div
                key={msg.id || index}
                className={`my-3 p-4 sm:p-5 rounded-3xl border shadow-sm transition-all animate-bubble-in max-w-[90%] sm:max-w-[75%] ${
                  isMe
                    ? "bg-gradient-to-br from-orange-50/90 to-amber-50/60 border-[#FF5A1F]/30 ml-auto"
                    : "bg-white border-slate-200 mr-auto hover:border-slate-300"
                }`}
              >
                {/* Offer Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#121417]">
                    <div className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-xs">
                      <Handshake className="w-4 h-4" />
                    </div>
                    <span>{isMe ? "You sent a price proposal:" : `${chat.otherUser?.name || "Peer"} proposed:`}</span>
                  </div>

                  {msg.isFinalPrice && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Final Price Request
                    </span>
                  )}
                </div>

                {/* Amount display */}
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-display font-black text-2xl sm:text-3xl text-[#121417] tracking-tight">
                    ₹{formatINR(msg.offerAmount)}
                  </span>
                  {chat.listing?.price != null && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{formatINR(chat.listing.price)} listed
                    </span>
                  )}
                  {chat.listing?.price && msg.offerAmount && Number(msg.offerAmount) < Number(chat.listing.price) && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {Math.round((1 - Number(msg.offerAmount) / Number(chat.listing.price)) * 100)}% OFF (Saved ₹{formatINR(Number(chat.listing.price) - Number(msg.offerAmount))})
                    </span>
                  )}
                </div>

                {/* Note */}
                {msg.note && (
                  <p className="mt-2 text-xs text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200/70 italic">
                    "{msg.note}"
                  </p>
                )}

                {/* Recipient Action Buttons when offer is pending */}
                {!isMe && chat.activeOffer?.status === "pending" && (
                  <div className="pt-3 mt-3 border-t border-slate-200/80 space-y-2 animate-reveal-up">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => respondToOffer(chat.id, "accept")}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:-translate-y-0.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept ₹{formatINR(msg.offerAmount)} (Lock Agreed Price)</span>
                      </button>

                      <button
                        onClick={() => {
                          setNegotiatePrice(msg.offerAmount);
                          setShowNegotiationModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#121417] font-semibold text-xs flex items-center gap-1 border border-slate-200 transition-all hover:-translate-y-0.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Counter / Adjust Price</span>
                      </button>

                      <button
                        onClick={() => respondToOffer(chat.id, "decline")}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 font-semibold text-xs flex items-center gap-1 border border-rose-200 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* If already accepted */}
                {isOfferAccepted && (
                  <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agreed at ₹{formatINR(msg.offerAmount)}</span>
                    </span>
                    {!isBothConfirmed && !userConfirmed && (
                      <button
                        onClick={handleDirectLockDeal}
                        className="px-3 py-1 rounded-xl bg-[#121417] hover:bg-black text-white text-[11px] font-bold shadow-xs transition-all"
                      >
                        Lock Deal Now
                      </button>
                    )}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id || index}
              className={`flex flex-col animate-bubble-in ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[72%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all hover:shadow-sm ${
                  isMe
                    ? "bg-[#121417] text-white rounded-br-sm shadow-xs"
                    : "bg-white text-[#121417] rounded-bl-sm border border-slate-200/90 shadow-2xs"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 px-1 mt-0.5 font-medium">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-reveal-up py-1">
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-slate-600 ml-1.5">
                {chat.otherUser?.name || "Student"} is typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. QUICK REPLIES BAR */}
      <QuickReplies onSelectPrompt={handlePromptSelect} />

      {/* 5. BOTTOM MESSAGE DOCK */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={() => setShowNegotiationModal(true)}
          className="p-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF5A1F] border border-orange-200 flex items-center justify-center transition-all shrink-0 active:scale-95"
          title="Open Price Negotiation & Set Final Amount"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type campus message (cash on meetup)..."
          className="flex-1 px-4 py-3 bg-slate-100/90 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#121417] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 transition-all focus:bg-white"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className={`w-11 h-11 rounded-2xl transition-all flex items-center justify-center shrink-0 shadow-sm ${
            inputMessage.trim()
              ? "bg-[#FF5A1F] hover:bg-[#E04F1A] text-white hover:scale-105 active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50"
          }`}
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>


      {/* 6. ADVANCED PRICE NEGOTIATION & FINAL DEAL MODAL */}
      {showNegotiationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-reveal-up">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 shadow-modal text-left space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A1F] flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#121417]">
                    Price Negotiation & Final Amount
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isBuyer ? "Propose your offer to seller" : "Set asking price or special discount"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#121417]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Price Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Listing Item</span>
                <p className="font-bold text-[#121417] truncate">{chat.listing?.title}</p>
                <p className="text-slate-500 text-[11px]">{chat.listing?.location}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Price</span>
                <span className="font-extrabold text-sm text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200 inline-block">
                  ₹{formatINR(listingPrice)}
                </span>
              </div>
            </div>

            {/* Live Amount Box & Step Steppers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold uppercase text-slate-500 text-[11px]">
                  Target Price (₹ INR)
                </label>
                {discountAmount > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    {discountPercent}% OFF (Save ₹{formatINR(discountAmount)})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    At Listed Price
                  </span>
                )}
              </div>

              {/* Number Input with Stepper Increment/Decrement buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNegotiatePrice((prev) => Math.max(10, Number(prev || 0) - 50))}
                  className="w-10 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#121417] font-extrabold text-sm flex items-center justify-center transition-all border border-slate-200"
                  title="Minus ₹50"
                >
                  -50
                </button>

                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={negotiatePrice}
                    onChange={(e) => setNegotiatePrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xl font-black text-[#121417] focus:ring-2 focus:ring-[#FF5A1F]/30 focus:bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setNegotiatePrice((prev) => Number(prev || 0) + 50)}
                  className="w-10 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#121417] font-extrabold text-sm flex items-center justify-center transition-all border border-slate-200"
                  title="Plus ₹50"
                >
                  +50
                </button>
              </div>

              {/* Range Slider for Intuitive Dragging */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min={Math.max(10, Math.round(listingPrice * 0.3))}
                  max={Math.round(listingPrice * 1.1)}
                  step={10}
                  value={negotiatePrice}
                  onChange={(e) => setNegotiatePrice(Number(e.target.value))}
                  className="w-full accent-[#FF5A1F] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5">
                  <span>Min: ₹{formatINR(Math.round(listingPrice * 0.3))}</span>
                  <span>Listed: ₹{formatINR(listingPrice)}</span>
                  <span>Max: ₹{formatINR(Math.round(listingPrice * 1.1))}</span>
                </div>
              </div>

              {/* Quick Discount Percentage Chips */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Quick Price Shortcuts
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.95, 0.9, 0.85, 0.8].map((pct) => {
                    const val = Math.round(listingPrice * pct);
                    const isCurrent = Number(negotiatePrice) === val;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setNegotiatePrice(val)}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                          isCurrent
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-2xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        }`}
                      >
                        ₹{formatINR(val)} ({Math.round((1 - pct) * 100)}% off)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Note for Meetup/Handoff */}
              <div className="pt-1">
                <label className="block font-bold uppercase text-slate-400 text-[10px] mb-1">
                  Optional Note (Pickup spot or timing)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Can meet at SAC Canteen at 6 PM with cash"
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSubmitNegotiation(false)}
                  disabled={!negotiatePrice || Number(negotiatePrice) <= 0}
                  className="w-full py-3 rounded-2xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Propose Offer: ₹{formatINR(negotiatePrice)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSubmitNegotiation(true);
                  }}
                  disabled={!negotiatePrice || Number(negotiatePrice) <= 0}
                  className="w-full py-2.5 rounded-2xl bg-[#121417] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-300 shadow-2xs active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Set as Final Agreed Price & Request Deal Lock</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 7. DIGITAL DEAL RECEIPT PASS MODAL */}
      <DealReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        chat={chat}
        onOpenRating={onOpenRatingModal}
      />

    </div>
  );
};
