import { listings, users, saveDB } from "../data/store.js";
import { broadcastNewListing } from "../socket.js";

export const getListings = (req, res) => {
  const { category, type, minPrice, maxPrice, search, userBranch, userYear, status, gender, genderTarget, subcategory, location } = req.query;

  let filtered = [...listings];

  // Filter by category
  if (category && category !== "All") {
    filtered = filtered.filter((l) => l.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by subcategory
  if (subcategory && subcategory !== "All" && subcategory !== "All Items") {
    filtered = filtered.filter((l) => l.subcategory?.toLowerCase() === subcategory.toLowerCase());
  }

  // Filter by location
  if (location && location !== "All Campus Areas") {
    filtered = filtered.filter((l) => l.location?.toLowerCase().includes(location.toLowerCase()));
  }

  // Filter by gender target (Hostel & PG Living)
  const targetGender = genderTarget || gender;
  if (targetGender && targetGender !== "All") {
    if (targetGender === "Girls Only") {
      filtered = filtered.filter((l) => 
        l.genderTarget === "Girls Only" || 
        l.title.toLowerCase().includes("girls") || 
        l.location.toLowerCase().includes("girls")
      );
    } else if (targetGender === "Boys Only") {
      filtered = filtered.filter((l) => 
        l.genderTarget === "Boys Only" || 
        l.title.toLowerCase().includes("boys") || 
        l.location.toLowerCase().includes("boys")
      );
    } else if (targetGender === "Co-ed / Any") {
      filtered = filtered.filter((l) => 
        l.genderTarget === "Co-ed / Any" || 
        l.genderTarget === "Any" || 
        l.title.toLowerCase().includes("flat")
      );
    }
  }

  // Filter by type (Rent / Sell)
  if (type && type !== "All") {
    filtered = filtered.filter((l) => l.type.toLowerCase() === type.toLowerCase());
  }

  // Filter by status
  if (status && status !== "All") {
    filtered = filtered.filter((l) => l.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by price range
  if (minPrice) {
    filtered = filtered.filter((l) => l.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((l) => l.price <= Number(maxPrice));
  }

  // Filter by search keyword
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q)
    );
  }

  // Attach seller info and compute campus relevance score
  const enriched = filtered.map((listing) => {
    const seller = users.find((u) => u.id === listing.userId);
    
    // Campus matching relevance logic
    let relevanceScore = 0;
    if (userBranch && (listing.targetBranch === userBranch || listing.targetBranch === "All Branches")) {
      relevanceScore += 50;
    }
    if (userYear && (listing.targetYear === userYear || listing.targetYear === "All Years")) {
      relevanceScore += 30;
    }
    if (seller?.isVerified) {
      relevanceScore += 15;
    }
    if (seller?.trustScore) {
      relevanceScore += seller.trustScore * 2;
    }

    return {
      ...listing,
      seller: seller ? {
        id: seller.id,
        name: seller.name,
        branch: seller.branch,
        year: seller.year,
        isVerified: seller.isVerified,
        trustScore: seller.trustScore,
        avatar: seller.avatar
      } : null,
      relevanceScore
    };
  });

  // Sort by relevance score, then recency
  enriched.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ listings: enriched, total: enriched.length });
};

export const getListingById = (req, res) => {
  const { id } = req.params;
  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listing.views = (listing.views || 0) + 1;
  saveDB();

  const seller = users.find((u) => u.id === listing.userId);
  res.json({
    ...listing,
    seller: seller ? {
      id: seller.id,
      name: seller.name,
      branch: seller.branch,
      year: seller.year,
      isVerified: seller.isVerified,
      trustScore: seller.trustScore,
      avatar: seller.avatar,
      dealsCount: seller.dealsCount
    } : null
  });
};

export const createListing = (req, res) => {
  const { userId, type, category, subcategory, title, description, condition, price, rentDuration, location, images, targetBranch, targetYear, genderTarget } = req.body;

  if (!userId || !type || !category || !title || !price || !condition) {
    return res.status(400).json({ error: "Required listing fields are missing" });
  }

  const newListing = {
    id: `item_${Date.now()}`,
    userId,
    type, // Rent or Sell
    category,
    subcategory: subcategory || "General",
    title,
    description: description || "",
    condition, // New | Good | Fair
    price: Number(price),
    rentDuration: type === "Rent" ? (rentDuration || "per month") : null,
    location: location || "Campus / Hostel",
    status: "Available",
    genderTarget: genderTarget || (category === "Hostel & PG Living" ? "Girls Only" : "Any"),
    images: images && images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: targetBranch || "All Branches",
    targetYear: targetYear || "All Years",
    views: 0,
    createdAt: new Date().toISOString()
  };

  listings.unshift(newListing);
  saveDB();

  const seller = users.find((u) => u.id === userId);
  const enrichedNewListing = {
    ...newListing,
    seller: seller ? {
      id: seller.id,
      name: seller.name,
      branch: seller.branch,
      year: seller.year,
      isVerified: seller.isVerified,
      trustScore: seller.trustScore,
      avatar: seller.avatar
    } : null
  };

  // Broadcast to all connected clients via Socket.io
  broadcastNewListing(enrichedNewListing);

  res.status(201).json({
    success: true,
    listing: enrichedNewListing
  });
};

export const updateListing = (req, res) => {
  const { id } = req.params;
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listings[index] = {
    ...listings[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB();

  res.json({ success: true, listing: listings[index] });
};

export const updateListingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listing.status = status;
  listing.updatedAt = new Date().toISOString();
  saveDB();

  res.json({ success: true, listing });
};

export const deleteListing = (req, res) => {
  const { id } = req.params;
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listings.splice(index, 1);
  saveDB();

  res.json({ success: true, message: "Listing removed successfully" });
};
