import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateProfessionalBlueIdCard = async (student) => {
  // Vertical ID Card dimensions: 54mm x 86mm
  const width = 54;
  const height = 86;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height]
  });

  // Professional Deep Blue theme
  const primaryBlue = [0, 51, 153];     // #003399
  const darkBlue = [0, 38, 115];         // Darker shade
  const white = [255, 255, 255];
  const lightGray = [248, 250, 252];
  const darkText = [30, 41, 59];
  const grayText = [100, 116, 139];
  const borderGray = [180, 180, 180];
  const successGreen = [34, 197, 94];

  // ========== FRONT SIDE ==========

  // Card border
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.2);
  doc.rect(0, 0, width, height);

  // Curved header background
  doc.setFillColor(...primaryBlue);
  doc.beginPath();
  doc.moveTo(0, 0);
  doc.lineTo(width, 0);
  doc.lineTo(width, 18);
  doc.quadraticCurveTo(width / 2, 25, 0, 18);
  doc.closePath();
  doc.fill();

  // Header decorative line
  doc.setFillColor(...darkBlue);
  doc.rect(0, 17, width, 1, "F");

  // Logo text
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("HMITLC", width / 2, 6, { align: "center" });

  doc.setFontSize(4);
  doc.setFont("helvetica", "normal");
  doc.text("Hasrat Mohani IT Literacy Centre", width / 2, 10, { align: "center" });

  // Status badge
  doc.setFillColor(...successGreen);
  doc.roundedRect(width - 12, 3, 10, 4, 1, 1, "F");
  doc.setTextColor(...white);
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED", width - 7, 5.5, { align: "center" });

  // Student photo - circular placeholder
  const photoSize = 22;
  const photoX = (width - photoSize) / 2;
  const photoY = 22;

  // Photo background with border
  doc.setFillColor(245, 247, 250);
  doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "F");

  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(0.5);
  doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "S");

  // Add actual photo if available
  if (student.profilePicture && student.profilePicture.startsWith("data:image")) {
    try {
      // Create circular clipping by drawing image in circle
      doc.addImage(student.profilePicture, "JPEG", photoX, photoY, photoSize, photoSize);
      // Redraw circular border
      doc.setDrawColor(...primaryBlue);
      doc.setLineWidth(0.5);
      doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "S");
    } catch (e) {
      // Keep placeholder
    }
  } else {
    // Photo placeholder text
    doc.setTextColor(...grayText);
    doc.setFontSize(5);
    doc.text("PHOTO", photoX + photoSize / 2, photoY + photoSize / 2 + 1, { align: "center" });
  }

  // Student Name
  doc.setTextColor(...darkText);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const name = student.fullName || "Student Name";
  const displayName = name.length > 20 ? name.substring(0, 18) + ".." : name;
  doc.text(displayName, width / 2, 48, { align: "center" });

  // Course Name
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  const course = (student.courseName || "General").substring(0, 22);
  doc.text(course, width / 2, 52, { align: "center" });

  // Student ID Badge (rounded box)
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(10, 55, width - 20, 8, 2, 2, "F");

  doc.setTextColor(...white);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text(`STUDENT ID: ${student.studentId || "N/A"}`, width / 2, 59.5, { align: "center" });

  // Batch info
  if (student.batchName) {
    doc.setFillColor(254, 240, 138); // Amber
    doc.roundedRect(15, 65, width - 30, 5, 1.5, 1.5, "F");
    doc.setTextColor(180, 83, 9); // Dark amber
    doc.setFontSize(4);
    doc.setFont("helvetica", "bold");
    doc.text(`BATCH: ${student.batchName}`, width / 2, 68.5, { align: "center" });
  }

  // Curved footer
  doc.setFillColor(...primaryBlue);
  doc.beginPath();
  doc.moveTo(0, height);
  doc.lineTo(width, height);
  doc.lineTo(width, height - 8);
  doc.quadraticCurveTo(width / 2, height - 16, 0, height - 8);
  doc.closePath();
  doc.fill();

  doc.setTextColor(...white);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT IDENTITY CARD", width / 2, height - 4, { align: "center" });

  // ========== BACK SIDE ==========
  doc.addPage([width, height], "portrait");

  // Card border
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.2);
  doc.rect(0, 0, width, height);

  // Header background
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, width, 12, "F");

  doc.setTextColor(...white);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("HMITLC • Student Details", width / 2, 7, { align: "center" });

  // Details section background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 12, width, 45, "F");

  const labelCol = 3;
  const valueCol = 20;
  let startY = 18;

  doc.setFontSize(4);

  // Student Name
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Student Name:", labelCol, startY);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text((student.fullName || "N/A").substring(0, 18), valueCol, startY);

  // Father's Name
  startY += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Father's Name:", labelCol, startY);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text((student.fatherName || "N/A").substring(0, 18), valueCol, startY);

  // CNIC
  startY += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("CNIC/B-Form:", labelCol, startY);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.5);
  doc.text(student.cnic || "N/A", valueCol, startY);
  doc.setFontSize(4);

  // Course
  startY += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Course:", labelCol, startY);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text((student.courseName || "General").substring(0, 16), valueCol, startY);

  // Batch
  startY += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Batch:", labelCol, startY);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text(student.batchName || "N/A", valueCol, startY);

  // QR Code section
  const qrX = (width - 24) / 2;
  const qrY = 58;
  const qrSize = 22;

  // Generate QR code
  const qrData = JSON.stringify({
    id: student.studentId,
    name: student.fullName,
    cnic: student.cnic,
    course: student.courseName,
    batch: student.batchName
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: qrSize * 4,
      margin: 0,
      color: { dark: "#003399", light: "#FFFFFF" }
    });
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch (e) {
    // Fallback
    doc.setFillColor(...lightGray);
    doc.rect(qrX, qrY, qrSize, qrSize, "F");
  }

  // QR Label
  doc.setTextColor(...darkText);
  doc.setFontSize(3);
  doc.setFont("helvetica", "bold");
  doc.text("Scan for Verification", width / 2, qrY + qrSize + 3, { align: "center" });

  // Bottom footer notice
  doc.setFillColor(...primaryBlue);
  doc.rect(0, height - 8, width, 8, "F");

  doc.setTextColor(254, 240, 138); // Light yellow text
  doc.setFontSize(3);
  doc.text("This card is for HMITLC premises only.", width / 2, height - 4.5, { align: "center" });
  doc.text("If found, please return to HMITLC.", width / 2, height - 2.5, { align: "center" });

  // Save PDF
  const fileName = `HMITLC_ID_${student.studentId || "student"}.pdf`;
  doc.save(fileName);
};

export default generateProfessionalBlueIdCard;