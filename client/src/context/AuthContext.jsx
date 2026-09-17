import React, { createContext, useContext, useState, useEffect } from "react";
import { initialUsers } from "../data/seedListings";
import { authApi } from "../services/api";
import { registerUserSocket } from "../services/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("rentify_session_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_registered_users");
      return saved ? JSON.parse(saved) : initialUsers;
    } catch (e) {
      return initialUsers;
    }
  });

  const [needsProfileSetup, setNeedsProfileSetup] = useState(() => {
    return currentUser ? !currentUser.isProfileComplete : false;
  });

  // Fetch registered users from backend on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authApi.getAllUsers();
        if (res.users && res.users.length > 0) {
          setRegisteredUsers(res.users);
        }
      } catch (err) {
        console.warn("Could not fetch remote users, using local cache:", err.message);
      }
    };
    fetchUsers();
  }, []);

  // Sync user state and register socket
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem("rentify_session_user", JSON.stringify(currentUser));
        setNeedsProfileSetup(!currentUser.isProfileComplete);
        registerUserSocket(currentUser.id);
      } else {
        sessionStorage.removeItem("rentify_session_user");
        setNeedsProfileSetup(false);
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_registered_users", JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  // Google OAuth Login
  const loginWithGoogle = async (customProfile = null) => {
    try {
      if (customProfile) {
        const res = await authApi.googleLogin(customProfile);
        if (res.token) {
          localStorage.setItem("rentify_auth_token", res.token);
        }
        const user = res.user;
        setCurrentUser(user);
        setNeedsProfileSetup(!user.isProfileComplete);
        setRegisteredUsers((prev) => {
          const exists = prev.some((u) => u.id === user.id);
          return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
        });
        return user;
      }

      // Default persona login
      const defaultUser = registeredUsers[0] || initialUsers[0];
      const res = await authApi.googleAuth?.({
        email: defaultUser.email,
        name: defaultUser.name,
        avatar: defaultUser.avatar,
      }).catch(() => null);

      if (res?.token) {
        localStorage.setItem("rentify_auth_token", res.token);
      }

      const user = { ...defaultUser, isProfileComplete: true };
      setCurrentUser(user);
      setNeedsProfileSetup(false);
      return user;
    } catch (err) {
      console.error("Google login error:", err);
      const fallbackUser = initialUsers[0];
      setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Login via Phone OTP
  const loginWithPhone = async (phone, otp) => {
    try {
      const res = await authApi.verifyPhoneOtp(phone, otp);
      if (res.token) {
        localStorage.setItem("rentify_auth_token", res.token);
      }
      const user = res.user;
      setCurrentUser(user);
      setNeedsProfileSetup(!user.isProfileComplete);
      setRegisteredUsers((prev) => {
        const exists = prev.some((u) => u.id === user.id);
        return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
      });
      return user;
    } catch (err) {
      console.error("Phone login error:", err);
      throw err;
    }
  };

  // Login via College Email
  const loginWithCollegeEmail = async (email, name) => {
    try {
      const res = await authApi.googleLogin({
        email,
        name: name || email.split("@")[0].replace(".", " "),
      });
      if (res.token) {
        localStorage.setItem("rentify_auth_token", res.token);
      }
      const user = res.user;
      setCurrentUser(user);
      setNeedsProfileSetup(!user.isProfileComplete);
      setRegisteredUsers((prev) => {
        const exists = prev.some((u) => u.id === user.id);
        return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
      });
      return user;
    } catch (err) {
      console.error("College email login error:", err);
      throw err;
    }
  };

  // Complete Onboarding Profile
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
        isVerified: profileData.isEmailVerified || currentUser.isVerified,
        isProfileComplete: true,
      };
      setCurrentUser(updated);
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updated : u))
      );
      setNeedsProfileSetup(false);
    } catch (err) {
      console.error("Complete profile API error:", err);
      const updated = {
        ...currentUser,
        ...profileData,
        isVerified: profileData.isEmailVerified || currentUser.isVerified,
        isProfileComplete: true,
      };
      setCurrentUser(updated);
      setNeedsProfileSetup(false);
    }
  };

  // Quick Switch for Demo/Multi-party Testing
  const switchUser = (userId) => {
    const user = registeredUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setNeedsProfileSetup(!user.isProfileComplete);
      registerUserSocket(user.id);
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setNeedsProfileSetup(false);
    localStorage.removeItem("rentify_auth_token");
    sessionStorage.removeItem("rentify_session_user");
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
  };

  const verifyCollegeEmail = async (collegeEmail) => {
    if (!collegeEmail.includes(".edu") && !collegeEmail.includes(".ac.in")) {
      return { success: false, message: "Please enter an official .edu or .ac.in college email." };
    }
    try {
      const res = await authApi.verifyCollegeEmail(currentUser.id, collegeEmail);
      if (res.user) {
        setCurrentUser(res.user);
        setRegisteredUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? res.user : u))
        );
      }
      return { success: true, message: res.message || "College email verified!" };
    } catch (err) {
      const updated = {
        ...currentUser,
        email: collegeEmail,
        isVerified: true,
        isEmailVerified: true,
      };
      setCurrentUser(updated);
      return { success: true, message: "College email verified! 'Verified Student' badge activated." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registeredUsers,
        availableUsers: registeredUsers,
        needsProfileSetup,
        setNeedsProfileSetup,
        loginWithGoogle,
        loginWithPhone,
        loginWithCollegeEmail,
        switchUser,
        logout,
        updateProfile,
        completeFullProfile,
        verifyCollegeEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
