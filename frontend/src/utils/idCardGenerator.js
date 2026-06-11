import { jsPDF } from "jspdf";

export const generateStudentIdCard = (admission) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [86, 54] // Standard ID card size (3.375" x 2.125")
  });

  // Colors
  const primaryBlue = [37, 99, 235]; // academy-blue
  const darkBlue = [30, 64, 175];
  const white = [255, 255, 255];
  const lightGray = [248, 250, 252];
  const darkText = [30, 41, 59];
  const grayText = [100, 116, 139];

  // Header background
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, 86, 18, "F");

  // Header text
  doc.setTextColor(...white);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("HMITC", 4, 6);

  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("Hasrat Mohani IT Literacy Centre", 4, 10);

  doc.setFontSize(4);
  doc.text("Student Identity Card", 4, 14);

  // Status badge
  doc.setFillColor(22, 163, 74); // green
  doc.roundedRect(65, 4, 18, 6, 1, 1, "F");
  doc.setTextColor(...white);
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED", 74, 7.5, { align: "center" });

  // Student photo placeholder
  doc.setFillColor(...lightGray);
  doc.roundedRect(4, 22, 20, 24, 2, 2, "F");
  doc.setFillColor(...grayText);
  doc.setFontSize(6);
  doc.text("PHOTO", 14, 34, { align: "center" });

  // Student name
  doc.setTextColor(...darkText);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const name = admission.fullName || "Student Name";
  doc.text(name.substring(0, 18), 26, 28);

  // Student ID
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(6);
  doc.text(admission.studentId || "N/A", 26, 33);

  // Course
  doc.setTextColor(...grayText);
  doc.setFontSize(5);
  doc.text("Course:", 26, 38);
  doc.setTextColor(...darkText);
  doc.text((admission.selectedCourse?.title || "General").substring(0, 20), 36, 38);

  // Batch
  doc.setTextColor(...grayText);
  doc.text("Batch:", 26, 42);
  doc.setTextColor(...darkText);
  doc.text(admission.batchName || "N/A", 36, 42);

  // CNIC
  doc.setTextColor(...grayText);
  doc.text("CNIC:", 26, 46);
  doc.setTextColor(...darkText);
  doc.text(admission.cnic || "N/A", 36, 46);

  // Divider line
  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(0.3);
  doc.line(4, 48, 82, 48);

  // Schedule section
  doc.setTextColor(...grayText);
  doc.setFontSize(4.5);
  doc.text("CLASS TIMING", 4, 52);
  doc.text("CLASS DAYS", 44, 52);

  doc.setTextColor(...darkText);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text(admission.classTiming || "N/A", 4, 56);
  doc.text(admission.classDays?.join(", ") || "N/A", 44, 56);

  // Footer
  doc.setFillColor(...lightGray);
  doc.rect(0, 48, 86, 6, "F");
  doc.setTextColor(...grayText);
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "normal");
  doc.text("Valid for HMITC Premises Only", 43, 52, { align: "center" });

  // Save PDF
  const fileName = `HMITC_ID_${admission.studentId || "student"}.pdf`;
  doc.save(fileName);
};

export default generateStudentIdCard;