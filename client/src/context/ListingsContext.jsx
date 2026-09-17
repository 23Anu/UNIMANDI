import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { initialListings, CATEGORY_TREE } from "../data/seedListings";
import { useAuth } from "./AuthContext";
import { listingsApi } from "../services/api";
import { getSocket } from "../services/socket";

const ListingsContext = createContext();

export const CAMPUS_LOCATIONS = [
  "All Campus Areas",
  "Boys Hostels (Blocks 1-4)",
  "Girls Hostels (Blocks A-B)",
  "Academic Depts & Central Library",
  "Off-Campus PGs (Gate 1 & 2)",
];

export const ListingsProvider = ({ children }) => {
  const auth = useAuth() || {};
  const currentUser = auth.currentUser;
  const availableUsers = auth.availableUsers || auth.registeredUsers || [];

  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_listings_v4");
      return saved ? JSON.parse(saved) : initialListings;
    } catch (e) {
      return initialListings;
    }
  });

  // Wishlist / Favorites State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_wishlist");
      return saved ? JSON.parse(saved) : ["item_101", "item_103"];
    } catch (e) {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Items");
  const [selectedType, setSelectedType] = useState("All"); // All | Rent | Sell
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 15000 });
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterCondition, setFilterCondition] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All Campus Areas");
  const [filterGender, setFilterGender] = useState("All"); // All | Girls Only | Boys Only | Co-ed / Any
  const [sortBy, setSortBy] = useState("relevance"); // relevance | price_asc | price_desc | urgent | featured

  // Fetch live listings from backend on load
  const fetchLiveListings = async () => {
    try {
      const res = await listingsApi.getListings({
        userBranch: currentUser?.branch,
        userYear: currentUser?.year,
      });
      if (res.listings && res.listings.length > 0) {
        setListings(res.listings);
      }
    } catch (err) {
      console.warn("Could not fetch remote listings, using cached/seed:", err.message);
    }
  };

  useEffect(() => {
    fetchLiveListings();
  }, [currentUser?.branch, currentUser?.year]);

  // Listen for real-time listing broadcasts via Socket.io
  useEffect(() => {
    const socket = getSocket();

    const handleNewListing = (newListing) => {
      setListings((prev) => {
        const exists = prev.some((l) => l.id === newListing.id);
        if (exists) return prev;
        return [newListing, ...prev];
      });
    };

    const handleListingUpdate = (updatedListing) => {
      setListings((prev) =>
        prev.map((l) => (l.id === updatedListing.id ? { ...l, ...updatedListing } : l))
      );
    };

    socket.on("new_listing_posted", handleNewListing);
    socket.on("listing_updated", handleListingUpdate);

    return () => {
      socket.off("new_listing_posted", handleNewListing);
      socket.off("listing_updated", handleListingUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_listings_v4", JSON.stringify(listings));
    } catch (e) {}
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_wishlist", JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const toggleWishlist = (listingId) => {
    setWishlist((prev) => {
      if (prev.includes(listingId)) {
        return prev.filter((id) => id !== listingId);
      } else {
        return [...prev, listingId];
      }
    });
  };

  const isItemSaved = (listingId) => wishlist.includes(listingId);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const subcats = CATEGORY_TREE[cat]?.subcategories || ["All"];
    setSelectedSubcategory(subcats[0] || "All");
  };

  // Enriched listings with seller, trust score, and branch matching
  const enrichedListings = useMemo(() => {
    const usersList = Array.isArray(availableUsers) ? availableUsers : [];
    return listings.map((item) => {
      const seller = item.seller || usersList.find((u) => u.id === item.userId);

      let score = 0;
      if (currentUser) {
        if (item.targetBranch === currentUser.branch || item.targetBranch === "All Branches") {
          score += 50;
        }
        if (item.targetYear === currentUser.year || item.targetYear === "All Years") {
          score += 30;
        }
      }
      if (item.isFeatured) score += 25;
      if (item.isUrgent) score += 20;
      if (seller?.isVerified) score += 15;
      if (seller?.trustScore) score += (seller.trustScore * 2);

      return {
        ...item,
        isSaved: wishlist.includes(item.id),
        seller: seller || {
          id: item.userId,
          name: "Campus Senior",
          branch: "Engineering",
          year: "4th Year",
          isVerified: true,
          trustScore: 4.8,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        },
        relevanceScore: score,
      };
    });
  }, [listings, availableUsers, currentUser, wishlist]);

  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    return enrichedListings.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (
        selectedSubcategory &&
        !selectedSubcategory.startsWith("All")
      ) {
        if (selectedSubcategory === "Urgent Deals") {
          if (!item.isUrgent) return false;
        } else if (selectedSubcategory === "Senior Picks") {
          if (!item.isFeatured) return false;
        } else if (selectedSubcategory === "Under ₹500") {
          if (item.price > 500) return false;
        } else if (selectedSubcategory === "Rentals Only") {
          if (item.type !== "Rent") return false;
        } else if (selectedSubcategory === "Girls Only PG") {
          if (item.genderTarget !== "Girls Only" && !item.title?.toLowerCase().includes("girl") && item.subcategory !== "Girls Only PG") {
            return false;
          }
        } else if (selectedSubcategory === "Boys Only PG") {
          if (item.genderTarget !== "Boys Only" && !item.title?.toLowerCase().includes("boy") && item.subcategory !== "Boys Only PG") {
            return false;
          }
        } else if (selectedSubcategory === "Co-ed Flats" || selectedSubcategory === "Roommate Openings") {
          if (item.genderTarget !== "Co-ed / Any" && !item.title?.toLowerCase().includes("flat") && !item.title?.toLowerCase().includes("roommate") && item.subcategory !== selectedSubcategory) {
            return false;
          }
        } else if (item.subcategory && item.subcategory.toLowerCase() === selectedSubcategory.toLowerCase()) {
          // Exact match
        } else {
          const subLower = selectedSubcategory.toLowerCase();
          const titleLower = (item.title || "").toLowerCase();
          const descLower = (item.description || "").toLowerCase();
          const keywords = subLower.replace("&", " ").split(" ").filter((w) => w.length > 2);
          const hasKeywordMatch = keywords.some((kw) => titleLower.includes(kw) || descLower.includes(kw) || item.subcategory?.toLowerCase().includes(kw));
          if (!hasKeywordMatch) return false;
        }
      }

      // Rent / Sell type filter
      if (selectedType !== "All" && item.type !== selectedType) {
        return false;
      }

      // Campus Location filter
      if (filterLocation !== "All Campus Areas") {
        const loc = item.location?.toLowerCase() || "";
        if (filterLocation.includes("Boys") && !loc.includes("block 1") && !loc.includes("block 2") && !loc.includes("block 3") && !loc.includes("block 4")) {
          return false;
        }
        if (filterLocation.includes("Girls") && !loc.includes("girls") && !loc.includes("hostel b")) {
          return false;
        }
        if (filterLocation.includes("Academic") && !loc.includes("library") && !loc.includes("dept") && !loc.includes("lab")) {
          return false;
        }
        if (filterLocation.includes("Off-Campus") && !loc.includes("gate") && !loc.includes("heights") && !loc.includes("pg")) {
          return false;
        }
      }

      // Price range
      if (item.price < priceRange.min || item.price > priceRange.max) {
        return false;
      }

      // Branch filter if manually selected
      if (filterBranch !== "All" && item.targetBranch !== filterBranch && item.targetBranch !== "All Branches") {
        return false;
      }

      // Condition filter
      if (filterCondition !== "All" && item.condition !== filterCondition) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesSubcat = item.subcategory?.toLowerCase().includes(q);
        const matchesLoc = item.location?.toLowerCase().includes(q);

        let matchesPriceTerm = false;
        if (q.includes("under") || q.includes("<") || q.includes("below")) {
          const numMatch = q.match(/\d+/);
          if (numMatch) {
            const maxP = parseInt(numMatch[0]);
            if (item.price <= maxP) matchesPriceTerm = true;
          }
        }

        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesSubcat && !matchesLoc && !matchesPriceTerm) {
          return false;
        }
      }

      // Gender restriction filter
      if (filterGender !== "All") {
        if (filterGender === "Girls Only") {
          const isGirls =
            item.genderTarget === "Girls Only" ||
            item.subcategory === "Girls Only PG" ||
            item.title?.toLowerCase().includes("girls") ||
            item.location?.toLowerCase().includes("girls");
          if (!isGirls) return false;
        } else if (filterGender === "Boys Only") {
          const isBoys =
            item.genderTarget === "Boys Only" ||
            item.subcategory === "Boys Only PG" ||
            item.title?.toLowerCase().includes("boys") ||
            item.location?.toLowerCase().includes("boys");
          if (!isBoys) return false;
        } else if (filterGender === "Co-ed / Any") {
          const isCoed =
            item.genderTarget === "Co-ed / Any" ||
            item.genderTarget === "Any" ||
            item.subcategory === "Co-ed Flats" ||
            item.title?.toLowerCase().includes("flat");
          if (!isCoed) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "urgent") return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
      if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return b.relevanceScore - a.relevanceScore || new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [enrichedListings, selectedCategory, selectedSubcategory, selectedType, priceRange, filterBranch, filterCondition, filterLocation, filterGender, searchQuery, sortBy]);

  const savedListings = useMemo(() => {
    return enrichedListings.filter((item) => wishlist.includes(item.id));
  }, [enrichedListings, wishlist]);

  const addListing = async (newListingData) => {
    try {
      const res = await listingsApi.createListing({
        userId: currentUser?.id || "user_1",
        ...newListingData,
      });
      const createdItem = res.listing;
      setListings((prev) => [createdItem, ...prev]);
      return createdItem;
    } catch (err) {
      console.error("API createListing error:", err);
      const fallbackItem = {
        id: `item_${Date.now()}`,
        userId: currentUser?.id || "user_1",
        ...newListingData,
        views: 1,
        status: "Available",
        createdAt: new Date().toISOString(),
      };
      setListings((prev) => [fallbackItem, ...prev]);
      return fallbackItem;
    }
  };

  const updateListing = async (id, updates) => {
    try {
      await listingsApi.updateListing(id, updates);
    } catch (err) {
      console.error("API updateListing error:", err);
    }
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const updateListingStatus = async (id, status) => {
    try {
      await listingsApi.updateStatus(id, status);
    } catch (err) {
      console.error("API updateListingStatus error:", err);
    }
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteListing = async (id) => {
    try {
      await listingsApi.deleteListing(id);
    } catch (err) {
      console.error("API deleteListing error:", err);
    }
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ListingsContext.Provider
      value={{
        listings: enrichedListings,
        filteredListings,
        savedListings,
        wishlist,
        toggleWishlist,
        isItemSaved,
        selectedCategory,
        setSelectedCategory: handleCategorySelect,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedType,
        setSelectedType,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        filterBranch,
        setFilterBranch,
        filterCondition,
        setFilterCondition,
        filterLocation,
        setFilterLocation,
        filterGender,
        setFilterGender,
        sortBy,
        setSortBy,
        addListing,
        updateListing,
        updateListingStatus,
        deleteListing,
        refreshListings: fetchLiveListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => useContext(ListingsContext);
