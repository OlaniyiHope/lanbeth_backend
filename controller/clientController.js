// import Client from "../models/clientModel.js";

// // Generates the next client ID like CLT-2024-001
// const generateClientId = async () => {
//   const year = new Date().getFullYear();
//   const count = await Client.countDocuments({
//     clientId: { $regex: `^CLT-${year}-` },
//   });
//   const nextNum = String(count + 1).padStart(3, "0");
//   return `CLT-${year}-${nextNum}`;
// };

// // @route  GET /api/clients
// // @access Admin
// // Supports: ?search=&status=&page=&limit=
// export const getClients = async (req, res) => {
//   try {
//     const { search, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (status && status !== "All Status" && status !== "All Clients") {
//       query.status = status;
//     }
//     if (search) {
//       query.$or = [
//         { fullName: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { clientId: { $regex: search, $options: "i" } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [clients, total] = await Promise.all([
//       Client.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
//       Client.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       clients,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  POST /api/clients
// // @access Admin
// export const createClient = async (req, res) => {
//   try {
//     const { fullName, email } = req.body;

//     if (!fullName || !email) {
//       return res.status(400).json({ message: "fullName and email are required" });
//     }

//     const clientId = await generateClientId();

//     const client = await Client.create({
//       ...req.body,
//       clientId,
//     });

//     return res.status(201).json({ message: "Client created", client });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  GET /api/clients/:id
// // @access Admin, Staff (Staff gets read-only on the frontend — same endpoint)
// export const getClientById = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id).populate(
//       "assignedStaff",
//       "fullName email role"
//     );

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.status(200).json({ client });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  PUT /api/clients/:id
// // @access Admin only
// export const updateClient = async (req, res) => {
//   try {
//     const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.status(200).json({ message: "Client updated", client });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  DELETE /api/clients/:id
// // @access Admin only
// export const deleteClient = async (req, res) => {
//   try {
//     const client = await Client.findByIdAndDelete(req.params.id);

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.status(200).json({ message: "Client deleted" });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  POST /api/clients/:id/documents
// // @access Admin
// // Expects file already uploaded to S3 upstream (via multer-s3 or presigned URL);
// // this just records the metadata. Adjust if you're doing direct multipart here.
// export const addClientDocument = async (req, res) => {
//   try {
//     const { fileName, fileUrl } = req.body;

//     if (!fileName || !fileUrl) {
//       return res.status(400).json({ message: "fileName and fileUrl are required" });
//     }

//     const client = await Client.findById(req.params.id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     client.documents.push({ fileName, fileUrl });
//     await client.save();

//     return res.status(201).json({ message: "Document added", documents: client.documents });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  DELETE /api/clients/:id/documents/:docId
// // @access Admin
// export const deleteClientDocument = async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     client.documents = client.documents.filter(
//       (doc) => doc._id.toString() !== req.params.docId
//     );
//     await client.save();

//     return res.status(200).json({ message: "Document removed", documents: client.documents });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @route  PUT /api/clients/:id/assign-staff
// // @access Admin only  (screen: "Assign client")
// export const assignStaffToClient = async (req, res) => {
//   try {
//     const { staffIds } = req.body; // array of User _id's with role "staff"

//     if (!Array.isArray(staffIds)) {
//       return res.status(400).json({ message: "staffIds must be an array" });
//     }

//     const client = await Client.findByIdAndUpdate(
//       req.params.id,
//       { assignedStaff: staffIds },
//       { new: true }
//     ).populate("assignedStaff", "fullName email role");

//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     return res.status(200).json({ message: "Staff assigned", client });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
import Client from "../models/clientModel.js";
import User from "../models/authModel.js";

// Generates the next client ID like CLT-2026-001
const generateClientId = async () => {
  const year = new Date().getFullYear();

  const count = await Client.countDocuments({
    clientId: { $regex: `^CLT-${year}-` },
  });

  const nextNum = String(count + 1).padStart(3, "0");

  return `CLT-${year}-${nextNum}`;
};

// @route GET /api/clients
// @access Admin
// export const getClients = async (req, res) => {
//   try {
//     const {
//       search,
//       status,
//       page = 1,
//       limit = 20,
//     } = req.query;

//     const query = {};

//     if (
//       status &&
//       status !== "All Status" &&
//       status !== "All Clients"
//     ) {
//       query.status = status;
//     }

//     if (search) {
//       query.$or = [
//         {
//           fullName: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           email: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           clientId: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//       ];
//     }

//     const skip =
//       (Number(page) - 1) * Number(limit);

//     const [clients, total] = await Promise.all([
//       Client.find(query)
//         .populate(
//           "assignedStaff",
//           "fullName email phone role jobTitle"
//         )
//         .skip(skip)
//         .limit(Number(limit))
//         .sort({ createdAt: -1 }),

