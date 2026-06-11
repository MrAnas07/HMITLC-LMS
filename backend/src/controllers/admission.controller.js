import { body, query } from "express-validator";
import Admission from "../models/Admission.js";
import Course from "../models/Course.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";
import { sendWhatsAppMessage } from "../utils/whatsappService.js";
import {
  sendMailerLiteEmail,
  buildSubmissionEmail,
  buildApprovedEmail,
  buildRejectedEmail,
  buildGraduationEmail,
} from "../utils/mailerliteService.js";

export const admissionRules = [
  body("fullName").trim().isLength({ min: 2 }).withMessage("Full name is required"),
  body("fatherName").trim().isLength({ min: 2 }).withMessage("Father name is required"),
  body("dateOfBirth").isISO8601().withMessage("Date of birth is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("phone").trim().matches(/^03[0-9]{9}$/).withMessage("Phone number must be Pakistani format 03XXXXXXXXX"),
  body("fatherPhone").trim().matches(/^03[0-9]{9}$/).withMessage("Father's phone must be Pakistani format 03XXXXXXXXX"),
  body("cnic").trim().matches(/^[0-9]{13}$/).withMessage("CNIC must be exactly 13 digits"),
  body("fatherCnic").trim().matches(/^[0-9]{13}$/).withMessage("Father's CNIC must be exactly 13 digits"),
  body("address")
    .trim()
    .isLength({ min: 10, max: 220 })
    .withMessage("Address must be between 10 and 220 characters"),
  body("computerProficiency").isIn(["Beginner", "Intermediate", "Advanced"]),
  body("lastQualification").isIn(["Matric", "Intermediate", "Graduate", "Other"]),
  body("referralSource").isIn(["Facebook", "Instagram", "Friend", "Google", "Other"]),
  body("hasLaptop").isBoolean().withMessage("Laptop selection is required"),
  body("selectedCourse").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid course"),
  body("profilePicture").optional({ checkFalsy: true }).isString()
];

export const admissionListRules = [
  query("status").optional({ nullable: true, emptyString: true }).isIn(["Pending", "Approved", "Rejected", "Graduated"])
];

export const getMyAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findOne({ student: req.user._id })
    .populate("selectedCourse", "title slug category")
    .sort({ createdAt: -1 });

  if (!admission) {
    return res.status(404).json({ success: false, message: "No admission record found." });
  }

  res.json({ success: true, admission });
});

export const createAdmission = asyncHandler(async (req, res) => {
  let selectedCourse = null;

  if (req.body.selectedCourse) {
    selectedCourse = await Course.findById(req.body.selectedCourse);
    if (!selectedCourse) throw new ApiError(404, "Selected course not found");
    if (selectedCourse.seatsAvailable !== undefined && selectedCourse.seatsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: "This course is full. No seats available. Please check back later when admin opens new seats."
      });
    }
  }

  // Check if student has an active (Approved) admission
  const activeAdmission = await Admission.findOne({
    student: req.user._id,
    status: "Approved"
  }).populate("selectedCourse", "title");

  if (activeAdmission) {
    return res.status(400).json({
      success: false,
      message: `You already have an active course (${activeAdmission.selectedCourse?.title || "General"}). Please complete your current course before applying for a new one.`
    });
  }

  const existingPending = await Admission.findOne({
    student: req.user._id,
    status: "Pending"
  });

  if (existingPending) {
    throw new ApiError(409, "You already have a pending admission application");
  }

  // Map frontend field names to backend field names
  const admissionData = {
    fullName: req.body.fullName,
    fatherName: req.body.fatherName,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    phone: req.body.phone,
    fatherPhone: req.body.fatherPhone,
    // Handle both old (idNumber) and new (cnic) field names
    cnic: req.body.cnic || req.body.idNumber,
    fatherCnic: req.body.fatherCnic || req.body.fatherIdNumber,
    address: req.body.address,
    computerProficiency: req.body.computerProficiency,
    lastQualification: req.body.lastQualification,
    referralSource: req.body.referralSource,
    hasLaptop: req.body.hasLaptop === true || req.body.hasLaptop === "true",
    selectedCourse: selectedCourse?._id,
    student: req.user._id,
    status: "Pending",
    profilePicture: req.body.profilePicture || ""
  };

  const admission = await Admission.create(admissionData);

  const submissionMsg =
    `*HASRAT MOHANI IT LITERACY CENTRE*\n` +
    `=================================\n\n` +
    `*Assalam-o-Alaikum ${admission.fullName},* 👋\n\n` +
    `📝 *Application Received Successfully*\n\n` +
    `Your online admission application to *HMITLC* has been received successfully.\n\n` +
    `📊 *Application Status:* Under Review\n` +
    `📚 *Applied Course:* ${selectedCourse?.title || "N/A"}\n` +
    `🆔 *Tracking ID:* ${admission._id.toString().slice(-6).toUpperCase()}\n\n` +
    `📋 *Required Documents (Bring to Institute):*\n` +
    `Please visit the HMITLC campus with the following original documents for verification:\n` +
    `1️⃣ CNIC / B-Form\n` +
    `2️⃣ Academic Mark Sheets\n` +
    `3️⃣ 2 Passport Size Photos\n\n` +
    `⚠️ *Important Reminder:*\n` +
    `Please *SAVE* the official HMITLC contact card below to your phone now, so that all future notifications (Approved/Rejected Status and Test Updates) are delivered to your inbox without any interruption.\n\n` +
    `_Regards,_\n` +
    `*HMITLC Admission Department*\n` +
    `---------------------------------\n` +
    `📍 Hasrat Mohani Campus, Karachi.`;
  sendWhatsAppMessage(admission.phone, submissionMsg, true);

  // MailerLite submission email
  try {
    const trackingId = admission._id.toString().slice(-6).toUpperCase();
    await sendMailerLiteEmail(
      admission.email,
      admission.fullName,
      `HMITLC Application Received - Tracking ID: ${trackingId}`,
      buildSubmissionEmail(
        admission.fullName,
        selectedCourse?.title || "N/A",
        trackingId
      )
    );
  } catch (mlErr) {
    console.error("MailerLite submission email failed:", mlErr.message);
  }

  if (selectedCourse) {
    selectedCourse.applicationCount += 1;
    await selectedCourse.save();
  }

  await sendEmail({
    to: admission.email,
    subject: "HMITC admission application received",
    html: `<p>Hello ${admission.fullName},</p><p>Your admission application has been submitted successfully. Current status: <strong>Pending</strong>.</p>`
  });

  res.status(201).json({ admission });
});

