import Policy from "../models/policyModel.js";

// @route  GET /api/policy
// @access Admin, Staff, Policy-user
// For staff, response includes "read" status specific to req.user
export const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });

    const policiesWithReadStatus = policies.map((p) => {
      const hasRead = p.readBy.some(
        (entry) => entry.user.toString() === req.user._id.toString()
      );
      return {
        _id: p._id,
        title: p.title,
        fileName: p.fileName,
        fileUrl: p.fileUrl,
        createdAt: p.createdAt,
        status: hasRead ? "Read" : "Unread",
      };
    });

    return res.status(200).json({ policies: policiesWithReadStatus });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/policy
// @access Admin only
export const uploadPolicy = async (req, res) => {
  try {
    const { title, fileName, fileUrl } = req.body;

    if (!title || !fileName || !fileUrl) {
      return res.status(400).json({
        message: "title, fileName and fileUrl are required",
      });
    }

    const policy = await Policy.create({
      title,
      fileName,
      fileUrl,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({ message: "Policy uploaded", policy });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/policy/:id
// @access Admin, Staff, Policy-user
export const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res.status(200).json({ policy });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  PUT /api/policy/:id
// @access Admin only
export const updatePolicy = async (req, res) => {
  try {
    const { title, fileName, fileUrl } = req.body;

    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      { title, fileName, fileUrl },
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res.status(200).json({ message: "Policy updated", policy });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  DELETE /api/policy/:id
// @access Admin, Policy-user
export const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res.status(200).json({ message: "Policy deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/policy/:id/mark-as-read
// @access Staff, Admin (whoever is reading it)
export const markPolicyAsRead = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    const alreadyRead = policy.readBy.some(
      (entry) => entry.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      policy.readBy.push({ user: req.user._id });
      await policy.save();
    }

    return res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};