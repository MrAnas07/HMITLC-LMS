import MailerLite from "@mailerlite/mailerlite-nodejs";

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY,
});

export const sendMailerLiteEmail = async (
  toEmail,
  toName,
  subject,
  html,
  fromEmail = "admission@hmitlc.edu.pk",
  fromName = "HMITLC Admission"
) => {
  try {
    if (!process.env.MAILERLITE_API_KEY) {
      console.error("MailerLite API key missing in .env");
      return false;
    }

    await mailerlite.transactional.sendEmail({
      get_content: {
        html,
        subject,
      },
      from: {
        email: fromEmail,
        name: fromName,
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
    });

    console.log(`MailerLite email sent to: ${toEmail}`);
    return true;
  } catch (error) {
    console.error("MailerLite error:", error?.response?.data || error.message);
    return false;
  }
};

// 1. ADMISSION SUBMISSION CONFIRMATION
export const buildSubmissionEmail = (studentName, courseName, trackingId) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr><td style="background:linear-gradient(135deg,#1045b8,#2563eb,#f59e0b);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:1px;">HASRAT MOHANI IT LITERACY CENTRE</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Admission Cell</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1045b8;font-size:20px;">Assalam-o-Alaikum ${studentName},</h2>
              <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
                Your online admission application to <strong>HMITLC</strong> has been received successfully.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <tr><td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;width:160px;">Application Status</td>
                      <td style="padding:6px 0;color:#f59e0b;font-size:13px;font-weight:700;">Under Review</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Applied Course</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Tracking ID</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;font-family:monospace;">${trackingId}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>
              <p style="margin:16px 0;color:#475569;font-size:14px;line-height:1.7;">
                <strong>Required Documents (Bring to Institute):</strong>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
                <tr><td style="padding:16px;">
                  <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.8;">
                    1. CNIC / B-Form<br>
                    2. Academic Mark Sheets<br>
                    3. 2 Passport Size Photos
                  </p>
                </td></tr>
              </table>
              <p style="margin:0;color:#475569;font-size:13px;line-height:1.7;">
                Please visit the HMITLC campus with the above original documents for verification. We will review your application and notify you of the decision soon.
              </p>
            </td></tr>
            <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">Hasrat Mohani IT Literacy Centre &bull; HMITLC 2026</p>
              <p style="margin:4px 0 0;color:#cbd5e1;font-size:10px;">This is an automated email. Please do not reply directly.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
};

// 2. ADMISSION APPROVED
export const buildApprovedEmail = (studentName, studentId, courseName, batchName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr><td style="background:linear-gradient(135deg,#16a34a,#22c55e,#f59e0b);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:1px;">HASRAT MOHANI IT LITERACY CENTRE</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Congratulations</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#16a34a;font-size:20px;">Assalam-o-Alaikum ${studentName},</h2>
              <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;font-weight:700;">
                CONGRATULATIONS! ADMISSION CONFIRMED
              </p>
              <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
                We are pleased to inform you that your application has been approved after a complete verification process. Welcome to the <strong>HMITLC IT Education Program</strong>!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
                <tr><td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Student Name</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${studentName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Student ID</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;font-family:monospace;">${studentId}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Course Track</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Batch Details</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;font-family:monospace;">${batchName}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>
              <p style="margin:16px 0;color:#475569;font-size:14px;line-height:1.7;">
                <strong>Action Required:</strong>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
                <tr><td style="padding:16px;">
                  <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.8;">
                    1. Login to the HMITLC Portal using your existing credentials.<br>
                    2. Download your <strong>ID Card</strong> and PDF from the Dashboard.<br>
                    3. Bring a printed copy of your ID Card on the first day of class.
                  </p>
                </td></tr>
              </table>
              <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
                Wishing you a bright tech future ahead!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr><td align="center">
                  <a href="https://hmitlc.edu.pk/student-login" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Login to Student Portal</a>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">Hasrat Mohani IT Literacy Centre &bull; HMITLC 2026</p>
              <p style="margin:4px 0 0;color:#cbd5e1;font-size:10px;">This is an automated email. Please do not reply directly.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
};

// 3. ADMISSION REJECTED
export const buildRejectedEmail = (studentName, courseName, rejectionReason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr><td style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:1px;">HASRAT MOHANI IT LITERACY CENTRE</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Admission Cell</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#dc2626;font-size:20px;">Assalam-o-Alaikum ${studentName},</h2>
              <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
                We regret to inform you that after a thorough review of your application for <strong>${courseName}</strong>, it has not been approved at this time.
              </p>
              ${rejectionReason ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#fef2f2;border-radius:12px;border:1px solid #fecaca;">
                <tr><td style="padding:20px;">
                  <p style="margin:0;color:#dc2626;font-size:13px;font-weight:700;">Rejection Reason:</p>
                  <p style="margin:8px 0 0;color:#991b1b;font-size:13px;line-height:1.6;">${rejectionReason}</p>
                </td></tr>
              </table>
              ` : ""}
              <p style="margin:16px 0;color:#475569;font-size:14px;line-height:1.7;">
                <strong>What Can You Do Next?</strong>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
                <tr><td style="padding:16px;">
                  <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.8;">
                    1. Submit a fresh application on the portal with clear and original documents.<br>
                    2. Visit the HMITLC campus directly with your original documents for guidance.
                  </p>
                </td></tr>
              </table>
              <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
                Thank you for your interest in HMITLC. We wish you the best for your future attempts.
              </p>
            </td></tr>
            <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">Hasrat Mohani IT Literacy Centre &bull; HMITLC 2026</p>
              <p style="margin:4px 0 0;color:#cbd5e1;font-size:10px;">This is an automated email. Please do not reply directly.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
};

// 4. GRADUATION
export const buildGraduationEmail = (studentName, studentId, courseName, batchName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr><td style="background:linear-gradient(135deg,#16a34a,#22c55e,#f59e0b);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:1px;">HASRAT MOHANI IT LITERACY CENTRE</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Congratulations</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#16a34a;font-size:22px;">Dear ${studentName},</h2>
              <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;font-weight:700;">
                CONGRATULATIONS ON YOUR GRADUATION!
              </p>
              <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
                We are incredibly proud to inform you that your academic records have been finalized, and you have successfully completed your training program at HMITLC.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
                <tr><td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Course Completed</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Student ID</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;font-family:monospace;">${studentId}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:13px;">Batch Details</td>
                      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;font-family:monospace;">${batchName}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>
              <p style="margin:16px 0;color:#475569;font-size:14px;line-height:1.7;">
                <strong>Share Your Journey With Us (Feedback Required):</strong>
              </p>
              <p style="margin:0 0 16px;color:#475569;font-size:13px;line-height:1.7;">
                Your experience matters deeply to us. To help us improve and serve future tech enthusiasts better, please share your valuable feedback regarding the course, your instructor, and your overall learning experience.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr><td align="center">
                  <a href="https://forms.gle/YOUR_FORM_ID" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Share Your Feedback</a>
                </td></tr>
              </table>
              <p style="margin:16px 0 0;color:#475569;font-size:14px;line-height:1.7;">
                Your digital profile has been unlocked. You are now eligible to enroll in any of our advanced courses or step confidently into your professional tech career. Thank you for being an exceptional part of the HMITLC family.
              </p>
            </td></tr>
            <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">Hasrat Mohani IT Literacy Centre &bull; HMITLC 2026</p>
              <p style="margin:4px 0 0;color:#cbd5e1;font-size:10px;">This is an automated email. Please do not reply directly.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
};
