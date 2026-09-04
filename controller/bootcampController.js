import Bootcamp from "../models/bootcampModel.js";

export const createBootcamp = async (req, res) => {
  try {
    const {
      fullname,
      age,
      school,
      grade,
      parentName,
      parentPhone,
      parentWhatsapp,
      parentEmail,
      mode,
      courseInterest,
      experience,
      medical,
      hear,
      comments,
    } = req.body;

    console.log("Request Body:", req.body);

    if (!Array.isArray(courseInterest) || courseInterest.length === 0) {
      return res
        .status(400)
        .json({ error: "Please select at least one course" });
    }

    const receipt = await Bootcamp.create({
      fullname,
      age,
      school,
      grade,
      parentName,
      parentPhone,
      parentWhatsapp,
      parentEmail,
      mode,
      courseInterest,
      experience,
      medical,
      hear,
      comments,
    });

    console.log("Receipt created:", receipt);

    return res.status(201).json({ receipt });
  } catch (error) {
    console.error("Error creating receipt:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};