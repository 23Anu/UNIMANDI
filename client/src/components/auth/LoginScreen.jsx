import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  GraduationCap,
  Loader2,
  AlertCircle,
  Store,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

export const LoginScreen = () => {
  const { loginWithGoogle, loginAsStoreOperator } = useAuth();

  const [activeTab, setActiveTab] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
  };

  const handleStoreLogin = async (e) => {
    e.preventDefault();
    setStoreError("");
    if (!passcode.trim()) return;
    setStoreLoading(true);
    try {
      await loginAsStoreOperator(passcode.trim());
    } catch (err) {
      setStoreError(err.message || "Incorrect passcode. Please try again.");
    } finally {
      setStoreLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF5A1F]/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-50/60 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">

        {/* Branding */}
        <div className="text-center mb-8 animate-reveal-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl border border-orange-100 mb-4">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#121417]">
            UNI<span className="text-[#FF5A1F]">MANDI</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F] mt-1">
            Buy • Sell • Rent • Connect
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Campus Rental &amp; Resale Marketplace</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden animate-reveal-up">

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setActiveTab("student"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === "student"
                  ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F] bg-orange-50/50"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Login
            </button>
            <button
              onClick={() => { setActiveTab("store"); setStoreError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === "store"
                  ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F] bg-orange-50/50"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <Store className="w-4 h-4" />
              Store Operator
            </button>
          </div>

          <div className="p-8">

            {/* ── STUDENT TAB ── */}
            {activeTab === "student" && (
              <div className="animate-reveal-up">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[#121417]">Welcome to UniMandi 👋</h2>
                  <p className="text-sm text-slate-500 mt-1">Sign in with your Google account to access the campus marketplace</p>
                </div>

                <div className="space-y-2.5 mb-6">
                  {["Buy, sell & rent campus essentials", "Connect with verified students only", "Secure in-app chat & deal negotiations"].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-[#FF5A1F] text-xs font-bold">✓</span>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3">
                  {loading ? (
                    <div className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing you in...
                    </div>
                  ) : (
                    <div className="w-full flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        theme="outline"
                        size="large"
                        width="320"
                        text="continue_with"
                        shape="rectangular"
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    By continuing, you agree to UniMandi's{" "}
                    <span className="text-[#FF5A1F] cursor-pointer hover:underline">Terms of Service</span>{" "}
                    and <span className="text-[#FF5A1F] cursor-pointer hover:underline">Privacy Policy</span>
                  </p>
                </div>
              </div>
            )}

            {/* ── STORE OPERATOR TAB ── */}
            {activeTab === "store" && (
              <div className="animate-reveal-up">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#121417]">SAC Store Access 🏪</h2>
                  <p className="text-sm text-slate-500 mt-1">Enter your store operator passcode to manage inventory, verify student QR passes, and view orders.</p>
                </div>

                <div className="space-y-2 mb-6">
                  {["Add & manage store products", "Scan & verify student pickup passes", "View pending orders & revenue"].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-[#FF5A1F] text-xs font-bold">✓</span>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                {storeError && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{storeError}</span>
                  </div>
                )}

                <form onSubmit={handleStoreLogin} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                      Store Operator Passcode
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter access passcode"
                        required
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-[#121417] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={storeLoading || !passcode.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-60 transition-all active:scale-95"
                  >
                    {storeLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />Verifying...</>
                    ) : (
                      <><Lock className="w-4 h-4" />Access Store Dashboard</>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-400 text-center mt-4">
                  🔒 Passcode access is restricted to authorized SAC store staff only.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />Secured by Google OAuth 2.0</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />Campus students only</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">🔒 JWT session tokens</span>
        </div>

      </div>
    </div>
  );
};
