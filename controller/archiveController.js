import User from "../models/authModel.js";
import Client from "../models/clientModel.js";

const TYPES = {
  staff: { model: User, filter: { role: "staff" } },
  client: { model: Client, filter: {} },
};

export const listArchive = async (req, res) => {
  try {
    const cfg = TYPES[req.query.type];
    if (!cfg) return res.status(400).json({ message: "type must be staff or client" });

    const items = await cfg.model
      .find({ ...cfg.filter, isArchived: true })
      .select("-password")
      .populate("archivedBy", "fullName")
      .sort({ archivedAt: -1 });

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const restoreItem = async (req, res) => {
  try {
    const { type, id } = req.params;
    const cfg = TYPES[type];
    if (!cfg) return res.status(400).json({ message: "Invalid type" });

    const update = { isArchived: false, archivedAt: null, archivedBy: null };
    if (type === "staff") update.status = "active";

    const item = await cfg.model.findOneAndUpdate(
      { _id: id, ...cfg.filter, isArchived: true },
      update,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Archived record not found" });

    return res.status(200).json({ message: "Restored", item });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Only works on records that are already archived.
export const permanentlyDelete = async (req, res) => {
  try {
    const { type, id } = req.params;
    const cfg = TYPES[type];
    if (!cfg) return res.status(400).json({ message: "Invalid type" });

    const item = await cfg.model.findOneAndDelete({ _id: id, ...cfg.filter, isArchived: true });
    if (!item) return res.status(404).json({ message: "Archived record not found" });

    return res.status(200).json({ message: "Permanently deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};