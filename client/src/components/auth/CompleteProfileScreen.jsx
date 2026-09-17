import React, { useState } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  FileBadge,
  Home,
  Navigation,
  Compass,
  Check,
  Building2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BRANCHES, YEARS, RESIDENCE_TYPES, INDIAN_STATES } from "../../data/seedListings";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
];

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

export const CompleteProfileScreen = () => {
  const { currentUser, completeFullProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_OPTIONS[0]);
  const [bio, setBio] = useState(currentUser?.bio || "Student at NIT. Looking to rent & sell academic gear.");

  // Academic Details
  const [college, setCollege] = useState(currentUser?.college || "National Institute of Technology");
  const [rollNo, setRollNo] = useState(currentUser?.rollNo || "2024CS" + Math.floor(100 + Math.random() * 900));
  const [branch, setBranch] = useState(currentUser?.branch || "Computer Engineering");
  const [year, setYear] = useState(currentUser?.year || "2nd Year");
  const [semester, setSemester] = useState(currentUser?.semester || "4th Semester");

  // Comprehensive Real-World Address Details
  const [addressType, setAddressType] = useState(currentUser?.addressType || RESIDENCE_TYPES[0]);
  const [roomNo, setRoomNo] = useState(currentUser?.roomNo || "Room 204");
  const [buildingName, setBuildingName] = useState(currentUser?.buildingName || (currentUser?.hostel || "Hostel Block 4 (Senior Boys)"));
  const [streetArea, setStreetArea] = useState(currentUser?.streetArea || "South Campus Lane, Near Central Mess");
  const [landmark, setLandmark] = useState(currentUser?.landmark || "Opposite Volleyball Ground");
  const [city, setCity] = useState(currentUser?.city || "Pune");
  const [state, setState] = useState(currentUser?.state || "Maharashtra");
  const [pincode, setPincode] = useState(currentUser?.pincode || "411038");
  const [pickupLocation, setPickupLocation] = useState(currentUser?.pickupLocation || PREFERRED_MEETUPS[0]);

  // Verification States
  const [email, setEmail] = useState(currentUser?.email || "");
  const [emailCodeInput, setEmailCodeInput] = useState("");
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(currentUser?.isVerified || false);

  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(currentUser?.isPhoneVerified || false);

  // Compute clean formatted full address
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

  // Email verification mock trigger
  const handleSendEmailCode = () => {
    if (!email.trim()) {
      alert("Please enter your college email ID.");
      return;
    }
    setIsEmailCodeSent(true);
  };

  const handleVerifyEmailCode = () => {
    if (emailCodeInput === "123456" || emailCodeInput === "882190" || emailCodeInput.length === 6) {
      setIsEmailVerified(true);
      setIsEmailCodeSent(false);
    } else {
      alert("Invalid verification code. Use 123456 for demo.");
    }
  };

  // Phone OTP trigger
  const handleSendPhoneOtp = () => {
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    setIsPhoneOtpSent(true);
  };

  const handleVerifyPhoneOtp = () => {
    if (phoneOtpInput === "123456" || phoneOtpInput.length === 6) {
      setIsPhoneVerified(true);
      setIsPhoneOtpSent(false);
    } else {
      alert("Invalid OTP. Use 123456 for demo.");
    }
  };

  const handleNext = () => {
    if (step === 1 && (!college.trim() || !rollNo.trim())) {
      alert("Please fill in your college name and student roll number.");
      return;
    }
    if (step === 2) {
      if (!roomNo.trim() || !buildingName.trim() || !streetArea.trim() || !city.trim() || !pincode.trim()) {
        alert("Please complete the required address fields (Room/Flat, Building/Hostel name, Area, City, and Pincode).");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setIsFinished(true);

    const fullFormatted = getFormattedAddress();

    setTimeout(() => {
      completeFullProfile({
        name,
        avatar,
        bio,
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
        hostel: buildingName, // backward compatibility
        email,
        isEmailVerified,
        phone,
        isPhoneVerified,
        isAddressVerified: true,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 text-[#121417]">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 animate-reveal-up text-left">
        
        {/* Top Header & Progress */}
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F]">
                Verified Campus Onboarding
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121417]">
                Complete Your Profile
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#121417] bg-orange-50 text-[#FF5A1F] px-2.5 py-1 rounded-full border border-orange-200">
                Step {step} of 4
              </span>
              <span className="block text-[11px] text-slate-500 font-medium mt-1">
                {step === 1 ? "College & Branch" : step === 2 ? "Full Address & Meetup" : step === 3 ? "Email & Phone Verify" : "Identity & Summary"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-[#FF5A1F] to-[#E04812] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {isFinished ? (
          <div className="py-12 text-center flex flex-col items-center justify-center animate-reveal-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-bold text-2xl text-[#121417] mb-2">
              Profile & Address Verified!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Your academic credentials and delivery address have been securely saved. Redirecting to your personalized feed...
            </p>
          </div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
            
            {/* STEP 1: College Details & Academic Branch */}
            {step === 1 && (
              <div className="space-y-3.5 animate-reveal-up">
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-slate-700 text-xs flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                  <span>🎓 <strong>Academic Smart Matching</strong>: We personalize study materials, lab kits, and syllabus books tailored for your branch & year.</span>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    College / University Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology (NIT)"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    Student Roll Number / Campus Registration ID *
                  </label>
                  <div className="relative">
                    <FileBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 2024CS104"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Academic Branch *
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    >
                      {BRANCHES.filter((b) => b !== "All Branches").map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Academic Year *
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    >
                      {YEARS.filter((y) => y !== "All Years").map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Real-World Comprehensive Address Info */}
            {step === 2 && (
              <div className="space-y-4 animate-reveal-up">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#121417] mb-1">
                    <MapPin className="w-4 h-4 text-[#FF5A1F]" />
                    <span>Real-World Residence & Delivery Address</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Provide your complete accommodation details (Campus Hostel, Private PG, Shared Flat, or Home Address) for trusted meetups, item handovers, and delivery.
                  </p>
                </div>

                {/* 1. Residence Type Selector */}
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1.5">
                    Residence / Accommodation Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {RESIDENCE_TYPES.map((type) => {
                      const isSelected = addressType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressType(type)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "bg-orange-50/80 border-[#FF5A1F] text-[#121417] shadow-2xs font-bold"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="text-base">
                            {type.includes("Hostel") ? "🏢" : type.includes("PG") ? "🏠" : type.includes("Home") ? "🏡" : "🏬"}
                          </span>
                          <span className="text-[11px] leading-tight line-clamp-2">
                            {type}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Flat / Room No. & Building / Hostel / PG Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Flat / Room / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="e.g. Room 204 / Flat 4B / House #12"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      {addressType.includes("Hostel")
                        ? "Hostel Block / Name *"
                        : addressType.includes("PG")
                        ? "PG Name / Building *"
                        : "Society / Building / House Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      placeholder="e.g. Hostel Block 4 / Stanza PG / Royal Palms"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>

                {/* 3. Street / Area & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Street / Colony / Campus Zone *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetArea}
                      onChange={(e) => setStreetArea(e.target.value)}
                      placeholder="e.g. South Campus Lane / Gate 2 Road / Sector 14"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Prominent Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Central Mess / Near SBI ATM"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>

                {/* 4. City, State & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Pune / Delhi / Bengaluru"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                      Pincode / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 411038"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>

                {/* 5. Preferred Meetup / Handover Spot */}
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    Preferred Handover / Meetup Spot *
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                  >
                    {PREFERRED_MEETUPS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Live Formatted Address Card */}
                <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#FF5A1F]">
                    <span>Formatted Full Address Preview</span>
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" />
                      Auto-Structured
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#121417] leading-relaxed">
                    {getFormattedAddress() || "Fill the above fields to preview your complete address"}
                  </p>
                </div>

              </div>
            )}

            {/* STEP 3: Dual Verification (College Email + Phone OTP) */}
            {step === 3 && (
              <div className="space-y-4 animate-reveal-up">
                
                {/* 1. College Email Verification Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#121417]">
                      <Mail className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Official College Email Verification</span>
                    </div>
                    {isEmailVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rollno@nit.edu or student@college.ac.in"
                      disabled={isEmailVerified}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#121417] disabled:opacity-60"
                    />
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendEmailCode}
                        className="btn-secondary text-xs py-2 px-3 shrink-0"
                      >
                        Send Code
                      </button>
                    )}
                  </div>

                  {isEmailCodeSent && !isEmailVerified && (
                    <div className="flex gap-2 pt-1 animate-reveal-up">
                      <input
                        type="text"
                        maxLength={6}
                        value={emailCodeInput}
                        onChange={(e) => setEmailCodeInput(e.target.value)}
                        placeholder="Enter 6-digit code (Use 123456)"
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-center font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailCode}
                        className="btn-primary text-xs py-2 px-3 font-bold shrink-0"
                      >
                        Verify Code
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Mobile Phone OTP Verification Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#121417]">
                      <Phone className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Phone Number (SMS OTP Verification)</span>
                    </div>
                    {isPhoneVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        disabled={isPhoneVerified}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#121417] disabled:opacity-60"
                      />
                    </div>
                    {!isPhoneVerified && (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        className="btn-secondary text-xs py-2 px-3 shrink-0"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>

                  {isPhoneOtpSent && !isPhoneVerified && (
                    <div className="flex gap-2 pt-1 animate-reveal-up">
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpInput}
                        onChange={(e) => setPhoneOtpInput(e.target.value)}
                        placeholder="Enter 6-digit OTP (Use 123456)"
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-center font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className="btn-primary text-xs py-2 px-3 font-bold shrink-0"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🛡️ <strong>Zero-Spam Privacy Protection</strong>: Your phone number and private room address are only revealed to confirmed deal partners.</span>
                </div>

              </div>
            )}

            {/* STEP 4: Profile Identity, Avatar & Summary */}
            {step === 4 && (
              <div className="space-y-4 animate-reveal-up">
                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-2">
                    Choose Your Campus Avatar
                  </label>
                  <div className="flex items-center gap-3">
                    {AVATAR_OPTIONS.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(imgUrl)}
                        className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                          avatar === imgUrl
                            ? "border-[#FF5A1F] ring-2 ring-[#FF5A1F]/30 scale-105"
                            : "border-slate-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 text-[10px] mb-1">
                    Campus Bio / Academic Interests
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. 2nd Year ECE student. Selling semester books, calc & lab kits!"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                  />
                </div>

                {/* Comprehensive Onboarding Review Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-[#121417] uppercase text-[10px] tracking-wider">
                      Onboarding Summary
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      Ready to Verify
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">College & Roll</span>
                      <strong className="text-[#121417] text-xs">{college} ({rollNo})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Branch & Year</span>
                      <strong className="text-[#121417] text-xs">{branch} • {year}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Residence & Delivery Address</span>
                    <strong className="text-[#121417] text-xs block mt-0.5 font-medium">
                      {getFormattedAddress()}
                    </strong>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                        {addressType}
                      </span>
                      <span>• Meetup: <strong className="text-[#121417]">{pickupLocation}</strong></span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary text-xs py-2.5 px-5 ml-auto font-bold"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary text-xs py-3 px-6 ml-auto font-bold shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Finish & Enter Campus Marketplace</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

