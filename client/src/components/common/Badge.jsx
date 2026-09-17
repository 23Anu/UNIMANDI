import React from "react";
import { CheckCircle2, Clock, CheckCheck, ShieldCheck } from "lucide-react";

export const StatusBadge = ({ status }) => {
  switch (status) {
    case "Available":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-moss-50 text-moss-700 border border-moss-500/30">
          <span className="w-2 h-2 rounded-full bg-moss-500 animate-pulse"></span>
          Available
        </span>
      );
    case "Reserved":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rust-50 text-rust-700 border border-rust-500/30">
          <Clock className="w-3.5 h-3.5 text-rust-500" />
          Reserved
        </span>
      );
    case "Sold":
    case "Rented Out":
    case "Sold / Rented Out":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-300 text-navy-800 border border-slate-400/40">
          <CheckCheck className="w-3.5 h-3.5 text-navy-800" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-cream-200 text-navy-800">
          {status}
        </span>
      );
  }
};

export const VerifiedBadge = ({ isVerified, showText = true }) => {
  if (!isVerified) return null;
  return (
    <span
      title="College Verified Student"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-moss-50 text-moss-700 border border-moss-500/30 shrink-0"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-moss-500 fill-moss-100" />
      {showText && <span>Verified</span>}
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const isRent = type === "Rent";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase ${
        isRent
          ? "bg-marigold-500/20 text-marigold-700 border border-marigold-500/30"
          : "bg-navy-800 text-cream-100"
      }`}
    >
      {type}
    </span>
  );
};
