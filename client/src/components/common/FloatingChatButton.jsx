import React from "react";
import { MessageSquare, Handshake, Sparkles } from "lucide-react";
import { useChat } from "../../context/ChatContext";

export function FloatingChatButton({ onOpenChat }) {
  const { chats, isChatOpen } = useChat();

  // If chat modal is already open, do not render floating trigger
  if (isChatOpen) return null;

  const activeOffersCount = chats.filter((c) => c.activeOffer?.status === "pending" || c.activeOffer?.status === "accepted").length;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40 animate-bounce-subtle">
      <button
        onClick={onOpenChat}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#121417] hover:bg-black text-white shadow-2xl border border-slate-700 hover:border-[#FF5A1F] transition-all duration-200 active:scale-95 hover:scale-105"
        title="Open Campus Deals & Chat Hub"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          {chats.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#121417] shadow-sm">
              {chats.length}
            </span>
          )}
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-xs text-white">
              Deals & Chat
            </span>
            {activeOffersCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Handshake className="w-2.5 h-2.5" />
                {activeOffersCount} Offer{activeOffersCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Instant Negotiation
          </span>
        </div>
      </button>
    </div>
  );
}
