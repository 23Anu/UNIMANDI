import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ArrowUpDown,
  Sparkles,
  MapPin,
  Flame,
  Check,
  Home
} from "lucide-react";
import { useListings, CAMPUS_LOCATIONS } from "../../context/ListingsContext";
import { BRANCHES, GENDER_FILTERS } from "../../data/seedListings";

export const SearchFilterBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    filterBranch,
    setFilterBranch,
    filterCondition,
    setFilterCondition,
    filterLocation,
    setFilterLocation,
    filterGender,
    setFilterGender,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
  } = useListings();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const isHostelContext =
    selectedCategory === "Hostel & PG Living" ||
    searchQuery.toLowerCase().includes("pg") ||
    searchQuery.toLowerCase().includes("hostel") ||
    searchQuery.toLowerCase().includes("flat") ||
    searchQuery.toLowerCase().includes("room") ||
    searchQuery.toLowerCase().includes("roommate");

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedType !== "All" ||
    filterBranch !== "All" ||
    filterCondition !== "All" ||
    filterLocation !== "All Campus Areas" ||
    filterGender !== "All" ||
    sortBy !== "relevance";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setFilterBranch("All");
    setFilterCondition("All");
    setFilterLocation("All Campus Areas");
    setFilterGender("All");
    setSortBy("relevance");
    setSelectedCategory("All");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 mb-6 shadow-sm space-y-3 text-left">
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Campus Location Cluster Dropdown (OLX City/Area Filter Adaptation) */}
        <div className="relative w-full sm:w-auto shrink-0">
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full sm:w-auto pl-8 pr-7 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#121417] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] appearance-none cursor-pointer"
          >
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#FF5A1F] pointer-events-none" />
        </div>

        {/* Natural Language Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. 'Girls PG near Gate 1', 'Boys single room', 'CS books'..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#121417] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#121417]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative w-full sm:w-auto shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto pl-8 pr-8 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#121417] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] appearance-none cursor-pointer"
          >
            <option value="relevance">⚡ Best Match</option>
            <option value="price_asc">💰 Price: Low to High</option>
            <option value="price_desc">💎 Price: High to Low</option>
            <option value="urgent">🔥 Urgent Deals</option>
            <option value="featured">⭐ Featured First</option>
          </select>
          <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Rent / Sell Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto shrink-0 justify-center">
          {["All", "Rent", "Sell"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? "bg-[#121417] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#121417]"
              }`}
            >
              {type === "All" ? "All" : type}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center shrink-0 ${
            showAdvanced || filterBranch !== "All" || filterCondition !== "All" || filterGender !== "All"
              ? "bg-slate-100 border-slate-400 text-[#121417]"
              : "bg-white border-slate-200 text-slate-500 hover:text-[#121417]"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {(filterBranch !== "All" || filterCondition !== "All" || filterGender !== "All") && (
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F]"></span>
          )}
        </button>

      </div>

      {/* PG & Hostel Gender Filter Bar (Always visible in Hostel context or filter active) */}
      {(isHostelContext || filterGender !== "All") && (
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 animate-reveal-up">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>PG / Room Type:</span>
            </span>

            {GENDER_FILTERS.map((g) => {
              const isSelected = filterGender === g.id;
              const isGirls = g.id === "Girls Only";
              const isBoys = g.id === "Boys Only";

              return (
                <button
                  key={g.id}
                  onClick={() => setFilterGender(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? isGirls
                        ? "bg-rose-600 text-white border-rose-600 shadow-md scale-105"
                        : isBoys
                        ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                        : "bg-[#121417] text-white border-[#121417] shadow-sm scale-105"
                      : isGirls
                      ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      : isBoys
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>

          {filterGender !== "All" && (
            <span className="text-[11px] font-bold text-slate-500">
              Showing <strong className="text-[#121417]">{filterGender}</strong> verified listings
            </span>
          )}
        </div>
      )}

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-reveal-up">
          
          {/* PG / Hostel Gender Restriction */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Hostel / PG Gender
            </label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#121417]"
            >
              {GENDER_FILTERS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Branch */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Target Academic Branch
            </label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#121417]"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Item Condition
            </label>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#121417]"
            >
              <option value="All">All Conditions</option>
              <option value="New">Brand New / Like New</option>
              <option value="Good">Good (Minor wear)</option>
              <option value="Fair">Fair (Usable condition)</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={resetAllFilters}
              disabled={!hasActiveFilters}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[#121417] hover:bg-slate-100 border border-slate-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