export const listAdmissions = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "student") {
    filter.student = req.user._id;
  }

  if (req.query.status && req.user.role !== "student") {
    filter.status = req.query.status;
  }

  const admissions = await Admission.find(filter)
    .populate("student", "name email role")
    .populate("selectedCourse", "title slug category price duration")
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ admissions });
});

export const verifyStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const admission = await Admission.findOne({
    studentId,
    status: { $in: ["Approved", "Graduated"] }
  })
    .populate("selectedCourse", "title category")
    .populate("student", "name");

  if (!admission) {
    return res.status(404).json({
      success: false,
      verified: false,
      message: "Student not found or admission not approved"
    });
  }

  res.json({
    success: true,
    verified: true,
    data: {
      studentId: admission.studentId,
      fullName: admission.student?.name || admission.fullName,
      courseName: admission.selectedCourse?.title || "General",
      category: admission.selectedCourse?.category || "",
      batchName: admission.batchName || "",
      status: admission.status === "Graduated" ? "Graduated" : "Active",
      approvedAt: admission.approvedAt || admission.updatedAt || admission.createdAt
    }
  });
});

// Generate unique student ID
const generateStudentId = async () => {
  const year = new Date().getFullYear();
  const count = await Admission.countDocuments({ studentId: new RegExp(`^HMITLC-${year}`) });
  const newNumber = (count + 1).toString().padStart(3, "0");
  return `HMITLC-${year}-${newNumber}`;
};

