const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const request = async (url, options = {}) => {
  const token = localStorage.getItem("rentify_auth_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `API Error: ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
};

// 1. Auth API
export const authApi = {
  googleLogin: (profileData) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify(profileData),
    }),
  sendPhoneOtp: (phone) =>
    request("/auth/phone/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyPhoneOtp: (phone, otp) =>
    request("/auth/phone/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),
  completeProfile: (profileData) =>
    request("/auth/complete-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    }),
  verifyCollegeEmail: (userId, collegeEmail) =>
    request("/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ userId, collegeEmail }),
    }),
  getAllUsers: () => request("/auth/users"),
};

// 2. Listings API
export const listingsApi = {
  getListings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "All") {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request(`/listings${queryString}`);
  },
  getListingById: (id) => request(`/listings/${id}`),
  createListing: (listingData) =>
    request("/listings", {
      method: "POST",
      body: JSON.stringify(listingData),
    }),
  updateListing: (id, updates) =>
    request(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  updateStatus: (id, status) =>
    request(`/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteListing: (id) =>
    request(`/listings/${id}`, {
      method: "DELETE",
    }),
};

// 3. Chat & Offer Negotiation API
export const chatApi = {
  getUserChats: (userId) => request(`/chats?userId=${userId}`),
  startOrGetChat: (listingId, buyerId) =>
    request("/chats", {
      method: "POST",
      body: JSON.stringify({ listingId, buyerId }),
    }),
  getMessages: (chatId) => request(`/chats/${chatId}/messages`),
  sendMessage: (chatId, { senderId, text, type = "text", offerAmount = null }) =>
    request(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ senderId, text, type, offerAmount }),
    }),
  makeOffer: (chatId, { offeredBy, amount, note }) =>
    request(`/chats/${chatId}/offer`, {
      method: "POST",
      body: JSON.stringify({ offeredBy, amount, note }),
    }),
  respondOffer: (chatId, { responderId, action, counterAmount }) =>
    request(`/chats/${chatId}/offer/respond`, {
      method: "POST",
      body: JSON.stringify({ responderId, action, counterAmount }),
    }),
};

// 4. Two-Sided Deals API
export const dealApi = {
  confirmDeal: (listingId, userId) =>
    request(`/deals/${listingId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
};

// 5. Kampus SAC Store & Essentials API
export const storeApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/store/products${query ? `?${query}` : ""}`);
  },
  createProduct: (productData) =>
    request("/store/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/store/orders${query ? `?${query}` : ""}`);
  },
  createPaymentOrder: (paymentData) =>
    request("/store/create-payment-order", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
  createOrder: (orderData) =>
    request("/store/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  verifyPickup: (orderId, pickupCode, qrPayload) =>
    request(`/store/orders/${orderId || "verify"}/pickup`, {
      method: "PATCH",
      body: JSON.stringify({ pickupCode, qrPayload }),
    }),
};

// 6. Ratings & Peer Reviews API
export const ratingApi = {
  submitRating: (ratingData) =>
    request("/ratings", {
      method: "POST",
      body: JSON.stringify(ratingData),
    }),
  getUserRatingSummary: (userId) => request(`/ratings/user/${userId}`),
};

// 7. Safety & Moderation API
export const safetyApi = {
  report: (reportData) =>
    request("/safety/report", {
      method: "POST",
      body: JSON.stringify(reportData),
    }),
  blockUser: (targetUserId, currentUserId) =>
    request(`/safety/block/${targetUserId}`, {
      method: "POST",
      body: JSON.stringify({ currentUserId }),
    }),
};

// 8. Upload API
export const uploadApi = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/upload/single`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
  uploadMultiple: async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const res = await fetch(`${API_BASE}/upload/multiple`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
};
