import { reports, blockedUsers, saveDB } from "../data/store.js";

export const reportListingOrUser = (req, res) => {
  const { reporterId, targetType, targetId, reason, description } = req.body;

  if (!reporterId || !targetType || !targetId || !reason) {
    return res.status(400).json({ error: "Required reporting information missing" });
  }

  const report = {
    id: `rep_${Date.now()}`,
    reporterId,
    targetType, // "listing" or "user"
    targetId,
    reason,
    description: description || "",
    status: "Pending Review",
    createdAt: new Date().toISOString()
  };

  reports.push(report);
  saveDB();

  res.status(201).json({ success: true, message: "Report submitted. Campus safety moderators will review it.", report });
};

export const blockUser = (req, res) => {
  const { id } = req.params; // target user to block
  const { currentUserId } = req.body;

  if (!currentUserId || !id) {
    return res.status(400).json({ error: "User IDs missing" });
  }

  blockedUsers.push({
    blockerId: currentUserId,
    blockedId: id,
    createdAt: new Date().toISOString()
  });
  saveDB();

  res.json({ success: true, message: "User blocked. You will no longer see their listings or messages." });
};
