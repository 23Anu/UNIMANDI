import { ratings, users, chats, saveDB } from "../data/store.js";

export const submitRating = (req, res) => {
  const { fromUserId, toUserId, dealListingId, rating, tags, comment } = req.body;

  if (!fromUserId || !toUserId || !dealListingId || !rating) {
    return res.status(400).json({ error: "Required rating fields are missing" });
  }

  const newRating = {
    id: `rat_${Date.now()}`,
    dealListingId,
    fromUserId,
    toUserId,
    rating: Number(rating),
    tags: tags || ["On time", "Item as described"],
    comment: comment || "Smooth deal!",
    createdAt: new Date().toISOString()
  };

  ratings.push(newRating);

  // Update target user's average trust score
  const targetRatings = ratings.filter((r) => r.toUserId === toUserId);
  const avg = targetRatings.reduce((sum, r) => sum + r.rating, 0) / targetRatings.length;
  
  const targetUser = users.find((u) => u.id === toUserId);
  if (targetUser) {
    targetUser.trustScore = Math.round(avg * 10) / 10;
  }

  saveDB();

  res.status(201).json({
    success: true,
    rating: newRating,
    updatedTrustScore: targetUser ? targetUser.trustScore : rating
  });
};

export const getUserRatingSummary = (req, res) => {
  const { userId } = req.params;
  const userRatings = ratings.filter((r) => r.toUserId === userId);

  const total = userRatings.length;
  const avg = total > 0 ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : "5.0";

  // Aggregate tags count
  const tagCounts = {};
  userRatings.forEach((r) => {
    (r.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  res.json({
    userId,
    averageRating: Number(avg),
    totalReviews: total,
    tagCounts,
    reviews: userRatings
  });
};
