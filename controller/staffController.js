import User from "../models/authModel.js";
import Client from "../models/clientModel.js";
import Report from "../models/reportModel.js";
// @route  GET /api/staff
// @access Admin

// @route   GET /api/staff/dashboard
// @access  Staff

// @route   GET /api/staff/me/profile
// @access  Staff
// @route   GET /api/staff/me/profile
// @access  Staff
export const getMyProfile = async (req, res) => {
  try {
    const staffId = req.user._id;

    // Find logged-in staff member
    const staff = await User.findById(staffId)
      .select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff profile not found",
      });
    }

    // Find clients assigned to this staff member
    const assignedClients = await Client.find({
      assignedStaff: staffId,
    })
      .select(
        "clientId fullName email phone status address assignedStaff"
      )
      .sort({
        createdAt: -1,
      });

    /*
    |--------------------------------------------------------------------------
    | Documents
    |--------------------------------------------------------------------------
    |
    | This supports either:
    | staff.documents
    |
    | or an empty array if documents aren't currently stored on User.
    |
    */

    const documents = Array.isArray(staff.documents)
      ? staff.documents
      : [];

    /*
    |--------------------------------------------------------------------------
    | Expiry Documents
    |--------------------------------------------------------------------------
    */

    const expiryDocuments = documents.map((doc) => {
      let status = "Valid";

      if (doc.expiryDate) {
        const today = new Date();
        const expiryDate = new Date(doc.expiryDate);

        const difference =
          expiryDate.getTime() - today.getTime();

        const daysRemaining =
          Math.ceil(
            difference / (1000 * 60 * 60 * 24)
          );

        if (daysRemaining < 0) {
          status = "Expired";
        } else if (daysRemaining <= 30) {
          status = "Expiring Soon";
        }
      }

      return {
        ...doc.toObject(),
        status,
      };
    });

    return res.status(200).json({
      staff: {
        _id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone,
        gender: staff.gender,
        dateOfBirth: staff.dateOfBirth,
        role: staff.role,
        status: staff.status,

        staffId:
          staff.staffId ||
          staff.employeeId ||
          staff._id,

        address: staff.address,
        region: staff.region,

        position:
          staff.position ||
          staff.jobTitle ||
          "Care Worker",

        joinedDate:
          staff.joinedDate ||
          staff.createdAt,

        department:
          staff.department ||
          "Homecare",

        workStatus:
          staff.workStatus ||
          "Full Time",

        supervisor:
          staff.supervisor ||
          "Admin Manager",

        documents,
        expiryDocuments,

        assignedClients,
      },
    });
  } catch (err) {
    console.error(
      "Get staff profile error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route   GET /api/staff/my-clients
// @access  Staff
export const getMyClients = async (req, res) => {
  try {
    const staffId = req.user._id;

    const clients = await Client.find({
      assignedStaff: staffId,
    })
      .select(
        "clientId fullName email phone status dateOfBirth gender condition service address assignedStaff"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      clients,
      total: clients.length,
      activeClients: clients.filter(
        (client) => client.status === "Active"
      ).length,
    });
  } catch (err) {
    console.error(
      "Get my clients error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
export const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user._id;

    // Get clients assigned to this staff member
    const assignedClients = await Client.find({
      assignedStaff: staffId,
      status: "Active",
    })
      .select(
        "clientId fullName email phone dateOfBirth gender address status assignedStaff"
      )
      .sort({ fullName: 1 });

    // Get reports submitted by this staff member
    const reports = await Report.find({
      staff: staffId,
    })
      .populate("client", "clientId fullName")
      .sort({ createdAt: -1 });

    // Reports submitted this month
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const reportsThisMonth = reports.filter((report) => {
      const date = new Date(report.createdAt);

      return date >= startOfMonth && date < endOfMonth;
    });

    return res.status(200).json({
      assignedClients,
      assignedClientsCount: assignedClients.length,

      reportsSubmitted: reportsThisMonth.length,

      pendingReports: 0,

      upcomingVisits: 0,

      recentActivity: reports.slice(0, 10),
    });
  } catch (error) {
    console.error("Staff dashboard error:", error);

    return res.status(500).json({
      message: "Failed to load staff dashboard",
      error: error.message,
    });
  }
};
export const getStaffList = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const query = { role: "staff" };
    if (status && status !== "All Status") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [staff, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      staff,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/staff
// @access Admin
export const createStaff = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "fullName, username, email and password are required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (existing) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const staff = await User.create({
      ...req.body,
      role: "staff",
    });

    return res.status(201).json({
      message: "Staff created",
      staff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        username: staff.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/staff/:id
// @access Admin
export const getStaffById = async (req, res) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, role: "staff" });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({ staff });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  PUT /api/staff/:id
// @access Admin
export const updateStaff = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      updateData,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({ message: "Staff updated", staff });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  POST /api/staff/:id/documents
// @access Admin
export const uploadStaffDocument = async (req, res) => {
  try {
    const { documentType, fileName, fileUrl, expiryDate } = req.body;

    if (!documentType || !fileName || !fileUrl) {
      return res.status(400).json({
        message: "documentType, fileName and fileUrl are required",
      });
    }

    const staff = await User.findOne({ _id: req.params.id, role: "staff" });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.documents.push({ documentType, fileName, fileUrl, expiryDate });
    await staff.save();

    return res.status(201).json({ message: "Document uploaded", documents: staff.documents });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/staff/:id/documents
// @access Admin
export const getStaffDocuments = async (req, res) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, role: "staff" }).select(
      "documents fullName"
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({ documents: staff.documents });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/staff/:id/documents/expiring
// @access Admin
export const getStaffExpiringDocuments = async (req, res) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, role: "staff" }).select(
      "documents fullName"
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringDocs = staff.documents.filter(
      (doc) => doc.expiryDate && doc.expiryDate <= thirtyDaysFromNow
    );

    return res.status(200).json({
      message:
        expiringDocs.length === 0
          ? "No document will expire in the next 30 days"
          : undefined,
      expiringDocs,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/staff/expiry-alerts
// @access Admin
export const getAllExpiryAlerts = async (req, res) => {
  try {
    const { range = 30 } = req.query;

    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() + Number(range));
    const now = new Date();

    const staffList = await User.find({ role: "staff" }).select(
      "fullName documents jobTitle"
    );

    const expiringSoon = [];
    const expired = [];

    staffList.forEach((staff) => {
      staff.documents.forEach((doc) => {
        if (!doc.expiryDate) return;
        const entry = {
          staffId: staff._id,
          staffName: staff.fullName,
          documentType: doc.documentType,
          expiryDate: doc.expiryDate,
          daysRemaining: Math.ceil((doc.expiryDate - now) / (1000 * 60 * 60 * 24)),
        };
        if (doc.expiryDate < now) {
          expired.push(entry);
        } else if (doc.expiryDate <= rangeDate) {
          expiringSoon.push(entry);
        }
      });
    });

    return res.status(200).json({
      documentsExpiringSoon: expiringSoon.length,
      expiredDocuments: expired.length,
      expiringSoon,
      expired,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};