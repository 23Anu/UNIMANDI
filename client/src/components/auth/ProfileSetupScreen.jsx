import React, { useState } from "react";
import { GraduationCap, Sparkles, Building, Phone, ArrowRight, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BRANCHES, YEARS } from "../../data/seedListings";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
];

export const ProfileSetupScreen = () => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [branch, setBranch] = useState(currentUser?.branch || "Computer Engineering");
  const [year, setYear] = useState(currentUser?.year || "2nd Year");
  const [college, setCollege] = useState(currentUser?.college || "National Institute of Technology");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_OPTIONS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || "Student",
      branch,
      year,
      college,
      phone: phone.trim(),
      avatar,
      isProfileComplete: true,
    });
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 text-navy-800">
      <div className="max-w-lg w-full mx-auto bg-cream-50 rounded-3xl shadow-modal border border-cream-300 p-6 sm:p-8 animate-reveal-up text-left">
        
        {/* Progress header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-marigold-600">
              Quick Setup (~1 min)
            </span>
            <h2 className="font-serif font-bold text-2xl text-navy-800 mt-0.5">
              Complete Your Campus Profile
            </h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-marigold-500/20 text-marigold-700 flex items-center justify-center font-bold text-xs">
            2/2
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar selector */}
          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-2">
              Choose Profile Photo
            </label>
            <div className="flex items-center gap-3">
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(imgUrl)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === imgUrl
                      ? "border-marigold-500 ring-2 ring-marigold-500/30 scale-105"
                      : "border-cream-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                Academic Branch *
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800"
              >
                {BRANCHES.filter((b) => b !== "All Branches").map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                Current Year *
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800"
              >
                {YEARS.filter((y) => y !== "All Years").map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
              College / University Name
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
              Recovery Phone (Private, only shown when deal starts)
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="btn-primary w-full text-xs py-3 font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Campus Feed</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
