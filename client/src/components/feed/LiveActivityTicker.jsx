import React from "react";
import { Zap, CheckCircle2, Handshake, ShoppingBag, ShieldCheck, Flame } from "lucide-react";

const LIVE_EVENTS = [
  {
    type: "deal",
    icon: Handshake,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    text: "Rohan Verma accepted ₹50 deal for OS Galvin Book (Hostel 4)",
    time: "2m ago",
  },
  {
    type: "store",
    icon: ShoppingBag,
    color: "text-[#FF5A1F] bg-orange-50 border-orange-200",
    text: "UniMandi SAC Counter dispensed Casio 991CW Calculator pass",
    time: "4m ago",
  },
  {
    type: "urgent",
    icon: Flame,
    color: "text-rose-700 bg-rose-50 border-rose-200",
    text: "Priya Patel posted Urgent TI-84 Graphic Calculator (₹1,800)",
    time: "7m ago",
  },
  {
    type: "verified",
    icon: ShieldCheck,
    color: "text-teal-700 bg-teal-50 border-teal-200",
    text: "Sneha Kulkarni verified with college email (Civil 3rd Year)",
    time: "11m ago",
  },
  {
    type: "deal",
    icon: CheckCircle2,
    color: "text-amber-700 bg-amber-50 border-amber-200",
    text: "Hero Sprint 21-Speed Cycle rented for 1 semester",
    time: "15m ago",
  },
];

export const LiveActivityTicker = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-white text-[#121417] border border-slate-200/90 shadow-2xs py-2.5 px-3 flex items-center gap-3 text-xs">
      {/* Live Badge */}
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 text-[#121417] font-bold shrink-0 border border-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Campus Live</span>
      </div>

      {/* Scrolling Ticker Track */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {/* Double items for continuous loop */}
          {[...LIVE_EVENTS, ...LIVE_EVENTS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="inline-flex items-center gap-2 text-slate-700">
                <span className={`p-1 rounded-md border ${item.color} shrink-0`}>
                  <Icon className="w-3 h-3" />
                </span>
                <span className="font-semibold text-[11px] text-[#121417]">{item.text}</span>
                <span className="text-[10px] text-slate-400 font-mono">({item.time})</span>
                <span className="text-slate-300 mx-2">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
