import nodemailer from "nodemailer";

const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const sendEmail = async ({ to, subject, html }) => {
  if (!hasSmtpConfig()) {
    console.log("Email notification skipped. Configure SMTP to send real mail.", {
      to,
      subject
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "IT Academy LMS <no-reply@example.com>",
    to,
    subject,
    html
  });
};