export const decideAdmission = asyncHandler(async (req, res, next) => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) throw new ApiError(404, "Admission application not found");

  // Get and normalize status
  let newStatus = req.body.status || "";
  newStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();

  // Only accept Approved or Rejected
  if (newStatus !== "Approved" && newStatus !== "Rejected") {
    newStatus = "Approved";
  }

  const wasApproved = admission.status === "Approved";
  const isApproving = newStatus === "Approved" && !wasApproved;
  const isUnapproving = wasApproved && newStatus !== "Approved";
  const courseId = admission.selectedCourse;

  // Build update object
  const updateData = {
    status: newStatus,
    decisionNote: req.body.decisionNote || "",
    rejectionReason: newStatus === "Rejected" ? req.body.rejectionReason || req.body.decisionNote || "" : "",
    reviewedBy: req.user._id,
    reviewedAt: new Date()
  };

  // If approving, add scheduling fields and generate student ID
  if (newStatus === "Approved") {
    // Validate required schedule fields
    if (!req.body.classTiming) {
      throw new ApiError(400, "Class timing is required when approving");
    }
    if (!req.body.classDays || !Array.isArray(req.body.classDays) || req.body.classDays.length === 0) {
      throw new ApiError(400, "At least one class day is required when approving");
    }

    // Generate unique student ID if not already assigned
    let studentId = admission.studentId;
    if (!studentId) {
      studentId = await generateStudentId();
    }

    updateData.studentId = studentId;
    updateData.classTiming = req.body.classTiming;
    updateData.classDays = req.body.classDays;
    updateData.batchName = req.body.batchName || "";
    updateData.assignedBy = req.user._id;
    updateData.approvedAt = new Date();
  }

  if (isApproving && courseId) {
    const course = await Course.findOneAndUpdate(
      { _id: courseId, seatsAvailable: { $gt: 0 } },
      { $inc: { seatsAvailable: -1, seatsBooked: 1 } },
      { new: true }
    );

    if (!course) {
      return res.status(400).json({ message: "No seats available in this course" });
    }
  }

  // Update with runValidators: false to skip schema validation
  const updated = await Admission.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: false }
  ).populate("selectedCourse", "title");

  if (!updated) {
    if (isApproving && courseId) {
      await Course.findByIdAndUpdate(courseId, {
        $inc: { seatsAvailable: 1, seatsBooked: -1 }
      });
    }
    throw new ApiError(500, "Failed to update admission");
  }

  if (isUnapproving && courseId) {
    await Course.findByIdAndUpdate(courseId, {
      $inc: { seatsAvailable: 1, seatsBooked: -1 }
    });
  }

  if (newStatus === "Approved") {
    const approvedMsg =
      `*HASRAT MOHANI IT LITERACY CENTRE*\n` +
      `=================================\n\n` +
      `*Assalam-o-Alaikum ${updated.fullName},* 👋\n\n` +
      `🎉 *CONGRATULATIONS! ADMISSION CONFIRMED*\n\n` +
      `We are pleased to inform you that your application has been approved after a complete verification process. Welcome to the *HMITLC IT Education Program*!\n\n` +
      `📲 *Your Enrolled Details (Download from Portal):*\n` +
      `• *Student Name:* ${updated.fullName}\n` +
      `• *Student ID:* ${updated.studentId}\n` +
      `• *Course Track:* ${updated.selectedCourse?.title || "N/A"}\n` +
      `• *Batch Details:* ${updated.batchName || "N/A"}\n\n` +
      `🚀 *Action Required:*\n` +
      `1. Login to the HMITLC Portal using your existing credentials.\n` +
      `2. Download your *ID Card* and PDF from the Dashboard.\n` +
      `3. Bring a printed copy of your ID Card on the first day of class.\n\n` +
      `_Wishing you a bright tech future ahead!_\n\n` +
      `_Regards,_\n` +
      `*HMITLC Management Team*\n` +
      `---------------------------------\n` +
      `🌐 Website: www.hmitlc.edu.pk`;
    sendWhatsAppMessage(updated.phone, approvedMsg, true);

    // MailerLite approved email
    try {
      await sendMailerLiteEmail(
        updated.email,
        updated.fullName,
        `Congratulations! Your HMITLC Admission is Approved`,
        buildApprovedEmail(
          updated.fullName,
          updated.studentId,
          updated.selectedCourse?.title || "N/A",
          updated.batchName || "N/A"
        )
      );
    } catch (mlErr) {
      console.error("MailerLite approved email failed:", mlErr.message);
    }
  }

  if (newStatus === "Rejected") {
    const rejectedMsg =
      `*HASRAT MOHANI IT LITERACY CENTRE*\n` +
      `=================================\n\n` +
      `*Assalam-o-Alaikum ${updated.fullName},* 👋\n\n` +
      `⚠️ *Admission Application Status Update*\n\n` +
      `We regret to inform you that after a thorough review of your application, it has not been approved at this time.\n\n` +
      `❌ *Rejection Reason:*\n` +
      `${updated.rejectionReason || "Attached documents or profile image were not clear/valid according to institute criteria."}\n\n` +
      `💡 *What Can You Do Next?*\n` +
      `If you believe this was due to a technical issue or would like to reapply with correct documents, you can:\n` +
      `1. Submit a fresh application on the portal with clear and original documents.\n` +
      `2. Visit the HMITLC campus directly with your original documents for guidance.\n\n` +
      `_Thank you for your interest in HMITLC. We wish you the best for your future attempts._\n\n` +
      `_Regards,_\n` +
      `*HMITLC Desk Support*\n` +
      `---------------------------------\n` +
      `📧 Support: support@hmitlc.edu.pk`;
    sendWhatsAppMessage(updated.phone, rejectedMsg);

    // MailerLite rejected email
    try {
      await sendMailerLiteEmail(
        updated.email,
        updated.fullName,
        `HMITLC Admission Application Update`,
        buildRejectedEmail(
          updated.fullName,
          updated.selectedCourse?.title || "N/A",
          updated.rejectionReason || ""
        )
      );
    } catch (mlErr) {
      console.error("MailerLite rejected email failed:", mlErr.message);
    }
  }

  // Send email with schedule details if approved
  try {
    let emailHtml = `<p>Hello ${updated.fullName},</p><p>Your HMITC admission application status is <strong>${updated.status}</strong>.</p><p>${updated.decisionNote || ""}</p>`;

    if (newStatus === "Approved" && updated.classTiming) {
      emailHtml += `
        <h3>Your Class Schedule</h3>
        <p><strong>Student ID:</strong> ${updated.studentId}</p>
        <p><strong>Batch:</strong> ${updated.batchName || "N/A"}</p>
        <p><strong>Timing:</strong> ${updated.classTiming}</p>
        <p><strong>Days:</strong> ${updated.classDays.join(", ")}</p>
        <p><strong>CNIC:</strong> ${updated.cnic}</p>
      `;
    }

    await sendEmail({
      to: updated.email,
      subject: `HMITC admission ${updated.status}`,
      html: emailHtml
    });
  } catch (emailErr) {
    console.error("Email failed:", emailErr.message);
  }

  res.json({ admission: updated });
});

