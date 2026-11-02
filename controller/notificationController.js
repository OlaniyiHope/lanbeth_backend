import mongoose from "mongoose";
import User from "../models/authModel.js";
import Notification from "../models/notificationModel.js";

const EXPIRY_WINDOW_DAYS = 30;
const SYNC_THROTTLE_MS = 5 * 60 * 1000; // avoid re-scanning on every poll
const DAY_MS = 24 * 60 * 60 * 1000;
let lastSyncAt = 0;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * Scans users' documents and creates notifications for documents that
 * are expiring within the window or already expired.
 * Safe to call repeatedly: duplicates are prevented by the unique index.
 */
export async function syncDocumentExpiryNotifications({ force = false } = {}) {
  if (!force && Date.now() - lastSyncAt < SYNC_THROTTLE_MS) return 0;
  lastSyncAt = Date.now();

  const now = new Date();
  const windowEnd = new Date(now.getTime() + EXPIRY_WINDOW_DAYS * DAY_MS);

  const [owners, admins] = await Promise.all([
    User.find({
      isArchived: { $ne: true },
      status: "active",
      documents: { $elemMatch: { expiryDate: { $lte: windowEnd } } },
    })
      .select("fullName role documents")
      .lean(),
    User.find({ role: "admin", status: "active", isArchived: { $ne: true } })
      .select("_id")
      .lean(),
  ]);

  const ops = [];

  for (const owner of owners) {
    const ownerId = String(owner._id);

    for (const doc of owner.documents || []) {
      if (!doc.expiryDate || doc.expiryDate > windowEnd) continue;

      const expired = doc.expiryDate < now;
      const type = expired ? "document_expired" : "document_expiring";
      const title = expired ? "Document expired" : "Document expiring soon";
      const phrase = `${expired ? "expired" : "expires"} on ${fmtDate(doc.expiryDate)}`;

      // Admins get every non-archived user's documents; staff get their own
      const recipientIds = new Set(admins.map((a) => String(a._id)));
      if (owner.role === "staff") recipientIds.add(ownerId);

      for (const rid of recipientIds) {
        const isSelf = rid === ownerId;
        const message = isSelf
          ? `Your ${doc.documentType} ${phrase}.`
          : `${owner.fullName}'s ${doc.documentType} ${phrase}.`;

        ops.push({
          updateOne: {
            filter: {
              recipient: rid,
              dedupeKey: `${doc._id}:${type}:${doc.expiryDate.getTime()}`,
            },
            update: {
              $setOnInsert: {
                recipient: rid,
                type,
                title,
                message,
                subject: owner._id,
                documentId: doc._id,
                documentType: doc.documentType,
                expiryDate: doc.expiryDate,
                dedupeKey: `${doc._id}:${type}:${doc.expiryDate.getTime()}`,
                read: false,
                createdAt: new Date(),
              },
            },
            upsert: true,
          },
        });
      }
    }
  }

  if (!ops.length) return 0;

  try {
    const result = await Notification.bulkWrite(ops, { ordered: false });
    return result.upsertedCount || 0;
  } catch (err) {
    // Duplicate-key errors are expected when two requests race; ignore those only
    const writeErrors = [].concat(err.writeErrors || []);
    if (writeErrors.some((e) => e.code !== 11000)) throw err;
    return 0;
  }
}

// @route  GET /api/notifications
// @access Admin, Staff
export const getNotifications = async (req, res) => {
  try {
    await syncDocumentExpiryNotifications();

    const filter = { recipient: req.user._id };
    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
      Notification.countDocuments({ ...filter, read: false }),
    ]);

    return res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  PATCH /api/notifications/:id/read
// @access Admin, Staff
export const markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const result = await Notification.updateOne(
      { _id: req.params.id, recipient: req.user._id }, // scoped to the owner
      { $set: { read: true, readAt: new Date() } }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  PATCH /api/notifications/read-all
// @access Admin, Staff
export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return res.status(200).json({ message: "All marked as read", updated: result.modifiedCount });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};