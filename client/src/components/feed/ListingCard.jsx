import React, { useState } from "react";
import {
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  Flame,
  Heart,
  Clock,
  ArrowUpRight,
  MessageSquare,
  Zap
} from "lucide-react";
import { StatusBadge, TypeBadge } from "../common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useListings } from "../../context/ListingsContext";

export const ListingCard = ({ listing, onSelectListing }) => {
  const { currentUser } = useAuth();
  const { toggleWishlist, isItemSaved } = useListings();
  const [justHearted, setJustHearted] = useState(false);

  const isSaved = isItemSaved(listing.id);

  const isBranchMatch =
    currentUser &&
    (listing.targetBranch === currentUser.branch || listing.targetBranch === "All Branches") &&
    listing.targetBranch !== "All Branches";

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleWishlist(listing.id);
    setJustHearted(true);
    setTimeout(() => setJustHearted(false), 500);
  };

  return (
    <div
      onClick={() => onSelectListing(listing)}
      className={`listing-card group cursor-pointer text-left h-full flex flex-col justify-between transition-all duration-300 relative ${
        listing.isFeatured
          ? "ring-2 ring-[#FF5A1F]/30 shadow-md hover:shadow-2xl hover:ring-[#FF5A1F]/70"
          : "hover:shadow-xl"
      }`}
    >
      <div>
        {/* Hero Photo Container with Shine Sweep & Quick Overlay */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 rounded-t-2xl">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Light Sheen Sweep Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* Top Left Floating Tags */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <TypeBadge type={listing.type} />
              
              {/* Gender Preference Badge for PGs / Hostels */}
              {listing.genderTarget === "Girls Only" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-md animate-pulse-subtle">
                  <span>🌸</span>
                  <span>Girls Only</span>
                </span>
              )}
              {listing.genderTarget === "Boys Only" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-md animate-pulse-subtle">
                  <span>🔷</span>
                  <span>Boys Only</span>
                </span>
              )}

              {listing.isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-md animate-pulse">
                  <Flame className="w-3 h-3 text-amber-300 animate-bounce-subtle" />
                  Urgent
                </span>
              )}
              {listing.isFeatured && !listing.isUrgent && !listing.genderTarget?.includes("Only") && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF5A1F] text-white shadow-md animate-pulse-subtle">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>

            {isBranchMatch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#121417]/90 text-[#FF7A45] border border-[#FF5A1F]/40 backdrop-blur-md shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-[#FF5A1F]" />
                Branch Match
              </span>
            )}
          </div>

          {/* Top Right: Status Badge & 1-Click Wishlist Heart with Heart Pop Animation */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            <button
              onClick={handleHeartClick}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
                isSaved
                  ? "bg-white text-rose-600 scale-110 shadow-md ring-2 ring-rose-500/20"
                  : "bg-black/40 text-white hover:bg-black/60 hover:text-rose-400 hover:scale-110"
              } ${justHearted ? "heart-pop" : ""}`}
              title={isSaved ? "Remove from saved" : "Save to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isSaved ? "fill-rose-600 stroke-rose-600" : ""
                }`}
              />
            </button>
            <StatusBadge status={listing.status} />
          </div>

          {/* Bottom subtle gradient and quick prompt on hover */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none flex items-end p-2.5 justify-between">
            <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">
              Tap to negotiate & inspect
            </span>
            <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-[#FF5A1F] transition-colors">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-4 space-y-2">
          
          {/* Category & Subcategory */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="uppercase tracking-wider font-bold text-slate-500 truncate max-w-[150px]">
              {listing.subcategory || listing.category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#121417] text-[10px] font-semibold border border-slate-200">
              {listing.condition}
            </span>
          </div>

          {/* Title with hover color change */}
          <h3 className="font-display font-bold text-base text-[#121417] line-clamp-2 leading-snug group-hover:text-[#FF5A1F] transition-colors duration-200">
            {listing.title}
          </h3>

          {/* Price & Quick Offer Tag */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl text-[#121417] tracking-tight group-hover:text-[#FF5A1F] transition-colors duration-200">
                ₹{listing.price != null ? Number(listing.price).toLocaleString("en-IN") : "0"}
              </span>
              {listing.type === "Rent" && listing.rentDuration && (
                <span className="text-xs text-slate-500 font-medium">
                  /{listing.rentDuration.replace("per ", "")}
                </span>
              )}
            </div>

            {listing.type === "Sell" && (
              <span className="text-[10px] text-[#FF5A1F] bg-orange-50 font-bold px-2 py-0.5 rounded-md border border-[#FF5A1F]/20 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-200 shadow-xs">
                Offers Open
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 pt-0.5 truncate font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

        </div>
      </div>

      {/* Seller Mini Card */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 group-hover:bg-orange-50/30 transition-colors flex items-center justify-between text-xs rounded-b-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={listing.seller?.avatar}
            alt={listing.seller?.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span className="text-xs font-semibold text-[#121417] truncate">
            {listing.seller?.name}
          </span>
          {listing.seller?.isVerified && (
            <ShieldCheck
              className="w-3.5 h-3.5 text-[#10B981] shrink-0"
              title="Verified Student"
            />
          )}
        </div>

        {/* Rating score */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#121417] shrink-0">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{listing.seller?.trustScore || "5.0"}</span>
        </div>
      </div>

    </div>
  );
};
