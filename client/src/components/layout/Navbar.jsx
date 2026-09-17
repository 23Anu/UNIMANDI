import React, { useState } from "react";
import {
  Sparkles,
  PlusCircle,
  MessageSquare,
  User,
  ShieldCheck,
  ChevronDown,
  Search,
  Bell,
  GraduationCap,
  LogOut,
  Heart,
  Store,
  QrCode
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useListings } from "../../context/ListingsContext";
import { useStore } from "../../context/StoreContext";

export const Navbar = ({
  onOpenPostModal,
  onOpenChatDrawer,
  onOpenProfileView,
  onSelectTab,
  activeTab
}) => {
  const { currentUser, registeredUsers, switchUser, logout } = useAuth();
  const { chats } = useChat();
  const { wishlist } = useListings();
  const { orders } = useStore();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const isStoreManager = currentUser?.role === "merchant" || currentUser?.id === "user_kampus_store";
  const pendingOrdersCount = orders?.filter((o) => o.status === "Pending Pickup" || o.status === "Ready for Pickup")?.length || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Campus Tag */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectTab("home")}>
            <img
              src="/logo.png"
              alt="UNIMANDI Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-xs border border-slate-200/80 bg-white p-0.5 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl text-[#0F1E36] tracking-tight">
                  UNI<span className="text-[#FF5A1F]">MANDI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FF5A1F]/15 text-[#FF5A1F]">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Buy • Sell • Rent • Connect
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab("home")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "home"
                  ? "bg-slate-100 text-[#121417]"
                  : "text-slate-500 hover:text-[#121417] hover:bg-slate-50"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => onSelectTab("browse")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "browse"
                  ? "bg-slate-100 text-[#121417]"
                  : "text-slate-500 hover:text-[#121417] hover:bg-slate-50"
              }`}
            >
              Browse All
            </button>
            <button
              onClick={() => onSelectTab("store")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "store"
                  ? "bg-[#121417] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#121417] hover:bg-slate-100"
              }`}
            >
              <Store className="w-4 h-4 text-[#FF5A1F]" />
              <span>UniMandi Store</span>
              {isStoreManager ? (
                <span className="text-[10px] bg-[#FF5A1F] text-white px-1.5 py-0.5 rounded-full font-bold">
                  {pendingOrdersCount} Queue
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Pickup Pass
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab("saved")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "saved"
                  ? "bg-slate-100 text-[#121417]"
                  : "text-slate-500 hover:text-[#121417] hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? "fill-[#FF5A1F] text-[#FF5A1F]" : ""}`} />
              <span>Saved ({wishlist.length})</span>
            </button>
            <button
              onClick={() => onSelectTab("mylistings")}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "mylistings"
                  ? "bg-slate-100 text-[#121417]"
                  : "text-slate-500 hover:text-[#121417] hover:bg-slate-50"
              }`}
            >
              My Listings
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Post an Item CTA */}
            <button
              onClick={onOpenPostModal}
              className="btn-primary text-xs sm:text-sm py-2 px-3.5 shadow-sm"
              title="Post an Item"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Post an Item</span>
            </button>

            {/* Chat Inbox Button */}
            <button
              onClick={onOpenChatDrawer}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#121417] transition-colors border border-slate-200"
              title="Campus Chats"
            >
              <MessageSquare className="w-5 h-5" />
              {chats.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5A1F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {chats.length}
                </span>
              )}
            </button>

            {/* Student Persona Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                  />
                  <div className="hidden lg:block text-left leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#121417]">
                        {currentUser.name}
                      </span>
                      {currentUser.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] fill-emerald-50" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {currentUser.branch.split(" ")[0]} • {currentUser.year}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {/* Persona Dropdown Menu */}
                {showPersonaMenu && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-modal border border-slate-200 p-2 z-50 animate-reveal-up"
                    onClick={() => setShowPersonaMenu(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Switch Profile / Counter
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Students & UniMandi SAC Store Counter
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                      {registeredUsers.map((user) => {
                        const isUserMerchant = user.role === "merchant" || user.id === "user_kampus_store";
                        return (
                          <button
                            key={user.id}
                            onClick={() => switchUser(user.id)}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                              user.id === currentUser.id
                                ? isUserMerchant
                                  ? "bg-[#FF5A1F]/10 border border-[#FF5A1F]/40"
                                  : "bg-slate-100 border border-slate-300"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-[#121417] truncate">
                                  {user.name}
                                </span>
                                {isUserMerchant ? (
                                  <span className="text-[9px] bg-[#FF5A1F] text-white px-1 rounded font-bold">
                                    STORE
                                  </span>
                                ) : (
                                  user.isVerified && (
                                    <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                                  )
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">
                                {user.branch} • {user.year}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-1.5 space-y-1">
                      <button
                        onClick={() => onOpenProfileView()}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#121417] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-[#FF5A1F]" />
                        <span>View Profile & Verification</span>
                      </button>

                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out (Back to Login)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