export const updateStudentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  const allowedStatuses = ["Pending", "Approved", "Rejected", "Graduated"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new ApiError(400, "Invalid status. Must be Pending, Approved, Rejected, or Graduated.");
  }

  const admission = await Admission.findById(id).populate("selectedCourse", "title");
  if (!admission) {
    throw new ApiError(404, "Admission not found.");
  }

  const oldStatus = admission.status;
  admission.status = newStatus;
  await admission.save();

  if (newStatus === "Graduated") {
    const graduationMsg =
      `*HASRAT MOHANI IT LITERACY CENTRE*\n` +
      `=================================\n\n` +
      `*Dear ${admission.fullName},* 🎓\n\n` +
      `🎉 *CONGRATULATIONS ON YOUR GRADUATION!*\n\n` +
      `We are incredibly proud to inform you that your academic records have been finalized, and you have successfully completed your training program at HMITLC.\n\n` +
      `📚 *Course Completed:* ${admission.selectedCourse?.title || "N/A"}\n` +
      `🪪 *Student ID:* ${admission.studentId || "N/A"}\n` +
      `🗓️ *Batch Details:* ${admission.batchName || "N/A"}\n\n` +
      `🌟 *Share Your Journey With Us (Feedback Required):*\n` +
      `Your experience matters deeply to us. To help us improve and serve future tech enthusiasts better, please share your valuable feedback regarding the course, your instructor, and your overall learning experience.\n\n` +
      `👉 *Click here to submit your feedback:* https://forms.gle\n` +
      `_(Kindly take 2 minutes to complete this form as it helps in processing your official final certificate.)_\n\n` +
      `🚀 *What's Next?*\n` +
      `Your digital profile has been unlocked. You are now eligible to enroll in any of our advanced courses or step confidently into your professional tech career.\n\n` +
      `Thank you for being an exceptional part of the HMITLC family. We wish you endless success in your future tech endeavors!\n\n` +
      `_Best Regards,_\n` +
      `*Hasrat Mohani IT Literacy Centre*\n` +
      `---------------------------------\n` +
      `🌐 Website: www.hmitlc.edu.pk`;
    sendWhatsAppMessage(admission.phone, graduationMsg, true);

    // MailerLite graduation email
    try {
      await sendMailerLiteEmail(
        admission.email,
        admission.fullName,
        `Congratulations on Your Graduation from HMITLC!`,
        buildGraduationEmail(
          admission.fullName,
          admission.studentId || "N/A",
          admission.selectedCourse?.title || "N/A",
          admission.batchName || "N/A"
        )
      );
    } catch (mlErr) {
      console.error("MailerLite graduation email failed:", mlErr.message);
    }
  }

  res.status(200).json({
    success: true,
    message: `Status updated from ${oldStatus} to ${newStatus}.`,
    data: admission
  });
});
