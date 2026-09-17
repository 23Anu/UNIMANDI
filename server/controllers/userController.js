import { users, ratings, listings } from "../data/store.js";

export const getUserProfile = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const userListings = listings.filter((l) => l.userId === id);
  const userRatings = ratings.filter((r) => r.toUserId === id);

  res.json({
    ...user,
    listingsCount: userListings.length,
    ratingsReceived: userRatings,
  });
};

export const updateUserProfile = (req, res) => {
  const { id } = req.params;
  const {
    name,
    branch,
    year,
    semester,
    avatar,
    college,
    rollNo,
    phone,
    addressType,
    roomNo,
    buildingName,
    streetArea,
    landmark,
    city,
    state,
    pincode,
    pickupLocation,
    fullAddress,
    hostel,
  } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(branch && { branch }),
    ...(year && { year }),
    ...(semester && { semester }),
    ...(avatar && { avatar }),
    ...(college && { college }),
    ...(rollNo && { rollNo }),
    ...(phone && { phone }),
    ...(addressType && { addressType }),
    ...(roomNo && { roomNo }),
    ...(buildingName && { buildingName }),
    ...(streetArea && { streetArea }),
    ...(landmark && { landmark }),
    ...(city && { city }),
    ...(state && { state }),
    ...(pincode && { pincode }),
    ...(pickupLocation && { pickupLocation }),
    ...(fullAddress && { fullAddress }),
    ...(hostel && { hostel }),
    isAddressVerified: true,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, user: users[userIndex] });
};

export const getUserRatings = (req, res) => {
  const { id } = req.params;
  const userRatings = ratings.filter((r) => r.toUserId === id);
  res.json({ ratings: userRatings });
};
