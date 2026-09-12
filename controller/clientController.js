
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
// @route GET /api/clients/:id/documents
// @access Admin
export const getClientDocuments = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select(
      "fullName clientId documents"
    );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const documents = await Promise.all(
      (client.documents || []).map(async (doc) => {
        let signedUrl = doc.fileUrl || null;

        // Generate a fresh signed S3 URL for private files
        if (doc.fileKey) {
          try {
            signedUrl = await getS3SignedUrl(doc.fileKey);
          } catch (s3Error) {
            console.error(
              `Failed to generate signed URL for ${doc.fileKey}:`,
              s3Error
            );
          }
        }

        return {
          _id: doc._id,
          documentType: doc.documentType,
          fileName: doc.fileName,
          fileKey: doc.fileKey,
          fileUrl: signedUrl,
          uploadedAt: doc.uploadedAt,
        };
      })
    );

    return res.status(200).json({
      clientId: client.clientId,
      clientName: client.fullName,
      total: documents.length,
      documents,
    });
  } catch (err) {
    console.error("Get client documents error:", err);

    return res.status(500).json({
      message: "Failed to load client documents",
      error: err.message,
    });
  }
};

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
// @route POST /api/clients/:id/documents
// @access Admin
export const addClientDocument = async (req, res) => {
  try {
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({
        message: "Document type is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF document",
      });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const document = {
      documentType,
      fileName: req.file.originalname,
      fileKey: req.file.key,
      fileUrl: req.file.location || null,
      uploadedAt: new Date(),
    };

    client.documents.push(document);

    await client.save();

    const savedDocument =
      client.documents[client.documents.length - 1];

    return res.status(201).json({
      message: "Document uploaded successfully",

      document: {
        _id: savedDocument._id,
        documentType: savedDocument.documentType,
        fileName: savedDocument.fileName,
        fileKey: savedDocument.fileKey,
        fileUrl: savedDocument.fileUrl,
        uploadedAt: savedDocument.uploadedAt,
      },
    });
  } catch (err) {
    console.error("ADD CLIENT DOCUMENT ERROR:", err);

    return res.status(500).json({
      message: "Failed to upload client document",
      error: err.message,
    });
  }
};

// @route DELETE /api/clients/:id/documents/:docId
// @access Admin
// @route DELETE /api/clients/:id/documents/:docId
// @access Admin
export const deleteClientDocument = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const document = client.documents.id(req.params.docId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const fileKey = document.fileKey;

    document.deleteOne();

    await client.save();

    // Delete physical file from S3
    if (fileKey) {
      try {
        await deleteFromS3(fileKey);
      } catch (s3Error) {
        console.error(
          "CLIENT DOCUMENT S3 DELETE ERROR:",
          s3Error
        );
      }
    }

    return res.status(200).json({
      message: "Document deleted successfully",
      documentId: req.params.docId,
    });
  } catch (err) {
    console.error(
      "Delete client document error:",
      err
    );

    return res.status(500).json({
      message: "Failed to delete client document",
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