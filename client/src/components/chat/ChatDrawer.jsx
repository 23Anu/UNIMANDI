import React, { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCheck,
  PackageOpen,
  ArrowLeft,
  Search,
  Handshake,
  Sparkles
} from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { MessageThread } from "./MessageThread";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export const ChatDrawer = ({ isOpen, onClose, onOpenRatingModal }) => {
  const { chats, activeChatId, setActiveChatId, activeChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  // If chat modal is open and activeChatId is null, automatically select the first conversation
  useEffect(() => {
    if (isOpen && !activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [isOpen, activeChatId, chats]);

  if (!isOpen) return null;

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const peerName = chat.otherUser?.name?.toLowerCase() || "";
    const itemTitle = chat.listing?.title?.toLowerCase() || "";
    return peerName.includes(q) || itemTitle.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-reveal-up">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Centered Chat Window */}
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[86vh] max-h-[840px] bg-white rounded-3xl shadow-modal border border-slate-200 z-10 flex flex-col overflow-hidden text-left">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121417] text-[#FF5A1F] flex items-center justify-center font-bold shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-[#121417]">
                  Campus Deals & Chat Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
                  {chats.length} Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Direct buyer-seller price negotiations, cash meetups & verified handshakes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#121417] transition-colors border border-transparent hover:border-slate-200"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Fixed 2-Column Layout */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Column: Conversations List */}
          <div
            className={`w-full md:w-80 lg:w-88 border-r border-slate-200 overflow-y-auto bg-slate-50/80 shrink-0 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search Box */}
            <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-[#121417] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredChats.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <PackageOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-[#121417]">No conversations yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Chat with Seller" or "Make an Offer" on any listing to start negotiating.
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isSelected = chat.id === activeChatId;
                  const messagesArr = chat.messages || [];
                  const lastMsg = messagesArr[messagesArr.length - 1];
                  const hasAcceptedOffer = chat.activeOffer?.status === "accepted" && chat.activeOffer?.amount != null;
                  const hasPendingOffer = chat.activeOffer?.status === "pending" && chat.activeOffer?.amount != null;

                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full p-3.5 flex items-start gap-3 transition-all text-left relative ${
                        isSelected
                          ? "bg-white border-l-4 border-[#FF5A1F] shadow-sm"
                          : "hover:bg-slate-100/80"
                      }`}
                    >
                      {/* Avatar with Online Dot */}
                      <div className="relative shrink-0">
                        <img
                          src={chat.otherUser?.avatar || DEFAULT_AVATAR}
                          alt={chat.otherUser?.name || "Student"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_AVATAR;
                          }}
                          className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 shadow-2xs"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#121417] truncate flex items-center gap-1">
                            {chat.otherUser?.name || "Campus Peer"}
                            {chat.otherUser?.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {lastMsg?.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>

                        {/* Item snippet */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-semibold text-slate-800 truncate">
                            {chat.listing?.title || "Campus Item"}
                          </span>
                        </div>

                        {/* Last message / offer status badge */}
                        <div className="flex items-center justify-between gap-1 mt-1">
                          <p className="text-[11px] text-slate-500 truncate max-w-[170px] font-normal">
                            {lastMsg ? lastMsg.text : "No messages yet"}
                          </p>

                          {hasAcceptedOffer && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                              ₹{chat.activeOffer?.amount} Agreed
                            </span>
                          )}

                          {hasPendingOffer && !hasAcceptedOffer && (
                            <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-400/30 shrink-0">
                              Offer ₹{chat.activeOffer?.amount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation & Negotiation Canvas */}
          <div
            className={`flex-1 min-w-0 flex flex-col h-full bg-[#FAFBFD] ${
              !activeChat ? "hidden md:flex items-center justify-center" : "flex"
            }`}
          >
            {activeChat ? (
              <MessageThread
                chat={activeChat}
                onBack={() => setActiveChatId(null)}
                onOpenRatingModal={onOpenRatingModal}
              />
            ) : (
              <div className="text-center p-8 text-slate-500 text-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <p className="font-bold text-base text-[#121417]">Select a conversation</p>
                <p className="text-slate-400 mt-1 max-w-xs mx-auto">
                  Pick a campus negotiation from the list on the left to chat, agree on prices, and hand over items.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};



