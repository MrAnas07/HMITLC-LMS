import { jsPDF } from "jspdf";

export const generateVerticalIdCard = (student) => {
  // Create vertical ID card (54mm x 86mm - standard ID card size)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [54, 86]
  });

  // Colors
  const primaryBlue = [37, 99, 235];
  const darkBlue = [30, 64, 175];
  const white = [255, 255, 255];
  const lightGray = [248, 250, 252];
  const darkText = [30, 41, 59];
  const grayText = [100, 116, 139];
  const borderGray = [200, 200, 200];

  // Card border
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.2);
  doc.rect(0, 0, 54, 86);

  // Blue header
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, 54, 16, "F");

  // Logo and institute name
  doc.setTextColor(...white);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("HMITLC", 27, 5);

  doc.setFontSize(4.5);
  doc.setFont("helvetica", "normal");
  doc.text("Hasrat Mohani IT Literacy Centre", 27, 9);

  // Status badge
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(38, 2, 14, 5, 1, 1, "F");
  doc.setTextColor(...white);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED", 45, 5.5, { align: "center" });

  // Student photo placeholder/actual photo
  const photoSize = 18;
  const photoX = (54 - photoSize) / 2;
  const photoY = 20;

  if (student.profilePicture && student.profilePicture.startsWith("data:image")) {
    try {
      doc.addImage(student.profilePicture, "JPEG", photoX, photoY, photoSize, photoSize);
      // Add border around photo
      doc.setDrawColor(...primaryBlue);
      doc.setLineWidth(0.3);
      doc.rect(photoX, photoY, photoSize, photoSize);
    } catch (e) {
      // Fallback to placeholder if image fails
      doc.setFillColor(...lightGray);
      doc.rect(photoX, photoY, photoSize, photoSize, "F");
      doc.setFontSize(6);
      doc.setTextColor(...grayText);
      doc.text("PHOTO", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
    }
  } else {
    doc.setFillColor(...lightGray);
    doc.rect(photoX, photoY, photoSize, photoSize, "F");
    doc.setFontSize(6);
    doc.setTextColor(...grayText);
    doc.text("PHOTO", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
  }

  // Student Name
  doc.setTextColor(...darkText);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  const name = student.fullName || "Student Name";
  const truncatedName = name.length > 18 ? name.substring(0, 16) + ".." : name;
  doc.text(truncatedName, 27, 42, { align: "center" });

  // Student ID
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text(student.studentId || "N/A", 27, 46, { align: "center" });

  // Divider
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.15);
  doc.line(4, 48, 50, 48);

  // Details section
  const detailY = 51;
  const labelCol1 = 3;
  const valueCol1 = 20;
  const labelCol2 = 28;
  const valueCol2 = 51;

  doc.setFontSize(4);
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");

  // Father Name
  doc.text("Father:", labelCol1, detailY);
  doc.setTextColor(...darkText);
  const father = (student.fatherName || "N/A").substring(0, 12);
  doc.text(father, valueCol1, detailY);

  // Batch
  doc.setTextColor(...grayText);
  doc.text("Batch:", labelCol2, detailY);
  doc.setTextColor(...darkText);
  doc.text((student.batchName || "N/A").substring(0, 12), valueCol2, detailY);

  // CNIC
  doc.setTextColor(...grayText);
  doc.text("CNIC:", labelCol1, detailY + 4);
  doc.setTextColor(...darkText);
  doc.text((student.cnic || "N/A").substring(0, 14), valueCol1, detailY + 4);

  // Course
  doc.setTextColor(...grayText);
  doc.text("Course:", labelCol2, detailY + 4);
  doc.setTextColor(...darkText);
  const course = (student.courseName || "General").substring(0, 12);
  doc.text(course, valueCol2, detailY + 4);

  // Class Timing
  doc.setTextColor(...grayText);
  doc.text("Timing:", labelCol1, detailY + 8);
  doc.setTextColor(...darkText);
  doc.setFontSize(3.5);
  const timing = (student.classTiming || "N/A").substring(0, 16);
  doc.text(timing, valueCol1, detailY + 8);

  // Class Days
  doc.setTextColor(...grayText);
  doc.text("Days:", labelCol2, detailY + 8);
  doc.setTextColor(...darkText);
  doc.setFontSize(3.5);
  const days = (student.classDays?.join(", ") || "N/A").substring(0, 14);
  doc.text(days, valueCol2, detailY + 8);

  // Footer instructions
  doc.setFillColor(254, 252, 232);
  doc.rect(0, 62, 54, 24, "F");

  doc.setTextColor(139, 92, 46);
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "bold");
  doc.text("IMPORTANT INSTRUCTIONS", 27, 65, { align: "center" });

  doc.setTextColor(...darkText);
  doc.setFontSize(2.8);
  doc.setFont("helvetica", "normal");

  const instructions = [
    "Please colour print of this Admit/ID card",
    "Attestation is mandatory from HMITLC",
    "Bring CNIC & Last qualification",
    "marksheet (both original) at attestation"
  ];

  let instY = 69;
  instructions.forEach((line) => {
    doc.text(line, 27, instY, { align: "center" });
    instY += 4;
  });

  // Bottom border
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 84, 54, 2, "F");

  // Save PDF
  const fileName = `HMITC_ID_${student.studentId || "student"}.pdf`;
  doc.save(fileName);
};

export default generateVerticalIdCard;