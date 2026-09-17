import React from "react";
import { ShieldCheck, BookOpen, Sparkles, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-cream-300 bg-cream-50/50 py-12 pb-24 md:pb-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
          
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <img
                src="/logo.png"
                alt="UNIMANDI"
                className="w-8 h-8 object-contain rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs"
              />
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-navy-800 tracking-tight">
                  UNI<span className="text-[#FF5A1F]">MANDI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-[#FF5A1F]">
                  Campus MVP
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-[#FF5A1F] mb-1.5">
              Buy • Sell • Rent • Connect
            </p>
            <p className="leading-relaxed text-slate-600 max-w-sm">
              Trust-verified campus rental & resale mandi. Connecting juniors, seniors, and students across academic departments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-navy-800 uppercase tracking-wider text-[11px] mb-3">
              Campus Trust & Safety
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-moss-500" />
                <span>College Email Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-marigold-600" />
                <span>Two-Sided Deal Confirmation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-navy-800" />
                <span>5-Star Post-Deal Trust Ratings</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-navy-800 uppercase tracking-wider text-[11px] mb-3">
              MVP Information
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Phase 0: Single College Pilot • Cash-on-meetup protocol. No personal phone numbers shared without consent.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 UNIMANDI Marketplace. Built for university campuses.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rust-500 fill-rust-500" /> for student communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
