import React, { useState } from "react";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, GraduationCap,
  BookOpen, Building2, ArrowRight, Loader2, CheckCircle2,
  ShieldCheck, AlertCircle, KeyRound, RefreshCw, ChevronRight,
  Sparkles, X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ─── Reusable Field ────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, required, children }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
      {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
      {children}
    </div>
  </div>
);

const inputClass = (hasIcon = true) =>
  `w-full ${hasIcon ? "pl-10" : "px-4"} pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[#121417] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F] transition-all placeholder:text-slate-400`;

// ─── Alert Box ─────────────────────────────────────────────────────────────────
const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  const icons = {
    error: <AlertCircle className="w-4 h-4 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    info: <ShieldCheck className="w-4 h-4 shrink-0" />,
  };
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium ${styles[type] || styles.error}`}>
      {icons[type]}
      <span>{msg}</span>
    </div>
  );
};

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type, msg }
  const [devToken, setDevToken] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await forgotPassword(email.trim());
      if (res.resetToken) setDevToken(res.resetToken); // dev only
      setAlert({ type: "success", msg: res.message || "Reset code sent! Check your server console." });
      setTimeout(() => setStep("reset"), 1500);
    } catch (err) {
      setAlert({ type: "error", msg: err.message || "Could not send reset code." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setAlert({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (newPass.length < 6) {
      setAlert({ type: "error", msg: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const res = await resetPassword(email.trim(), token.trim(), newPass);
      setAlert({ type: "success", msg: res.message || "Password reset! You can now log in." });
      setTimeout(onClose, 2000);
    } catch (err) {
      setAlert({ type: "error", msg: err.message || "Could not reset password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-reveal-up">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className="mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-xl text-[#121417]">Reset Password</h3>
          <p className="text-xs text-slate-500 mt-1">
            {step === "email" ? "Enter your registered email to receive a reset code" : "Enter the reset code and your new password"}
          </p>
        </div>

        {alert && <div className="mb-4"><Alert type={alert.type} msg={alert.msg} /></div>}

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step === "email" ? "bg-[#FF5A1F]" : "bg-green-500"}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step === "reset" ? "bg-[#FF5A1F]" : "bg-slate-200"}`} />
        </div>

        {step === "email" ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Field label="Registered Email" icon={Mail} required>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className={inputClass()} />
            </Field>
            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-md">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {devToken && (
              <Alert type="info" msg={`Dev mode: Your reset code is ${devToken} — in production this would be emailed.`} />
            )}
            <Field label="Reset Code (6 digits)" icon={KeyRound} required>
              <input type="text" required maxLength={6} value={token} onChange={e => setToken(e.target.value)}
                placeholder="123456" className={`${inputClass()} tracking-widest text-center font-bold text-lg`} />
            </Field>
            <Field label="New Password" icon={Lock} required>
              <input type={showPass ? "text" : "password"} required value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="Min. 6 characters" className={`${inputClass()} pr-10`} />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>
            <Field label="Confirm New Password" icon={Lock} required>
              <input type={showPass ? "text" : "password"} required value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password" className={inputClass()} />
            </Field>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep("email")}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> New Code
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-md">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── MAIN LOGIN SCREEN ─────────────────────────────────────────────────────────
export const LoginScreen = () => {
  const { loginWithCredentials, registerUser, loginWithGoogle, registeredUsers } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Sign-up form state
  const [signupData, setSignupData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", college: "", branch: "", year: "", semester: "",
    rollNo: "", hostel: "", roomNo: "", city: "Pune", state: "Maharashtra", pincode: "411038",
  });

  const updateSignup = (field) => (e) => setSignupData(prev => ({ ...prev, [field]: e.target.value }));

  // ─── Handle Login ───────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (!loginEmail.trim() || !loginPass.trim()) {
      setAlert({ type: "error", msg: "Please enter your email and password." });
      return;
    }
    setLoading(true);
    try {
      await loginWithCredentials(loginEmail.trim(), loginPass);
    } catch (err) {
      setAlert({ type: "error", msg: err.message || "Login failed. Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Sign Up ─────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setAlert(null);
    const { name, email, password, confirmPassword, phone, college, branch, year, semester, rollNo, hostel, roomNo, city, state, pincode } = signupData;

    if (!name || !email || !password) {
      setAlert({ type: "error", msg: "Name, email and password are required." });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setAlert({ type: "error", msg: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password, phone, college, branch, year, semester, rollNo, hostel, roomNo, city, state, pincode });
    } catch (err) {
      setAlert({ type: "error", msg: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
  const semesterOptions = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
  const branchOptions = ["Computer Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering", "Information Technology", "Other"];

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 flex flex-col">

        {/* ─── Background decorative bubbles ─── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF5A1F]/8 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-400/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-50/60 blur-3xl" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 sm:px-6">

          {/* ─── Branding ─── */}
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
            <p className="text-xs text-slate-500 mt-0.5">Campus Rental & Resale Marketplace</p>
          </div>

          {/* ─── Main Card ─── */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden animate-reveal-up">

            {/* Tab Toggle */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => { setMode("login"); setAlert(null); }}
                className={`flex-1 py-4 text-sm font-bold transition-all ${mode === "login"
                  ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F] bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("signup"); setAlert(null); }}
                className={`flex-1 py-4 text-sm font-bold transition-all ${mode === "signup"
                  ? "text-[#FF5A1F] border-b-2 border-[#FF5A1F] bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"}`}
              >
                Create Account
              </button>
            </div>

            <div className="p-6 sm:p-8">

              {alert && <div className="mb-5"><Alert type={alert.type} msg={alert.msg} /></div>}

              {/* ════════════════ LOGIN FORM ════════════════ */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4 animate-reveal-up">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-[#121417]">Welcome back! 👋</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Sign in with your UNIMANDI account</p>
                  </div>

                  <Field label="Email Address" icon={Mail} required>
                    <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      placeholder="student@gmail.com" className={inputClass()} />
                  </Field>

                  <Field label="Password" icon={Lock} required>
                    <input type={showPass ? "text" : "password"} required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                      placeholder="Your password" className={`${inputClass()} pr-10`} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setShowForgot(true)}
                      className="text-xs text-[#FF5A1F] hover:underline font-semibold">
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-orange-200 mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    {loading ? "Signing in..." : "Sign In to UNIMANDI"}
                  </button>

                  {/* Social divider */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[11px] text-slate-400 font-medium uppercase">Or sign in as</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  {/* Quick Demo logins */}
                  <div className="space-y-1.5">
                    {registeredUsers.filter(u => u.isProfileComplete).slice(0, 3).map(user => (
                      <button key={user.id} type="button"
                        onClick={() => loginWithGoogle({ email: user.email, name: user.name, avatar: user.avatar })}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-left group">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#121417] truncate">{user.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{user.branch} • {user.year}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF5A1F] transition-colors" />
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {/* ════════════════ SIGN UP FORM ════════════════ */}
              {mode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4 animate-reveal-up">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-[#121417]">Create your account ✨</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Join thousands of students trading on campus</p>
                  </div>

                  {/* ── Section: Personal Info ── */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Personal Details
                    </p>

                    <Field label="Full Name" icon={User} required>
                      <input type="text" required value={signupData.name} onChange={updateSignup("name")}
                        placeholder="e.g. Aryan Sharma" className={inputClass()} />
                    </Field>

                    <Field label="Email Address" icon={Mail} required>
                      <input type="email" required value={signupData.email} onChange={updateSignup("email")}
                        placeholder="your@gmail.com or college.ac.in" className={inputClass()} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Password" icon={Lock} required>
                        <input type={showPass ? "text" : "password"} required value={signupData.password} onChange={updateSignup("password")}
                          placeholder="Min 6 chars" className={`${inputClass()} pr-9`} />
                        <button type="button" onClick={() => setShowPass(s => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </Field>
                      <Field label="Confirm Password" icon={Lock} required>
                        <input type={showConfirmPass ? "text" : "password"} required value={signupData.confirmPassword} onChange={updateSignup("confirmPassword")}
                          placeholder="Re-enter" className={`${inputClass()} pr-9`} />
                        <button type="button" onClick={() => setShowConfirmPass(s => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </Field>
                    </div>

                    <Field label="Phone Number" icon={Phone}>
                      <input type="tel" value={signupData.phone} onChange={updateSignup("phone")}
                        placeholder="+91 98765 43210" className={inputClass()} />
                    </Field>
                  </div>

                  {/* ── Section: Academic Info ── */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Academic Details
                    </p>

                    <Field label="College / University" icon={Building2}>
                      <input type="text" value={signupData.college} onChange={updateSignup("college")}
                        placeholder="National Institute of Technology" className={inputClass()} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Branch" icon={BookOpen}>
                        <select value={signupData.branch} onChange={updateSignup("branch")}
                          className={`${inputClass()} appearance-none cursor-pointer`}>
                          <option value="">Select Branch</option>
                          {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </Field>
                      <Field label="Year" icon={GraduationCap}>
                        <select value={signupData.year} onChange={updateSignup("year")}
                          className={`${inputClass()} appearance-none cursor-pointer`}>
                          <option value="">Select Year</option>
                          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Semester" icon={Sparkles}>
                        <select value={signupData.semester} onChange={updateSignup("semester")}
                          className={`${inputClass()} appearance-none cursor-pointer`}>
                          <option value="">Select Semester</option>
                          {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="Roll Number" icon={BookOpen}>
                        <input type="text" value={signupData.rollNo} onChange={updateSignup("rollNo")}
                          placeholder="2024CS042" className={inputClass()} />
                      </Field>
                    </div>
                  </div>

                  {/* ── Section: Campus Address ── */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Campus Address
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Hostel / PG Name" icon={Building2}>
                        <input type="text" value={signupData.hostel} onChange={updateSignup("hostel")}
                          placeholder="Hostel Block 3" className={inputClass()} />
                      </Field>
                      <Field label="Room No." icon={Building2}>
                        <input type="text" value={signupData.roomNo} onChange={updateSignup("roomNo")}
                          placeholder="Room 204" className={inputClass()} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Field label="City" icon={null}>
                        <input type="text" value={signupData.city} onChange={updateSignup("city")}
                          placeholder="Pune" className={inputClass(false)} />
                      </Field>
                      <Field label="State" icon={null}>
                        <input type="text" value={signupData.state} onChange={updateSignup("state")}
                          placeholder="Maharashtra" className={inputClass(false)} />
                      </Field>
                      <Field label="Pincode" icon={null}>
                        <input type="text" value={signupData.pincode} onChange={updateSignup("pincode")}
                          placeholder="411038" className={inputClass(false)} />
                      </Field>
                    </div>
                  </div>

                  {/* Email verification hint */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      Using an official <strong>.edu</strong> or <strong>.ac.in</strong> college email will automatically grant you the ✅ <strong>Verified Student</strong> badge.
                    </span>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-orange-200">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loading ? "Creating Account..." : "Create My UNIMANDI Account"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ─── Trust badges ─── */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />Passwords encrypted with bcryptjs</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">🔒 JWT session tokens</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">⚡ Campus-only verified meetups</span>
          </div>

        </div>
      </div>
    </>
  );
};
