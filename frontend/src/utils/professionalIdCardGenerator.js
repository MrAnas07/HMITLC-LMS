import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateProfessionalIdCard = async (student) => {
  // CR80 Standard ID Card dimensions: 85.6mm x 54mm (Landscape)
  const width = 85.6;
  const height = 54;

  // Create PDF with two pages (front and back)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height]
  });

  // Colors
  const primaryBlue = [37, 99, 235];
  const darkBlue = [30, 64, 175];
  const white = [255, 255, 255];
  const lightGray = [248, 250, 252];
  const darkText = [30, 41, 59];
  const grayText = [100, 116, 139];
  const borderColor = [200, 200, 200];
  const successGreen = [22, 163, 74];

  // ===== FRONT SIDE =====
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, width, 12, "F"); // Header

  // Logo text
  doc.setTextColor(...white);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("HMITLC", 5, 4);

  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("Hasrat Mohani IT Literacy Centre", 5, 8);

  // Status badge
  doc.setFillColor(...successGreen);
  doc.roundedRect(width - 15, 2, 12, 4, 1, 1, "F");
  doc.setTextColor(...white);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED", width - 9, 4.5, { align: "center" });

  // Photo section
  const photoSize = 18;
  const photoX = 5;
  const photoY = 15;

  // Photo background
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(photoX, photoY, photoSize, photoSize, 2, 2, "F");

  if (student.profilePicture && student.profilePicture.startsWith("data:image")) {
    try {
      doc.addImage(student.profilePicture, "JPEG", photoX, photoY, photoSize, photoSize);
      doc.setDrawColor(...primaryBlue);
      doc.setLineWidth(0.3);
      doc.roundedRect(photoX, photoY, photoSize, photoSize, 2, 2, "S");
    } catch (e) {
      doc.setFillColor(...lightGray);
      doc.roundedRect(photoX, photoY, photoSize, photoSize, 2, 2, "F");
    }
  }

  // Photo placeholder text
  doc.setTextColor(...grayText);
  doc.setFontSize(4);
  doc.text("PHOTO", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });

  // Student Name
  doc.setTextColor(...darkText);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const name = student.fullName || "Student Name";
  const displayName = name.length > 22 ? name.substring(0, 20) + "..." : name;
  doc.text(displayName, photoX + photoSize + 3, photoY + 4);

  // Student ID
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text(`ID: ${student.studentId || "N/A"}`, photoX + photoSize + 3, photoY + 9);

  // Course
  doc.setTextColor(...grayText);
  doc.setFontSize(4.5);
  doc.setFont("helvetica", "normal");
  const course = (student.courseName || "General").substring(0, 25);
  doc.text(course, photoX + photoSize + 3, photoY + 14);

  // Batch
  if (student.batchName) {
    doc.setFillColor(...primaryBlue);
    doc.roundedRect(photoX + photoSize + 3, photoY + 17, 18, 5, 1, 1, "F");
    doc.setTextColor(...white);
    doc.setFontSize(4);
    doc.setFont("helvetica", "bold");
    doc.text(student.batchName, photoX + photoSize + 12, photoY + 20, { align: "center" });
  }

  // Bottom section
  doc.setFillColor(250, 251, 252);
  doc.rect(0, height - 8, width, 8, "F");

  doc.setTextColor(...darkText);
  doc.setFontSize(4);
  doc.setFont("helvetica", "normal");
  doc.text("STUDENT IDENTITY CARD", width / 2, height - 4, { align: "center" });

  // Bottom blue line
  doc.setFillColor(...primaryBlue);
  doc.rect(0, height - 2, width, 2, "F");

  // ===== BACK SIDE =====
  doc.addPage([width, height], "landscape");

  // Background
  doc.setFillColor(...white);
  doc.rect(0, 0, width, height, "F");

  // Left panel - Info
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, width * 0.55, height, "F");

  // Header on back
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, width, 8, "F");

  doc.setTextColor(...white);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("HMITLC • Hasrat Mohani IT Literacy Centre 🎓", width / 2, 5, { align: "center" });

  // Student details
  const infoStartY = 12;
  const labelCol = 3;
  const valueCol = 22;

  doc.setFontSize(4);
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");

  const details = [
    { label: "Student Name:", value: (student.fullName || "N/A").substring(0, 25) },
    { label: "Father Name:", value: (student.fatherName || "N/A").substring(0, 25) },
    { label: "CNIC:", value: student.cnic || "N/A" },
    { label: "Course:", value: (student.courseName || "General").substring(0, 20) },
    { label: "Batch:", value: student.batchName || "N/A" },
    { label: "Timing:", value: (student.classTiming || "N/A").substring(0, 20) },
    { label: "Days:", value: (student.classDays?.join(", ") || "N/A").substring(0, 20) }
  ];

  let currentY = infoStartY;
  details.forEach((detail, index) => {
    doc.setTextColor(...grayText);
    doc.text(detail.label, labelCol, currentY);
    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "bold");
    doc.text(detail.value, valueCol, currentY);
    currentY += 5;
  });

  // QR Code section
  const qrX = width * 0.58;
  const qrY = 10;
  const qrSize = 22;

  // Generate QR code
  const qrData = JSON.stringify({
    id: student.studentId,
    name: student.fullName,
    course: student.courseName,
    cnic: student.cnic,
    batch: student.batchName
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: qrSize * 4,
      margin: 0,
      color: { dark: "#000000", light: "#FFFFFF" }
    });
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch (e) {
    doc.setFillColor(...lightGray);
    doc.rect(qrX, qrY, qrSize, qrSize, "F");
    doc.setTextColor(...grayText);
    doc.setFontSize(4);
    doc.text("QR Code", qrX + qrSize/2, qrY + qrSize/2, { align: "center" });
  }

  // QR Label
  doc.setTextColor(...darkText);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("Scan for Verification", qrX + qrSize/2, qrY + qrSize + 3, { align: "center" });

  // Important instructions
  doc.setFillColor(254, 252, 232);
  doc.rect(0, height - 16, width, 16, "F");

  doc.setTextColor(180, 120, 30);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("IMPORTANT INSTRUCTIONS", width / 2, height - 13, { align: "center" });

  doc.setTextColor(...darkText);
  doc.setFontSize(3);
  doc.setFont("helvetica", "normal");
  const instructions = [
    "• Please colour print of this Admit/ID card",
    "• Attestation is mandatory from HMITLC",
    "• Bring CNIC/B-Form & Last qualification marksheet (both original) at attestation"
  ];
  let instY = height - 10;
  instructions.forEach(line => {
    doc.text(line, 3, instY);
    instY += 3.5;
  });

  // Bottom disclaimer
  doc.setFillColor(...primaryBlue);
  doc.rect(0, height - 2, width, 2, "F");

  doc.setTextColor(...darkText);
  doc.setFontSize(3);
  doc.text("This card is for HMITLC premises only. If found, please return to HMITLC.", width / 2, height - 0.5, { align: "center" });

  // Save PDF
  const fileName = `HMITC_ID_Card_${student.studentId || "student"}.pdf`;
  doc.save(fileName);
};

export default generateProfessionalIdCard;