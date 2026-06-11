import { body } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

export const contactRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").trim().isLength({ min: 3 }).withMessage("Subject is required"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters")
];

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Send email to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL || "admissions@hmitc.edu.pk",
    subject: `HMITC Contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  });

  // Send confirmation email to user
  await sendEmail({
    to: email,
    subject: "HMITC - We received your message",
    html: `
      <h2>Thank you for contacting HMITC</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you within 24-48 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${message}</p>
      <p>Best regards,<br/>Hasrat Mohani IT Literacy Centre</p>
    `
  });

  res.status(201).json({ message: "Your message has been sent successfully" });
});
