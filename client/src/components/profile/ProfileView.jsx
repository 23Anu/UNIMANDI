import React, { useState } from "react";
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  Edit2,
  Save,
  Sparkles,
  Building,
  MapPin,
  FileBadge,
  LogOut,
  Home,
  Check,
  Navigation
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { VerifiedBadge } from "../common/Badge";
import { BRANCHES, YEARS, RESIDENCE_TYPES, INDIAN_STATES } from "../../data/seedListings";

const SEMESTERS = [
  "1st Semester", "2nd Semester", "3rd Semester", "4th Semester",
  "5th Semester", "6th Semester", "7th Semester", "8th Semester"
];

const PREFERRED_MEETUPS = [
  "Central Library / SAC Hub",
  "Hostel Lobby / Main Gate",
  "Main Campus Canteen",
  "Direct PG / Doorstep Pickup",
  "Campus Metro Station / Gate 1"
];

export const ProfileView = ({ onNavigateMyListings }) => {
  const { currentUser, updateProfile, verifyCollegeEmail, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [college, setCollege] = useState(currentUser.college || "National Institute of Technology");
  const [rollNo, setRollNo] = useState(currentUser.rollNo || "2024CS104");
  const [branch, setBranch] = useState(currentUser.branch);
  const [year, setYear] = useState(currentUser.year);
  const [semester, setSemester] = useState(currentUser.semester || "4th Semester");
  
  // Real-world address states
  const [addressType, setAddressType] = useState(currentUser.addressType || RESIDENCE_TYPES[0]);
  const [roomNo, setRoomNo] = useState(currentUser.roomNo || "Room 212");
  const [buildingName, setBuildingName] = useState(currentUser.buildingName || (currentUser.hostel || "Hostel Block 4 (Senior Boys)"));
  const [streetArea, setStreetArea] = useState(currentUser.streetArea || "South Campus Lane, Near Central Mess");
  const [landmark, setLandmark] = useState(currentUser.landmark || "Opposite Volleyball Ground");
  const [city, setCity] = useState(currentUser.city || "Pune");
  const [state, setState] = useState(currentUser.state || "Maharashtra");
  const [pincode, setPincode] = useState(currentUser.pincode || "411038");
  const [pickupLocation, setPickupLocation] = useState(currentUser.pickupLocation || PREFERRED_MEETUPS[0]);
  const [phone, setPhone] = useState(currentUser.phone || "");

  // Email verification input state
  const [collegeEmailInput, setCollegeEmailInput] = useState(currentUser.email || "");
  const [verificationFeedback, setVerificationFeedback] = useState(null);

  const getFormattedAddress = () => {
    const parts = [
      roomNo.trim(),
      buildingName.trim(),
      streetArea.trim(),
      landmark.trim() ? `Near ${landmark.trim()}` : null,
      city.trim(),
      state.trim() ? `${state.trim()} - ${pincode.trim()}` : pincode.trim(),
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const fullFormatted = getFormattedAddress();
    updateProfile({
      name,
      college,
      rollNo,
      branch,
      year,
      semester,
      addressType,
      roomNo,
      buildingName,
      streetArea,
      landmark,
      city,
      state,
      pincode,
      pickupLocation,
      fullAddress: fullFormatted,
      hostel: buildingName,
      phone,
      isAddressVerified: true,
    });
    setIsEditing(false);
  };

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const res = verifyCollegeEmail(collegeEmailInput);
    setVerificationFeedback(res);
    setTimeout(() => {
      setVerificationFeedback(null);
    }, 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left animate-reveal-up pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl text-[#121417]">
                  {currentUser.name}
                </h1>
                <VerifiedBadge isVerified={currentUser.isVerified} />
              </div>

              <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                <GraduationCap className="w-4 h-4 text-[#FF5A1F]" />
                <span>{currentUser.branch} • {currentUser.year} ({currentUser.semester || "4th Sem"})</span>
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.college || "National Institute of Technology"}</span>
                </span>
                {currentUser.rollNo && (
                  <span className="font-mono font-bold text-[#121417] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    ID: {currentUser.rollNo}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary text-xs py-2 px-3.5 shadow-2xs font-bold"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-xs animate-reveal-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Roll Number / Student ID</label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Academic Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                >
                  {BRANCHES.filter((b) => b !== "All Branches").map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Current Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                >
                  {YEARS.filter((y) => y !== "All Years").map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Edit Block */}
            <div className="pt-3 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-[#121417]">
                <MapPin className="w-4 h-4 text-[#FF5A1F]" />
                <span>Residence & Delivery Address</span>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Residence Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium"
                >
                  {RESIDENCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Room / Flat / House No.</label>
                  <input
                    type="text"
                    required
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="e.g. Room 204"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Building / Hostel / PG Name</label>
                  <input
                    type="text"
                    required
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="e.g. Hostel Block 4 / Stanza PG"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Street / Area / Sector</label>
                  <input
                    type="text"
                    required
                    value={streetArea}
                    onChange={(e) => setStreetArea(e.target.value)}
                    placeholder="e.g. South Campus Lane"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Central Mess"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">Preferred Meetup Spot</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417]"
                >
                  {PREFERRED_MEETUPS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn-primary text-xs py-2.5 px-5 font-bold shadow-sm">
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Real-World Residence & Delivery Address Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-[#121417] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF5A1F]" />
            <span>Verified Residence & Delivery Address</span>
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Address Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Residence Type</span>
            <span className="font-bold text-[#121417] text-xs flex items-center gap-1.5">
              <span>{currentUser.addressType?.includes("Hostel") ? "🏢" : currentUser.addressType?.includes("PG") ? "🏠" : "🏡"}</span>
              <span>{currentUser.addressType || "Campus Hostel / Dorm"}</span>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Preferred Meetup / Handover Spot</span>
            <span className="font-bold text-[#121417] text-xs flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>{currentUser.pickupLocation || "Central Library / SAC Hub"}</span>
            </span>
          </div>
        </div>

        <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200/60 text-xs">
          <span className="text-[10px] font-bold uppercase text-[#FF5A1F] block mb-1 tracking-wider">
            Full Registered Delivery Address
          </span>
          <p className="font-semibold text-[#121417] text-sm leading-relaxed">
            {currentUser.fullAddress || `${currentUser.roomNo || "Room 204"}, ${currentUser.buildingName || currentUser.hostel || "Hostel Block 4"}, ${currentUser.city || "Pune"}, ${currentUser.state || "Maharashtra"} - ${currentUser.pincode || "411038"}`}
          </p>
        </div>
      </div>


      {/* Trust & Dual Verification Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* College Email & Phone Verification */}
        <div className="bg-cream-50 rounded-3xl p-6 border border-cream-300 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-moss-500" />
              <h3 className="font-serif font-bold text-base text-navy-800">
                Identity & Contact Verification
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Verified campus profiles get 3x higher inquiries and trusted deal confirmations.
            </p>

            <div className="space-y-2.5">
              {/* College Email Badge */}
              <div className="p-3 rounded-2xl bg-moss-50 border border-moss-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-moss-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-moss-800 block truncate">
                      {currentUser.email || "student@campus.edu"}
                    </span>
                    <span className="text-[10px] text-moss-600">College Email Verified</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-moss-500 shrink-0" />
              </div>

              {/* Phone OTP Status */}
              <div className="p-3 rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-marigold-600 shrink-0" />
                  <div>
                    <span className="font-bold text-navy-800 block">
                      {currentUser.phone || "+91 98765 43210"}
                    </span>
                    <span className="text-[10px] text-slate-500">Phone Verified (Kept Private)</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-moss-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust Score & Deals */}
        <div className="bg-cream-50 rounded-3xl p-6 border border-cream-300 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-marigold-500 fill-marigold-500" />
              <h3 className="font-serif font-bold text-base text-navy-800">
                Trust Score & Rating
              </h3>
            </div>

            <div className="flex items-baseline gap-3 my-3">
              <span className="font-serif font-black text-4xl text-navy-800">
                {currentUser.trustScore || "4.9"}
              </span>
              <div className="text-xs text-slate-500">
                <span className="block font-semibold text-navy-800">Overall Rating (5.0 max)</span>
                <span>Based on completed campus handoffs</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Successful Deals:</span>
                <strong className="text-navy-800">{currentUser.dealsCount || 12} transactions</strong>
              </div>
              <div className="flex justify-between">
                <span>Deal Confirmation Rate:</span>
                <strong className="text-moss-600">100% Verified Two-Sided</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-200">
              <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                Top Trust Badges Earned:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["On time", "Item as described", "Helpful senior"].map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-0.5 rounded-md bg-cream-200 text-navy-800 text-[10px] font-semibold"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Shortcut to My Listings */}
      <div className="p-6 rounded-3xl bg-cream-200/60 border border-cream-300 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-bold text-base text-navy-800">
            Want to see or manage your active items?
          </h4>
          <p className="text-xs text-slate-500">
            View active listings, mark items reserved, or check views.
          </p>
        </div>

        <button
          onClick={onNavigateMyListings}
          className="btn-primary text-xs py-2 px-4 shrink-0 shadow-sm"
        >
          Manage Listings
        </button>
      </div>

    </div>
  );
};
