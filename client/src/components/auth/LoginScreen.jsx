import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, GraduationCap, Loader2, AlertCircle } from "lucide-react";

export const LoginScreen = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 flex flex-col">

      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF5A1F]/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-50/60 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">

        {/* Branding */}
        <div className="text-center mb-10 animate-reveal-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl border border-orange-100 mb-4">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#121417]">
            UNI<span className="text-[#FF5A1F]">MANDI</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F] mt-1">
            Buy • Sell • Rent • Connect
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Campus Rental & Resale Marketplace</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-8 animate-reveal-up">

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#121417]">Welcome to UniMandi 👋</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in with your Google account to access the campus marketplace
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-2.5 mb-8">
            {[
              "Buy, sell & rent campus essentials",
              "Connect with verified students only",
              "Secure in-app chat & deals",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-[#FF5A1F] text-xs font-bold">✓</span>
                </div>
                {feature}
              </div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
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
              and{" "}
              <span className="text-[#FF5A1F] cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />Secured by Google OAuth 2.0
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />Campus students only
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">🔒 JWT session tokens</span>
        </div>

      </div>
    </div>
  );
};