//       Client.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       clients,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(
//         total / Number(limit)
//       ),
//     });
//   } catch (err) {
//     console.error("Get clients error:", err);

//     return res.status(500).json({
//       message: "Server error",
//       error: err.message,
//     });
//   }
// };


export const getClients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const query = {};

    // Staff only ever see clients assigned to them; admin sees everyone.
    if (req.user.role === "staff") {
      query.assignedStaff = req.user._id;
    }

    if (status && status !== "All Status" && status !== "All Clients") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { clientId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [clients, total] = await Promise.all([
      Client.find(query)
        .populate("assignedStaff", "fullName email phone role jobTitle")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Client.countDocuments(query),
    ]);

    return res.status(200).json({
      clients,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("Get clients error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
// @route POST /api/clients
// @access Admin
export const createClient = async (req, res) => {
  try {
    const {
      fullName,
      email,
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message:
          "fullName and email are required",
      });
    }

    const clientId =
      await generateClientId();

    const client = await Client.create({
      ...req.body,
      clientId,
    });

    return res.status(201).json({
      message: "Client created",
      client,
    });
  } catch (err) {
    console.error("Create client error:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route GET /api/clients/:id
// @access Admin, Staff
export const getClientById = async (
  req,
  res
) => {
  try {
    const client =
      await Client.findById(req.params.id)
        .populate(
          "assignedStaff",
          "fullName email phone role jobTitle"
        );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      client,
    });
  } catch (err) {
    console.error(
      "Get client by ID error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route PUT /api/clients/:id
// @access Admin
export const updateClient = async (
  req,
  res
) => {
  try {
    const client =
      await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "assignedStaff",
        "fullName email phone role jobTitle"
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      message: "Client updated",
      client,
    });
  } catch (err) {
    console.error(
      "Update client error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route DELETE /api/clients/:id
// @access Admin
export const deleteClient = async (
  req,
  res
) => {
  try {
    const client =
      await Client.findByIdAndDelete(
        req.params.id
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      message: "Client deleted",
    });
  } catch (err) {
    console.error(
      "Delete client error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route POST /api/clients/:id/documents
// @access Admin
export const addClientDocument = async (
  req,
  res
) => {
  try {
    const {
      fileName,
      fileUrl,
    } = req.body;

    if (!fileName || !fileUrl) {
      return res.status(400).json({
        message:
          "fileName and fileUrl are required",
      });
    }

    const client =
      await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    client.documents.push({
      fileName,
      fileUrl,
    });

    await client.save();

    return res.status(201).json({
      message: "Document added",
      documents: client.documents,
    });
  } catch (err) {
    console.error(
      "Add client document error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route DELETE /api/clients/:id/documents/:docId
// @access Admin
export const deleteClientDocument = async (
  req,
  res
) => {
  try {
    const client =
      await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    client.documents =
      client.documents.filter(
        (doc) =>
          doc._id.toString() !==
          req.params.docId
      );

    await client.save();

    return res.status(200).json({
      message: "Document removed",
      documents: client.documents,
    });
  } catch (err) {
    console.error(
      "Delete client document error:",
      err
    );

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route PUT /api/clients/:id/assign-staff
// @access Admin
export const assignStaffToClient = async (
  req,
  res
) => {
  try {
    const { staffIds } = req.body;

    // --------------------------------
    // Validate request
    // --------------------------------

    if (!Array.isArray(staffIds)) {
      return res.status(400).json({
        message:
          "staffIds must be an array",
      });
    }

    // --------------------------------
    // Find client
    // --------------------------------

    const client =
      await Client.findById(
        req.params.id
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // --------------------------------
    // Validate staff
    // --------------------------------

    if (staffIds.length > 0) {
      const staffMembers =
        await User.find({
          _id: {
            $in: staffIds,
          },
        }).select(
          "_id fullName email phone role jobTitle"
        );

      if (
        staffMembers.length !==
        staffIds.length
      ) {
        return res.status(400).json({
          message:
            "One or more staff members could not be found.",
        });
      }

      // Make sure they are actually staff
      const invalidStaff =
        staffMembers.filter(
          (staff) =>
            staff.role !== "staff"
        );

      if (invalidStaff.length > 0) {
        return res.status(400).json({
          message:
            "Only users with the staff role can be assigned to clients.",
        });
      }
    }

    // --------------------------------
    // Assign staff
    // --------------------------------

    client.assignedStaff = staffIds;

    await client.save();

    // --------------------------------
    // Return populated client
    // --------------------------------

    const updatedClient =
      await Client.findById(
        client._id
      ).populate(
        "assignedStaff",
        "fullName email phone role jobTitle"
      );

    return res.status(200).json({
      message:
        "Staff assigned successfully",
      client: updatedClient,
    });
  } catch (err) {
    console.error(
      "Assign staff error:",
      err
    );

    return res.status(500).json({
      message:
        "Server error while assigning staff",
      error: err.message,
    });
  }
};