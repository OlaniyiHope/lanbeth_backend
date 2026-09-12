import "dotenv/config";

import Policy from "../models/policyModel.js";

import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import s3, {
  getS3SignedUrl,
} from "../config/s3.js";

const BUCKET_NAME = "edupros";

/**
 * GET ALL POLICIES
 * GET /api/policies
 */
export const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find()
      .populate("uploadedBy", "fullName username")
      .sort({ createdAt: -1 });

    const policiesWithUrls = await Promise.all(
      policies.map(async (policy) => {
        const hasRead = policy.readBy?.some(
          (entry) =>
            entry.user?.toString() ===
            req.user._id.toString()
        );

        const fileUrl = await getS3SignedUrl(
          policy.fileKey
        );

        return {
          _id: policy._id,
          title: policy.title,
          policyType: policy.policyType,
          description: policy.description,
          fileName: policy.fileName,
          fileKey: policy.fileKey,
          fileUrl,
          uploadedBy: policy.uploadedBy,
          createdAt: policy.createdAt,
          updatedAt: policy.updatedAt,
          status: hasRead ? "Read" : "Unread",
        };
      })
    );

    return res.status(200).json({
      policies: policiesWithUrls,
    });
  } catch (error) {
    console.error("GET POLICIES ERROR:", error);

    return res.status(500).json({
      message: "Failed to load policies",
      error: error.message,
    });
  }
};


/**
 * UPLOAD POLICY
 * POST /api/policies
 *
 * Admin + Policy users
 */
export const uploadPolicy = async (req, res) => {
  let uploadedKey = null;

  try {
    const {
      title,
      policyType,
      description,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Policy title is required.",
      });
    }

    if (!policyType) {
      return res.status(400).json({
        message: "Policy type is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF document.",
      });
    }

    const safeFileName = req.file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const uniqueName = `${Date.now()}-${safeFileName}`;

    uploadedKey = `policies/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadedKey,
      Body: req.file.buffer,
      ContentType: "application/pdf",
      ContentDisposition: "inline",
    });

    await s3.send(command);

    const policy = await Policy.create({
      title: title.trim(),
      policyType,
      description: description?.trim() || "",
      fileName: req.file.originalname,
      fileKey: uploadedKey,
      uploadedBy: req.user._id,
    });

    const fileUrl = await getS3SignedUrl(
      policy.fileKey
    );

    return res.status(201).json({
      message: "Policy uploaded successfully.",
      policy: {
        ...policy.toObject(),
        fileUrl,
        status: "Unread",
      },
    });
  } catch (error) {
    console.error("UPLOAD POLICY ERROR:", error);

    // If MongoDB fails after S3 upload,
    // remove the uploaded S3 object.
    if (uploadedKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uploadedKey,
          })
        );
      } catch (deleteError) {
        console.error(
          "FAILED TO CLEAN UP S3 FILE:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      message: "Failed to upload policy.",
      error: error.message,
    });
  }
};


/**
 * GET SINGLE POLICY
 * GET /api/policies/:id
 */
export const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(
      req.params.id
    ).populate(
      "uploadedBy",
      "fullName username"
    );

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found.",
      });
    }

    const hasRead = policy.readBy?.some(
      (entry) =>
        entry.user?.toString() ===
        req.user._id.toString()
    );

    const fileUrl = await getS3SignedUrl(
      policy.fileKey
    );

    return res.status(200).json({
      policy: {
        ...policy.toObject(),
        fileUrl,
        status: hasRead ? "Read" : "Unread",
      },
    });
  } catch (error) {
    console.error("GET POLICY ERROR:", error);

    return res.status(500).json({
      message: "Failed to load policy.",
      error: error.message,
    });
  }
};


/**
 * UPDATE POLICY
 * PUT /api/policies/:id
 */
export const updatePolicy = async (req, res) => {
  try {
    const {
      title,
      policyType,
      description,
    } = req.body;

    const policy = await Policy.findById(
      req.params.id
    );

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found.",
      });
    }

    if (title !== undefined) {
      policy.title = title.trim();
    }

    if (policyType !== undefined) {
      policy.policyType = policyType;
    }

    if (description !== undefined) {
      policy.description = description.trim();
    }

    await policy.save();

    const fileUrl = await getS3SignedUrl(
      policy.fileKey
    );

    return res.status(200).json({
      message: "Policy updated successfully.",
      policy: {
        ...policy.toObject(),
        fileUrl,
      },
    });
  } catch (error) {
    console.error("UPDATE POLICY ERROR:", error);

    return res.status(500).json({
      message: "Failed to update policy.",
      error: error.message,
    });
  }
};


/**
 * DELETE POLICY
 * DELETE /api/policies/:id
 */
export const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(
      req.params.id
    );

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found.",
      });
    }

    // Delete PDF from S3 first
    if (policy.fileKey) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: policy.fileKey,
        })
      );
    }

    // Delete MongoDB record
    await Policy.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "Policy deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE POLICY ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete policy.",
      error: error.message,
    });
  }
};


/**
 * MARK POLICY AS READ
 * POST /api/policies/:id/mark-as-read
 */
export const markPolicyAsRead = async (
  req,
  res
) => {
  try {
    const policy = await Policy.findById(
      req.params.id
    );

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found.",
      });
    }

    const alreadyRead =
      policy.readBy?.some(
        (entry) =>
          entry.user?.toString() ===
          req.user._id.toString()
      );

    if (!alreadyRead) {
      policy.readBy.push({
        user: req.user._id,
        readAt: new Date(),
      });

      await policy.save();
    }

    return res.status(200).json({
      message: "Policy marked as read.",
    });
  } catch (error) {
    console.error(
      "MARK POLICY READ ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to mark policy as read.",
      error: error.message,
    });
  }
};