import React, { useState, useEffect } from "react";
import {
  Sparkles,
  PlusCircle,
  Compass,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SHOWCASE_SLIDES = [
  {
    keyword: "Textbooks & Notes",
    title: "CLRS Algorithms + Handwritten Notes",
    category: "Books & Notes",
    price: "₹60",
    unit: "/week",
    type: "Rent",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    seller: "Aarav Sharma (CSE 4th Yr)",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    trust: "4.9",
    location: "Hostel Block 4 / Library",
    icon: "📚",
  },
  {
    keyword: "Casio Calculators",
    title: "Casio fx-991CW & TI-84 Graphic Calc",
    category: "Electronics & Tech",
    price: "₹1,800",
    unit: "",
    type: "Sell",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80",
    seller: "Priya Patel (ECE 3rd Yr)",
    sellerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    trust: "4.8",
    location: "Girls Hostel B / Canteen",
    icon: "🧮",
  },
  {
    keyword: "Arduino & Lab Kits",
    title: "Arduino UNO + 25 Sensor Lab Modules",
    category: "Project & Lab Parts",
    price: "₹150",
    unit: "/sem",
    type: "Rent",
    condition: "Brand New",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    seller: "Sneha Kulkarni (Civil 3rd Yr)",
    sellerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    trust: "4.9",
    location: "ECE Lab 3 / SAC Hub",
    icon: "⚡",
  },
  {
    keyword: "Hostel Dorm Gear",
    title: "50L Silent Low-Power Dorm Fridge",
    category: "Hostel & PG Living",
    price: "₹400",
    unit: "/month",
    type: "Rent",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80",
    seller: "Rohan Verma (Hostel 3)",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    trust: "4.7",
    location: "Hostel Block 3 Ground Floor",
    icon: "🧊",
  },
  {
    keyword: "Campus Bicycles",
    title: "Hero Sprint 21-Speed Gear Bicycle",
    category: "Cycles & Commute",
    price: "₹3,200",
    unit: "",
    type: "Sell",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    seller: "Kabir Sharma (Mech 4th Yr)",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    trust: "4.9",
    location: "Hostel 3 Cycle Stand",
    icon: "🚲",
  },
];

export const HeroBanner = ({ onBrowseClick, onPostClick }) => {
  const { currentUser } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const current = SHOWCASE_SLIDES[slideIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FFF9F5] to-[#F8F9FA] text-[#121417] p-6 sm:p-10 lg:p-12 mb-8 shadow-card border border-slate-200/90 text-left">
      
      {/* Subtle Warm Ambient Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FF5A1F]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* Left Content Area */}
        <div className="flex-1 max-w-2xl">
          {/* Official Brand Badge & Department Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5 animate-reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#121417] text-xs font-bold border border-slate-200/90 shadow-2xs">
              <img src="/logo.png" alt="UNIMANDI" className="w-4 h-4 object-contain rounded" />
              <span className="font-display font-black text-[#0F1E36]">UNI<span className="text-[#FF5A1F]">MANDI</span></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-semibold text-[11px]">Buy • Sell • Rent • Connect</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-[#FF5A1F] text-xs font-bold border border-orange-200/80 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A1F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5A1F]"></span>
              </span>
              <span className="font-bold text-[#FF5A1F]">{currentUser?.branch || "Engineering"} ({currentUser?.year || "Campus"})</span>
            </div>
          </div>

          {/* Hero Title with Dynamic Rotating Keyword */}
          <h1 className="text-2xl sm:text-3.5xl md:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-display font-black tracking-tight text-[#121417] mb-4 sm:mb-5 leading-[1.2]">
            <span className="inline">Rent or Buy </span>{" "}
            <span
              key={current.keyword}
              className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-[#E04812] border-b-2 border-[#FF5A1F]/50 pb-0.5 whitespace-nowrap animate-reveal-up"
            >
              {current.keyword}
            </span>
            <span className="block mt-1 sm:mt-1.5 text-slate-900 font-display">
              directly from seniors & peers.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-xl font-normal leading-relaxed">
            Skip spammy WhatsApp groups. Connect directly with verified seniors for semester textbooks, drafters, calculators, mini fridges, and exam materials. Zero broker fee, 100% peer-to-peer!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-6 sm:mb-8">
            <button
              onClick={onBrowseClick}
              className="btn-primary text-sm px-6 py-3.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Campus Deals</span>
            </button>

            <button
              onClick={onPostClick}
              className="btn-secondary text-sm px-6 py-3.5 shadow-xs hover:border-[#FF5A1F]/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 text-[#FF5A1F]" />
              <span>Post an Item (Free)</span>
            </button>
          </div>

          {/* Clean Campus Trust Badges Row */}
          <div className="pt-5 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">Verified ID</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-semibold text-slate-700">
              <Zap className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
              <span className="truncate">Handover</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-semibold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Zero Fee</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-semibold text-slate-700">
              <ShoppingBag className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
              <span className="truncate">SAC Pass</span>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Sliding Image Carousel Showcase */}
        <div
          className="w-full lg:w-[360px] xl:w-[400px] shrink-0 group relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card Frame with Smooth Shadow & Border */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            
            {/* Sliding Image Container */}
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
              <img
                key={current.image}
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-105 animate-reveal-up"
              />

              {/* Light Sheen Sweep Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Floating Top Left Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span className="px-2.5 py-1 rounded-full bg-[#121417]/85 text-white text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
                  <span>{current.icon}</span>
                  <span>{current.category}</span>
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
                  {current.type === "Rent" ? "For Rent" : "For Sale"}
                </span>
              </div>

              {/* Floating Price Pill (Top Right) */}
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5A1F] to-[#E04812] text-white font-display font-black text-xs shadow-md">
                  {current.price}
                  <span className="font-normal text-[10px] opacity-90">{current.unit}</span>
                </span>
              </div>

              {/* Carousel Navigation Arrows */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-[#FF5A1F] transition-colors shadow-md backdrop-blur-xs"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto hover:bg-[#FF5A1F] transition-colors shadow-md backdrop-blur-xs"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Showcase Card Details */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  Campus Verified
                </span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                  {current.condition}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#121417] line-clamp-1 leading-tight group-hover:text-[#FF5A1F] transition-colors">
                {current.title}
              </h3>

              {/* Seller info & explore action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={current.sellerAvatar}
                    alt={current.seller}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-[#121417] text-[11px] truncate leading-none">
                      {current.seller}
                    </p>
                    <span className="text-[10px] text-slate-400">{current.location}</span>
                  </div>
                </div>

                <button
                  onClick={onBrowseClick}
                  className="btn-primary py-1 px-2.5 text-[11px] font-bold rounded-lg shrink-0 shadow-2xs"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Slide Indicator Dots */}
              <div className="pt-1 flex items-center justify-center gap-1.5">
                {SHOWCASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      slideIndex === idx
                        ? "w-6 bg-[#FF5A1F]"
                        : "w-1.5 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
