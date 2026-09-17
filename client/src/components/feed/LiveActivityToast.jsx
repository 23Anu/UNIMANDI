import React, { useState, useEffect } from "react";
import {
  Handshake,
  ShoppingBag,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  Radio,
  ArrowRight
} from "lucide-react";

const CAMPUS_ACTIVITIES = [
  {
    id: 1,
    student: "Aryan Mehta",
    branch: "CSE 3rd Yr",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    action: "Closed ₹400 Deal",
    item: "Operating Systems Galvin 10th Ed.",
    type: "deal",
    time: "Just now",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Handshake,
  },
  {
    id: 2,
    student: "Sneha Patel",
    branch: "ECE 2nd Yr",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    action: "SAC Store Pass Issued",
    item: "Casio fx-991CW ClassWiz",
    type: "store",
    time: "2 mins ago",
    badgeColor: "bg-[#FF5A1F]/20 text-[#FF7A45] border-[#FF5A1F]/30",
    icon: ShoppingBag,
  },
  {
    id: 3,
    student: "Kabir Sharma",
    branch: "Mech 4th Yr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    action: "Urgent Hostel Listing",
    item: "Hero Sprint 21-Speed Gear Bicycle",
    type: "urgent",
    time: "4 mins ago",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    icon: Flame,
  },
  {
    id: 4,
    student: "Ananya Iyer",
    branch: "Civil 3rd Yr",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    action: "Rented Lab Component",
    item: "Mini Drafter & Engineering Sheet Kit",
    type: "deal",
    time: "7 mins ago",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  {
    id: 5,
    student: "Rohan Verma",
    branch: "EE 2nd Yr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    action: "Campus Verified",
    item: "College Roll No: 2023EE1045",
    type: "verified",
    time: "10 mins ago",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    icon: ShieldCheck,
  },
];

export const LiveActivityToast = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % CAMPUS_ACTIVITIES.length);
        setAnimating(false);
      }, 400);
    }, 6500);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = CAMPUS_ACTIVITIES[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 max-w-sm pointer-events-auto animate-reveal-up">
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#121417]/95 text-white backdrop-blur-xl border border-slate-700/80 p-3.5 shadow-2xl transition-all duration-400 flex items-center gap-3.5 ${
          animating ? "opacity-0 -translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Ambient Glow Accent */}
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-[#FF5A1F]/30 rounded-full blur-xl pointer-events-none" />

        {/* Student Avatar with Live Radar Ring */}
        <div className="relative shrink-0">
          <img
            src={current.avatar}
            alt={current.student}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#121417] items-center justify-center border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
          </span>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-xs text-white truncate">
              {current.student}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({current.branch})
            </span>
          </div>

          <p className="text-xs text-slate-200 truncate font-semibold">
            {current.item}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${current.badgeColor}`}
            >
              <IconComponent className="w-3 h-3" />
              <span>{current.action}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {current.time}
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Dismiss campus notifications"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
