import React from "react";
import { Home, Compass, Plus, MessageSquare, Store, Heart } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useListings } from "../../context/ListingsContext";
import { useStore } from "../../context/StoreContext";

export const MobileBottomNav = ({
  activeTab,
  onSelectTab,
  onOpenPostModal,
  onOpenChatDrawer,
  onOpenProfileView,
}) => {
  const { chats } = useChat();
  const { wishlist } = useListings();
  const { studentOrders } = useStore();

  const pendingPassesCount = studentOrders.filter((o) => o.status === "Pending Pickup").length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-16 px-1 relative">
        
        {/* Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center justify-center w-11 py-1 transition-colors ${
            activeTab === "home" ? "text-[#FF5A1F] font-bold" : "text-slate-500"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : ""}`} />
          <span className="text-[9px] mt-0.5 font-medium">Home</span>
        </button>

        {/* Tanish Store */}
        <button
          onClick={() => onSelectTab("store")}
          className={`flex flex-col items-center justify-center w-11 py-1 transition-colors relative ${
            activeTab === "store" ? "text-[#FF5A1F] font-bold" : "text-slate-500"
          }`}
        >
          <Store className={`w-5 h-5 ${activeTab === "store" ? "stroke-[2.5]" : ""}`} />
          <span className="text-[9px] mt-0.5 font-medium">Store</span>
          {pendingPassesCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF5A1F] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {pendingPassesCount}
            </span>
          )}
        </button>

        {/* Post Button (Raised Center CTA) */}
        <div className="relative -top-4">
          <button
            onClick={onOpenPostModal}
            className="w-12 h-12 p-3 rounded-full bg-[#FF5A1F] hover:bg-[#E04812] text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center border-4 border-[#F8F9FA]"
            aria-label="Post an item"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Saved Wishlist */}
        <button
          onClick={() => onSelectTab("saved")}
          className={`flex flex-col items-center justify-center w-11 py-1 transition-colors relative ${
            activeTab === "saved" ? "text-[#FF5A1F] font-bold" : "text-slate-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === "saved" ? "fill-[#FF5A1F] stroke-[#FF5A1F]" : ""}`} />
          <span className="text-[9px] mt-0.5 font-medium">Saved</span>
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF5A1F] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Chats */}
        <button
          onClick={onOpenChatDrawer}
          className="flex flex-col items-center justify-center w-11 py-1 text-slate-500 hover:text-[#121417] transition-colors relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">Chats</span>
          {chats.length > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF5A1F] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {chats.length}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};

