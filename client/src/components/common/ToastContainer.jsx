import React, { useState, useEffect } from "react";
import { getSocket } from "../../services/socket";
import { useAuth } from "../../context/AuthContext";
import { Bell, MessageSquare, Handshake, CheckCircle2, Sparkles, X } from "lucide-react";

export function ToastContainer({ onOpenChat }) {
  const { currentUser } = useAuth();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const socket = getSocket();

    const addToast = (toast) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newToast = { id, ...toast };

      setToasts((prev) => [newToast, ...prev].slice(0, 4));

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    };

    // 1. Live Chat Notification
    const handleChatNotification = (data) => {
      addToast({
        type: "chat",
        title: `💬 New Message from ${data.senderName}`,
        message: data.text,
        chatId: data.chatId,
        avatar: data.senderAvatar,
      });
    };

    // 2. Live Offer Notification
    const handleOfferNotification = (data) => {
      const amountStr = data.amount != null ? Number(data.amount).toLocaleString("en-IN") : "0";
      let title = "🤝 New Price Offer!";
      let message = `${data.senderName || "A student"} offered ₹${amountStr} for "${data.listingTitle || "an item"}"`;

      if (data.type === "offer_accepted") {
        title = "🎉 Offer Accepted!";
        message = `${data.senderName || "Peer"} accepted your offer of ₹${amountStr}!`;
      } else if (data.type === "offer_declined") {
        title = "❌ Offer Declined";
        message = `${data.senderName || "Peer"} declined the offer.`;
      } else if (data.type === "offer_counter") {
        title = "🔄 Counter-Offer Received";
        message = `${data.senderName || "Peer"} countered with ₹${amountStr}`;
      }

      addToast({
        type: "offer",
        title,
        message,
        chatId: data.chatId,
      });
    };

    // 3. Live Ticker / New Listing
    const handleNewListing = (listing) => {
      if (listing.userId !== currentUser.id) {
        addToast({
          type: "listing",
          title: "✨ Fresh Item Posted on Campus",
          message: `${listing.title} • ₹${listing.price} (${listing.type})`,
        });
      }
    };

    socket.on("chat_notification", handleChatNotification);
    socket.on("offer_notification", handleOfferNotification);
    socket.on("new_listing_posted", handleNewListing);

    return () => {
      socket.off("chat_notification", handleChatNotification);
      socket.off("offer_notification", handleOfferNotification);
      socket.off("new_listing_posted", handleNewListing);
    };
  }, [currentUser]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#121417] text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 flex items-start gap-3 animate-slide-in backdrop-blur-md transition-all hover:border-[#FF5A1F]"
          role="alert"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center shrink-0 border border-[#FF5A1F]/30">
            {toast.type === "chat" && <MessageSquare className="w-5 h-5 text-[#FF5A1F]" />}
            {toast.type === "offer" && <Handshake className="w-5 h-5 text-[#10B981]" />}
            {toast.type === "listing" && <Sparkles className="w-5 h-5 text-amber-400" />}
          </div>

          <div
            className="flex-1 min-w-0 cursor-pointer text-left"
            onClick={() => {
              if (toast.chatId && onOpenChat) {
                onOpenChat(toast.chatId);
                removeToast(toast.id);
              }
            }}
          >
            <h4 className="text-xs font-bold font-display text-white truncate">
              {toast.title}
            </h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
