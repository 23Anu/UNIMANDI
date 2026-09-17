import React, { useState } from "react";
import { PlusCircle, Edit3, Trash2, Eye, ExternalLink } from "lucide-react";
import { StatusBadge, TypeBadge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useListings } from "../../context/ListingsContext";

export const MyListingsTabs = ({ onOpenPostModal, onSelectListing }) => {
  const { currentUser } = useAuth();
  const { listings, updateListingStatus, deleteListing } = useListings();

  const [activeTab, setActiveTab] = useState("Active"); // Active | Reserved | Completed

  const myListings = listings.filter((l) => l.userId === currentUser.id);

  const filteredMyListings = myListings.filter((item) => {
    if (activeTab === "Active") return item.status === "Available";
    if (activeTab === "Reserved") return item.status === "Reserved";
    if (activeTab === "Completed") return item.status === "Sold" || item.status === "Rented Out" || item.status === "Sold / Rented Out";
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-300">
        <div>
          <h2 className="font-serif font-bold text-xl text-navy-800">
            My Campus Listings
          </h2>
          <p className="text-xs text-slate-500">
            Manage your items, rental durations, and live availability
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="btn-primary text-xs py-2 px-3.5 shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-2">
        {["Active", "Reserved", "Completed"].map((tab) => {
          const count = myListings.filter((item) => {
            if (tab === "Active") return item.status === "Available";
            if (tab === "Reserved") return item.status === "Reserved";
            if (tab === "Completed") return item.status === "Sold" || item.status === "Rented Out" || item.status === "Sold / Rented Out";
            return true;
          }).length;

          const isSelected = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-navy-800 text-cream-100 shadow-sm"
                  : "bg-cream-100 hover:bg-cream-200 text-slate-600"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? "bg-cream-100/20 text-cream-50" : "bg-cream-300 text-navy-800"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      {filteredMyListings.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} listings`}
          message={`You don't have any items currently in the "${activeTab}" category.`}
          actionText="Post an Item"
          onAction={onOpenPostModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMyListings.map((item) => (
            <div
              key={item.id}
              className="bg-cream-50 rounded-2xl border border-cream-300 p-4 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Photo & Status */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-cream-200">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <TypeBadge type={item.type} />
                  </div>
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="uppercase font-bold tracking-wider">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.views || 1} views
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-navy-800 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-serif font-black text-lg text-navy-800">
                      ₹{item.price}
                    </span>
                    {item.type === "Rent" && item.rentDuration && (
                      <span className="text-xs text-slate-500">/{item.rentDuration.replace("per ", "")}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 mt-3 border-t border-cream-200/80 space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Set:</span>
                  {["Available", "Reserved", item.type === "Rent" ? "Rented Out" : "Sold"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateListingStatus(item.id, st)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                        item.status === st
                          ? "bg-navy-800 text-cream-50 border-navy-800 font-bold"
                          : "bg-cream-100 hover:bg-cream-200 text-slate-600 border-cream-300"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectListing(item)}
                    className="text-xs text-navy-800 hover:underline flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                        deleteListing(item.id);
                      }
                    }}
                    className="p-1.5 text-rust-500 hover:bg-rust-50 rounded-lg transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
