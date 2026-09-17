import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Lock,
  CheckCircle2,
  BookOpen,
  Layers,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LoginScreen = () => {
  const { loginWithGoogle, loginWithCollegeEmail, loginWithPhone, registeredUsers } = useAuth();

  const [authMethod, setAuthMethod] = useState("google"); // "google" | "email" | "phone"
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleNameInput, setGoogleNameInput] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Quick Google Sign-In
  const handleGoogleSubmit = (e) => {
    e?.preventDefault();
    if (googleEmailInput.trim()) {
      loginWithGoogle({
        email: googleEmailInput.trim(),
        name: googleNameInput.trim() || googleEmailInput.split("@")[0],
      });
    } else {
      // Default standard Google sign-in with first senior persona
      loginWithGoogle();
    }
  };

  // College Email Sign-In
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginWithCollegeEmail(emailInput.trim(), nameInput.trim());
  };

  // Phone OTP Sign-In
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpInput.trim()) return;
    loginWithPhone(phoneInput.trim(), otpInput.trim());
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-navy-800">
      
      {/* Top Header / Branding */}
      <div className="max-w-md w-full mx-auto text-center pt-2 pb-6">
        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-cream-300/80 mb-3">
          <img src="/logo.png" alt="UNIMANDI" className="w-16 h-16 object-contain rounded-xl" />
        </div>
        <h1 className="font-display font-black text-3xl text-navy-800 tracking-tight">
          UNI<span className="text-[#FF5A1F]">MANDI</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] mt-1">
          Buy • Sell • Rent • Connect
        </p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Campus Rental & Resale Marketplace
        </p>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-cream-50 rounded-3xl shadow-modal border border-cream-300 p-6 sm:p-8 animate-reveal-up text-left">
        
        <div className="mb-6">
          <h2 className="font-serif font-bold text-xl text-navy-800">
            Sign in to your Campus Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access verified books, electronics, and lab equipment from your peers.
          </p>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-cream-200/80 rounded-2xl border border-cream-300 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMethod("google")}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              authMethod === "google"
                ? "bg-navy-800 text-cream-100 shadow-sm"
                : "text-slate-600 hover:text-navy-800"
            }`}
          >
            Google Auth
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              authMethod === "email"
                ? "bg-navy-800 text-cream-100 shadow-sm"
                : "text-slate-600 hover:text-navy-800"
            }`}
          >
            College Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("phone")}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              authMethod === "phone"
                ? "bg-navy-800 text-cream-100 shadow-sm"
                : "text-slate-600 hover:text-navy-800"
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* METHOD 1: Google OAuth API */}
        {authMethod === "google" && (
          <div className="space-y-4 animate-reveal-up">
            {/* Direct 1-Click Google Button */}
            <button
              onClick={() => handleGoogleSubmit()}
              className="w-full py-3 px-4 rounded-2xl bg-cream-50 hover:bg-cream-200/80 border-2 border-cream-300 text-navy-800 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-cream-300"></div>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Or Custom Google Account</span>
              <div className="flex-1 h-px bg-cream-300"></div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                  Google Email ID
                </label>
                <input
                  type="email"
                  placeholder="student@gmail.com or campus email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aryan Khan"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-xs py-2.5 shadow-sm font-bold mt-2"
              >
                <span>Sign in with this Google Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* METHOD 2: College Email Login */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs animate-reveal-up">
            <div className="p-3 rounded-2xl bg-moss-50 border border-moss-500/30 text-moss-700 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-moss-500 shrink-0" />
              <span>Logging in with an official <strong>.edu</strong> or <strong>.ac.in</strong> email grants instant "Verified Student" badge.</span>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                Official College Email *
              </label>
              <input
                type="email"
                required
                placeholder="rollno@nit.edu or student@college.ac.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                Student Name
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Patel"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-xs py-2.5 shadow-sm font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue with College Email</span>
            </button>
          </form>
        )}

        {/* METHOD 3: Phone OTP */}
        {authMethod === "phone" && (
          <div className="space-y-3.5 text-xs animate-reveal-up">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full pl-12 pr-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 text-xs focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs py-2.5 shadow-sm font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Send Login OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 animate-reveal-up">
                <div className="p-2.5 rounded-xl bg-cream-200 text-navy-800 text-[11px] flex justify-between items-center">
                  <span>OTP sent to: <strong>+91 {phoneInput}</strong></span>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-marigold-600 underline text-[10px]"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
                    Enter 6-Digit OTP (Use: 123456)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full tracking-widest text-center text-base font-bold px-3.5 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-navy-800 focus:outline-none focus:ring-2 focus:ring-marigold-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs py-2.5 shadow-sm font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify OTP & Enter</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Demo Fast-Login Personas (For testing seniors, buyers, sellers in 1 click) */}
        <div className="mt-6 pt-5 border-t border-cream-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
            Or Test with Campus Demo Profiles:
          </p>

          <div className="space-y-1.5">
            {/* Dedicated UniMandi Store Login Button */}
            <button
              onClick={() => {
                const storeUser = registeredUsers.find((u) => u.id === "user_kampus_store") || {
                  id: "user_kampus_store",
                  name: "UniMandi Official SAC Store & Print Hub",
                  email: "store.sac@campus.edu",
                  branch: "Official Campus Store",
                  year: "Counter #2 SAC",
                  role: "merchant",
                  isVerified: true,
                  isProfileComplete: true,
                  avatar: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=150&auto=format&fit=crop&q=80"
                };
                loginWithGoogle(storeUser);
              }}
              className="w-full p-2.5 rounded-xl bg-[#121417] text-white hover:bg-[#23262F] text-left transition-all flex items-center justify-between shadow-xs border border-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A1F] flex items-center justify-center text-white font-bold">
                  🏪
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      UniMandi Official SAC Store
                    </span>
                    <span className="text-[9px] bg-[#FF5A1F] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                      Counter Login
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">
                    Verify QR Codes, Manage Stock & Dispense Orders
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
            </button>

            {registeredUsers.filter((u) => u.id !== "user_kampus_store" && u.id !== "user_tanish_store").slice(0, 3).map((user) => (
              <button
                key={user.id}
                onClick={() => loginWithGoogle({ email: user.email, name: user.name, avatar: user.avatar })}
                className="w-full p-2 rounded-xl bg-cream-100 hover:bg-cream-200/90 border border-cream-300 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cream-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-navy-800 block">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {user.branch} • {user.year}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Trust & Safety highlights */}
      <div className="max-w-md w-full mx-auto text-center mt-6 text-slate-500 text-xs flex justify-center gap-4">
        <span>🔒 Zero spam groups</span>
        <span>•</span>
        <span>🤝 Verified meetups</span>
        <span>•</span>
        <span>⚡ 100% In-app safe</span>
      </div>

    </div>
  );
};
