import React from "react";
import { PlusCircle, Sparkles, IndianRupee, ArrowRight, Zap, Coins } from "lucide-react";

export const InFeedSellBanner = ({ onPostClick }) => {
  return (
    <div className="col-span-full my-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121417] via-[#1E2128] to-[#2B2F38] text-white border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden group">
      
      {/* Background ambient light */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF5A1F]/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none animate-float" />

      {/* Floating 3D Coin Graphics */}
      <div className="absolute top-4 right-1/3 text-2xl animate-bounce-subtle pointer-events-none opacity-60">
        💸
      </div>
      <div className="absolute bottom-4 right-1/4 text-xl animate-float-delayed pointer-events-none opacity-50">
        ⚡
      </div>

      <div className="space-y-2.5 z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A1F]/20 text-[#FF7A45] text-[11px] font-bold uppercase tracking-wider border border-[#FF5A1F]/30 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>Earn Extra Pocket Cash</span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-snug">
          Hostel room me unused books, calculator ya drafter pada hai?
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          List it in 60 seconds. Sell or rent directly to your juniors on campus. 100% free, zero broker commission, instant cash in hand!
        </p>
      </div>

      <div className="z-10 shrink-0 w-full sm:w-auto">
        <button
          onClick={onPostClick}
          className="btn-primary w-full sm:w-auto py-3.5 px-7 text-sm font-bold shadow-lg hover:shadow-[#FF5A1F]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4 animate-bounce-subtle" />
          <span>Post an Item in 1 Min</span>
        </button>
      </div>

    </div>
  );
};

