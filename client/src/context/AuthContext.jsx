import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";
import { registerUserSocket, getSocket } from "../services/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("unimandi_session_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [needsProfileSetup, setNeedsProfileSetup] = useState(() => {
    try {
      const saved = sessionStorage.getItem("unimandi_session_user");
      const user = saved ? JSON.parse(saved) : null;
      return user ? !user.isProfileComplete : false;
    } catch (e) {
      return false;
    }
  });

  // Sync user state and register socket
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem("unimandi_session_user", JSON.stringify(currentUser));
        setNeedsProfileSetup(!currentUser.isProfileComplete);

        const socket = getSocket();
        socket.on("connect", () => {
          registerUserSocket(currentUser.id);
        });
        registerUserSocket(currentUser.id);
      } else {
        sessionStorage.removeItem("unimandi_session_user");
        setNeedsProfileSetup(false);
      }
    } catch (e) { }
  }, [currentUser]);

  // ── Google OAuth Login (Real) ────────────────────────────────────────────────
  const loginWithGoogle = async (credential) => {
    try {
      const res = await authApi.googleVerify(credential);
      if (res.token) {
        localStorage.setItem("unimandi_auth_token", res.token);
      }
      const user = res.user;
      setCurrentUser(user);
      setNeedsProfileSetup(!user.isProfileComplete);
      return user;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  };

  // ── Store Operator Passcode Login ────────────────────────────────────────────
  const loginAsStoreOperator = async (passcode) => {
    try {
      const res = await authApi.storeLogin(passcode);
      if (res.token) {
        localStorage.setItem("unimandi_auth_token", res.token);
      }
      const user = res.user;
      setCurrentUser(user);
      setNeedsProfileSetup(false);
      return user;
    } catch (err) {
      console.error("Store login error:", err);
      throw err;
    }
  };

  // ── Complete Onboarding Profile ──────────────────────────────────────────────
  const completeFullProfile = async (profileData) => {
    if (!currentUser) return;
    try {
      const res = await authApi.completeProfile({
        userId: currentUser.id,
        ...profileData,
      });
      const updated = res.user || {
        ...currentUser,
        ...profileData,
        isProfileComplete: true,
      };
      setCurrentUser(updated);
      setNeedsProfileSetup(false);
    } catch (err) {
      console.error("Complete profile error:", err);
      const updated = { ...currentUser, ...profileData, isProfileComplete: true };
      setCurrentUser(updated);
      setNeedsProfileSetup(false);
    }
  };

  // ── Update Profile (local) ───────────────────────────────────────────────────
  const updateProfile = (updates) => {
    if (!currentUser) return;
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    setNeedsProfileSetup(false);
    localStorage.removeItem("unimandi_auth_token");
    sessionStorage.removeItem("unimandi_session_user");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        needsProfileSetup,
        setNeedsProfileSetup,
        loginWithGoogle,
        loginAsStoreOperator,
        logout,
        updateProfile,
        completeFullProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
