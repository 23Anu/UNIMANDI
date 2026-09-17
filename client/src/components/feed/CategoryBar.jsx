import React from "react";
import {
  BookOpen,
  Cpu,
  CircuitBoard,
  Home,
  Bike,
  Trophy,
  Layers,
  Sparkles,
  Flame,
  Check,
  Tag,
  Zap,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { CATEGORIES, CATEGORY_TREE } from "../../data/seedListings";
import { useListings } from "../../context/ListingsContext";

const categoryConfig = {
  All: {
    icon: Layers,
    accent: "from-slate-700 to-slate-900",
    glow: "hover:shadow-slate-300",
    badge: "All",
  },
  "Books & Notes": {
    icon: BookOpen,
    accent: "from-amber-500 to-orange-500",
    glow: "hover:shadow-orange-200",
    badge: "32 Books",
  },
  "Electronics & Tech": {
    icon: Cpu,
    accent: "from-emerald-500 to-teal-600",
    glow: "hover:shadow-emerald-200",
    badge: "18 Gadgets",
  },
  "Project & Lab Parts": {
    icon: CircuitBoard,
    accent: "from-indigo-500 to-violet-600",
    glow: "hover:shadow-indigo-200",
    badge: "24 Parts",
  },
  "Hostel & PG Living": {
    icon: Home,
    accent: "from-rose-500 to-red-600",
    glow: "hover:shadow-rose-200",
    badge: "12 Items",
  },
  "Cycles & Campus Commute": {
    icon: Bike,
    accent: "from-blue-500 to-cyan-600",
    glow: "hover:shadow-blue-200",
    badge: "9 Cycles",
  },
  "Sports & Hobbies": {
    icon: Trophy,
    accent: "from-amber-400 to-orange-600",
    glow: "hover:shadow-amber-200",
    badge: "15 Items",
  },
  "Other / Miscellaneous": {
    icon: Sparkles,
    accent: "from-purple-500 to-pink-600",
    glow: "hover:shadow-purple-200",
    badge: "Other",
  },
};

const getSubcategoryIcon = (subcat) => {
  if (subcat.startsWith("All")) return "📁";
  if (subcat.includes("Urgent")) return "🔥";
  if (subcat.includes("Senior Picks")) return "⭐";
  if (subcat.includes("Under ₹500")) return "🏷️";
  if (subcat.includes("Rentals")) return "⚡";
  if (subcat.includes("Girls")) return "🌸";
  if (subcat.includes("Boys")) return "🔷";
  if (subcat.includes("Co-ed") || subcat.includes("Roommate")) return "👥";
  if (subcat.includes("Fridge")) return "🧊";
  if (subcat.includes("Book") || subcat.includes("Note") || subcat.includes("Paper")) return "📚";
  if (subcat.includes("Calc") || subcat.includes("Laptop") || subcat.includes("Headphone")) return "🧮";
  if (subcat.includes("Arduino") || subcat.includes("Sensor") || subcat.includes("Lab") || subcat.includes("Drafter")) return "⚡";
  if (subcat.includes("Cycle") || subcat.includes("Bicycle") || subcat.includes("Commute")) return "🚲";
  if (subcat.includes("Guitar") || subcat.includes("Cricket") || subcat.includes("Gym")) return "🎸";
  return "✨";
};

export const CategoryBar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
  } = useListings();

  const currentSubcategories = CATEGORY_TREE[selectedCategory]?.subcategories || [];

  return (
    <div className="mb-6 space-y-3.5 text-left">
      {/* Category Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Browse Categories
          </h3>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500/15 to-emerald-500/15 text-[#FF5A1F] font-extrabold border border-[#FF5A1F]/20 hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            7 Active Campus Hubs
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">Verified by Campus Peers</span>
      </div>

      {/* Main Categories Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const config = categoryConfig[cat] || categoryConfig["All"];
          const Icon = config.icon;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 border active:scale-95 ${
                isSelected
                  ? "bg-[#121417] text-white border-[#121417] shadow-md -translate-y-0.5"
                  : `bg-white hover:bg-slate-50 text-slate-700 hover:text-[#121417] border-slate-200/90 shadow-sm hover:-translate-y-0.5 hover:border-[#FF5A1F]/30 ${config.glow}`
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  isSelected
                    ? "bg-[#FF5A1F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "animate-bounce-subtle" : ""}`} />
              </div>

              <span>{cat}</span>

              {/* Subdued pill count */}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  isSelected
                    ? "bg-white/15 text-slate-200"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                {config.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Proper Selectable Box Options Row */}
      {currentSubcategories.length > 0 && (
        <div className="p-2.5 rounded-2xl bg-slate-100/80 border border-slate-200/90 shadow-2xs space-y-2 animate-reveal-up">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>Selected Hub Picks:</span>
              <span className="text-[#FF5A1F] font-extrabold">{selectedCategory}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              Click any box to filter
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar">
            {currentSubcategories.map((subcat) => {
              const isSubSelected = selectedSubcategory === subcat;
              const isUrgentTag = subcat === "Urgent Deals";
              const isSeniorTag = subcat === "Senior Picks";
              const icon = getSubcategoryIcon(subcat);

              return (
                <button
                  key={subcat}
                  onClick={() => {
                    if (isSubSelected && !subcat.startsWith("All")) {
                      // Toggle off back to All
                      setSelectedSubcategory(currentSubcategories[0] || "All Items");
                    } else {
                      setSelectedSubcategory(subcat);
                    }
                  }}
                  className={`group px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border active:scale-95 shadow-2xs ${
                    isSubSelected
                      ? "bg-[#121417] text-white border-[#121417] shadow-sm -translate-y-0.5"
                      : isUrgentTag
                      ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:-translate-y-0.5"
                      : isSeniorTag
                      ? "bg-orange-50 text-[#FF5A1F] border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:-translate-y-0.5"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-[#121417] hover:border-slate-300 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span className="font-bold">{subcat}</span>

                  {isSubSelected ? (
                    <span className="w-4 h-4 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shrink-0 shadow-xs ml-0.5 animate-reveal-up">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

