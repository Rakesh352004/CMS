const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Complaint = require("../models/Complaint");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { sendComplaintSubmittedEmail, sendComplaintResolvedEmail } = require("../utils/emailService");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});


// =========================
// CREATE COMPLAINT
// =========================
router.post("/create", authMiddleware, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, category = 'General', priority = 'Medium', location = '' } = req.body;

    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];

    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      category,
      priority,
      location,
      attachments
    });

    await complaint.save();

    // Send email to user
    try {
      await sendComplaintSubmittedEmail(req.user.email, title);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// GET USER COMPLAINTS
// =========================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// GET COMPLAINT DETAILS
// =========================
router.get("/details/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email').populate('comments.user', 'name');

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only owner or admin can view
    if (complaint.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(complaint);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// ADD COMMENT TO COMPLAINT
// =========================
router.post("/comment/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only owner or admin can comment
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { text } = req.body;
    if (!text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    complaint.comments.push({
      user: req.user.id,
      text: text.trim()
    });

    await complaint.save();

    res.json({
      message: "Comment added successfully",
      comment: complaint.comments[complaint.comments.length - 1]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// SUBMIT FEEDBACK
// =========================
router.post("/feedback/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only owner can submit feedback
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only for resolved complaints
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: "Feedback can only be submitted for resolved complaints" });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    complaint.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date()
    };

    await complaint.save();

    res.json({
      message: "Feedback submitted successfully",
      feedback: complaint.feedback
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// EDIT COMPLAINT
// =========================
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // only owner can edit
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    complaint.title = req.body.title || complaint.title;
    complaint.description =
      req.body.description || complaint.description;

    const updatedComplaint = await complaint.save();

    res.json(updatedComplaint);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// DELETE COMPLAINT
// =========================
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // only owner can delete
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await complaint.deleteOne();

    res.json({
      message: "Complaint deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =========================
// ADMIN - GET ALL COMPLAINTS
// =========================
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("user", "email");

      res.json(complaints);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// =========================
// ADMIN - UPDATE STATUS
// =========================
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaint = await Complaint.findById(req.params.id).populate("user", "email");

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }

      const oldStatus = complaint.status;
      complaint.status =
        req.body.status || complaint.status;

      const updatedComplaint = await complaint.save();

      // Send email if status changed to Resolved
      if (oldStatus !== "Resolved" && complaint.status === "Resolved") {
        try {
          await sendComplaintResolvedEmail(complaint.user.email, complaint.title);
        } catch (emailError) {
          console.error('Failed to send resolution email:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.json(updatedComplaint);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// =========================
// SERVE UPLOADED FILES
// =========================
router.get("/file/:filename", authMiddleware, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;