import React from "react";
import { ShieldCheck, Star, CheckCircle, GraduationCap } from "lucide-react";
import { VerifiedBadge } from "../common/Badge";

export const SellerCard = ({ seller }) => {
  if (!seller) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
        Listed By Verified Peer / Senior
      </div>

      <div className="flex items-start gap-3">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-display font-bold text-[#121417] text-sm truncate">
              {seller.name}
            </h4>
            <VerifiedBadge isVerified={seller.isVerified} />
          </div>

          <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{seller.branch} • {seller.year}</span>
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1 font-bold text-[#121417]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{seller.trustScore || "4.9"}</span>
              <span className="font-normal text-slate-500">Trust Score</span>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{seller.dealsCount || 8} campus deals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

