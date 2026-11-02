import mongoose from "mongoose";
import User from "../models/authModel.js";
import Notification from "../models/notificationModel.js";
import Client from "../models/clientModel.js";
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
const BIRTHDAY_WINDOW_DAYS = 7;
let lastBirthdaySyncAt = 0;

const startOfUtcDay = (d) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

// Birthday in a given year. Feb 29 births fall on Feb 28 in non-leap years.
function birthdayInYear(dob, year) {
  const month = dob.getUTCMonth();
  let day = dob.getUTCDate();
  if (month === 1 && day === 29 && !isLeapYear(year)) day = 28;
  return new Date(Date.UTC(year, month, day));
}

/**
 * Returns clients and active staff whose next birthday falls within the window.
 * Results are sorted by how soon the birthday is.
 */
export async function getUpcomingBirthdays(today = startOfUtcDay(new Date())) {
  const [clients, staff] = await Promise.all([
    Client.find({ isArchived: { $ne: true }, dateOfBirth: { $ne: null } })
      .select("fullName dateOfBirth assignedStaff")
      .lean(),
    User.find({
      role: "staff",
      status: "active",
      isArchived: { $ne: true },
      dateOfBirth: { $ne: null },
    })
      .select("fullName dateOfBirth")
      .lean(),
  ]);

  const people = [
    ...clients.map((c) => ({
      kind: "client",
      id: String(c._id),
      name: c.fullName,
      dob: c.dateOfBirth,
      assignedStaff: c.assignedStaff ? String(c.assignedStaff) : null,
    })),
    ...staff.map((s) => ({
      kind: "staff",
      id: String(s._id),
      name: s.fullName,
      dob: s.dateOfBirth,
      assignedStaff: null,
    })),
  ];

  const results = [];

  for (const p of people) {
    let birthday = birthdayInYear(p.dob, today.getUTCFullYear());
    if (birthday < today) {
      birthday = birthdayInYear(p.dob, today.getUTCFullYear() + 1);
    }

    const daysUntil = Math.round((birthday - today) / DAY_MS);
    if (daysUntil > BIRTHDAY_WINDOW_DAYS) continue;

    results.push({
      ...p,
      birthday,
      daysUntil,
      age: birthday.getUTCFullYear() - p.dob.getUTCFullYear(),
    });
  }

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}

/**
 * Creates birthday notifications for the upcoming window.
 * Admins are notified about everyone. A client's assigned staff member is
 * notified about that client. A staff member is notified about their own birthday.
 */
export async function syncBirthdayNotifications({ force = false } = {}) {
  if (!force && Date.now() - lastBirthdaySyncAt < SYNC_THROTTLE_MS) return 0;

  const upcoming = await getUpcomingBirthdays();
  if (!upcoming.length) {
    lastBirthdaySyncAt = Date.now();
    return 0;
  }

  const admins = await User.find({
    role: "admin",
    status: "active",
    isArchived: { $ne: true },
  })
    .select("_id")
    .lean();
  const adminIds = admins.map((a) => String(a._id));

  const ops = [];

  for (const p of upcoming) {
    const recipients = new Set(adminIds);
    if (p.kind === "client" && p.assignedStaff) recipients.add(p.assignedStaff);
    if (p.kind === "staff") recipients.add(p.id);

    // One notification per person per year, per recipient
    const dedupeKey = `birthday:${p.kind}:${p.id}:${p.birthday.getUTCFullYear()}`;
    const isToday = p.daysUntil === 0;
    const title = isToday ? "Birthday today" : "Upcoming birthday";
    const when = isToday ? "today" : `on ${fmtDate(p.birthday)}`;

    for (const rid of recipients) {
      const isSelf = p.kind === "staff" && rid === p.id;
      const message = isSelf
        ? `Happy birthday! You turn ${p.age} ${when}.`
        : `${p.name}'s birthday is ${when}. They turn ${p.age}.`;

      ops.push({
        updateOne: {
          filter: { recipient: rid, dedupeKey },
          update: {
            $setOnInsert: {
              recipient: rid,
              type: "birthday",
              title,
              message,
              subject: p.id,
              dedupeKey,
              read: false,
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      });
    }
  }

  if (!ops.length) {
    lastBirthdaySyncAt = Date.now();
    return 0;
  }
 try {
    const result = await Notification.bulkWrite(ops, { ordered: false });
    lastBirthdaySyncAt = Date.now();
    return result.upsertedCount || 0;
  } catch (err) {
    const writeErrors = [].concat(err.writeErrors || []);
    if (writeErrors.some((e) => e.code !== 11000)) {
      console.error("BIRTHDAY SYNC ERROR:", err);
      throw err;
    }
    lastBirthdaySyncAt = Date.now();
    return 0;
  }
}

// @route  GET /api/notifications/birthdays
// @access Admin, Staff
export const getBirthdays = async (req, res) => {
  try {
    const upcoming = await getUpcomingBirthdays();
    const isAdmin = req.user.role === "admin";
    const myId = String(req.user._id);

    const visible = upcoming.filter(
      (p) =>
        isAdmin ||
        (p.kind === "staff" && p.id === myId) ||
        (p.kind === "client" && p.assignedStaff === myId)
    );

    return res.status(200).json({
      birthdays: visible.map(({ assignedStaff, dob, ...rest }) => rest),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
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