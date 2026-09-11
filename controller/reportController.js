import Report from "../models/reportModel.js";
import Client from "../models/clientModel.js";

// @route  POST /api/clients/:id/reports
// @access Staff, Admin
// Note: per spec, "different staff must be able to submit report more than
// once in a day" — so no uniqueness constraint on client+date+staff.
// export const submitReport = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     const { reportDate } = req.body;
//     if (!reportDate) {
//       return res.status(400).json({ message: "reportDate is required" });
//     }

//     const report = await Report.create({
//       ...req.body,
//       client: req.params.id,
//       staff: req.user._id, // from protect middleware
//     });

//     return res.status(201).json({ message: "Report submitted", report });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

export const submitReport = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const { reportDate } = req.body;

    if (!reportDate) {
      return res.status(400).json({
        message: "reportDate is required",
      });
    }

    const report = await Report.create({
      ...req.body,
      client: req.params.id,
      staff: req.user._id,
    });

    console.log("REPORT CREATED:", report._id);

    return res.status(201).json({
      message: "Report submitted",
      report,
    });

  } catch (err) {
    console.error("SUBMIT REPORT ERROR:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
// @route  GET /api/clients/:id/reports?date=YYYY-MM-DD
// @access Admin, Staff
// Returns all reports for that client on a given date (multiple staff may
// have submitted separately that day).
export const getReportsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "date query param is required" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const reports = await Report.find({
      client: req.params.id,
      reportDate: { $gte: start, $lte: end },
    })
      .populate("staff", "fullName role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ date, reports });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/clients/:id/reports
// @access Admin, Staff
// Lists all distinct submitted dates (for the calendar/date-picker UI),
// plus optional pagination for a flat "all reports" list view.
export const getAllReportDates = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reports, total, distinctDates] = await Promise.all([
      Report.find({ client: req.params.id })
        .populate("staff", "fullName role")
        .sort({ reportDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments({ client: req.params.id }),
      Report.distinct("reportDate", { client: req.params.id }),
    ]);

    return res.status(200).json({
      reports,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      availableDates: distinctDates,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route  GET /api/reports/:reportId
// @access Admin, Staff
// Single report detail (e.g. when clicking a specific date's report)
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate("staff", "fullName role")
      .populate("client", "fullName clientId");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ report });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const filter = {};

    // Staff should only see reports they submitted.
    // Admin can see all reports.
    if (req.user.role === "staff") {
      filter.staff = req.user._id;
    }

    const reports = await Report.find(filter)
      .populate("staff", "fullName role email")
      .populate("client", "fullName clientId")
      .sort({ reportDate: -1, createdAt: -1 });

    return res.status(200).json({
      reports,
      total: reports.length,
    });
  } catch (err) {
    console.error("GET MY REPORTS ERROR:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route  DELETE /api/reports/:reportId
// @access Admin, Staff
// Staff can only delete reports they personally submitted.
// Admin can delete any report.
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // STAFF:
    // Only allow the staff member who created the report to delete it.
    if (req.user.role === "staff") {
      if (String(report.staff) !== String(req.user._id)) {
        return res.status(403).json({
          message: "You can only delete reports you submitted",
        });
      }

      // Optional protection:
      // Do not allow staff to delete reports that have already been reviewed.
      if (
        report.status &&
        report.status.toLowerCase() === "reviewed"
      ) {
        return res.status(403).json({
          message: "Reviewed reports cannot be deleted",
        });
      }
    }

    await Report.findByIdAndDelete(req.params.reportId);

    console.log("REPORT DELETED:", report._id);

    return res.status(200).json({
      message: "Report deleted successfully",
      reportId: report._id,
    });
  } catch (err) {
    console.error("DELETE REPORT ERROR:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};