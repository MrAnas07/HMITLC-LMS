import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export const generateSinglePageIdCard = async (student) => {
  // Create a hidden container for rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "400px";
  document.body.appendChild(container);

  // Generate QR Code
  const qrData = JSON.stringify({
    id: student.studentId,
    name: student.fullName,
    course: student.courseName,
    cnic: student.cnic,
    batch: student.batchName
  });

  let qrCodeImage = "";
  try {
    qrCodeImage = await QRCode.toDataURL(qrData, {
      width: 120,
      margin: 1,
      color: { dark: "#1e3a8a", light: "#ffffff" }
    });
  } catch (e) {
    qrCodeImage = "";
  }

  // HTML structure for the ID card
  container.innerHTML = `
    <div id="id-card-preview" style="
      width: 400px;
      height: 640px;
      background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
      position: relative;
      overflow: hidden;
    ">
      <!-- Decorative pattern -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
        pointer-events: none;
      "></div>

      <!-- Header -->
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid rgba(255,255,255,0.2);
      ">
        <div>
          <div style="color: #fff; font-size: 22px; font-weight: bold; letter-spacing: 2px;">HMITLC</div>
          <div style="color: rgba(255,255,255,0.8); font-size: 9px; font-weight: 500;">Hasrat Mohani IT Literacy Centre</div>
        </div>
        <div style="
          background: #22c55e;
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 12px;
          letter-spacing: 1px;
        ">APPROVED</div>
      </div>

      <!-- Photo Section -->
      <div style="padding: 20px; display: flex; justify-content: center;">
        <div style="
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.95);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          border: 4px solid #fff;
          overflow: hidden;
        ">
          ${
            student.profilePicture && student.profilePicture.startsWith("data:image")
              ? `<img src="${student.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<div style="color: #64748b; font-size: 12px; text-align: center;">PHOTO</div>`
          }
        </div>
      </div>

      <!-- Student Info -->
      <div style="text-align: center; padding: 0 20px;">
        <div style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">
          ${(student.fullName || "Student Name").substring(0, 25)}
        </div>
        <div style="color: #fbbf24; font-size: 14px; font-weight: bold; margin-bottom: 8px;">
          ID: ${student.studentId || "N/A"}
        </div>
        <div style="
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 12px;
          padding: 6px 16px;
          border-radius: 20px;
          display: inline-block;
        ">
          ${(student.courseName || "General").substring(0, 25)}
        </div>
        ${
          student.batchName
            ? `<div style="
                margin-top: 8px;
                background: #f59e0b;
                color: #000;
                font-size: 11px;
                font-weight: bold;
                padding: 4px 14px;
                border-radius: 12px;
                display: inline-block;
              ">Batch: ${student.batchName}</div>`
            : ""
        }
      </div>

      <!-- Divider -->
      <div style="margin: 20px; height: 1px; background: rgba(255,255,255,0.3);"></div>

      <!-- Details Section -->
      <div style="padding: 0 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="background: rgba(255,255,255,0.95); padding: 10px 12px; border-radius: 8px;">
          <div style="color: #64748b; font-size: 9px; font-weight: 600; margin-bottom: 2px;">FATHER'S NAME</div>
          <div style="color: #1e293b; font-size: 11px; font-weight: bold;">${(student.fatherName || "N/A").substring(0, 20)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.95); padding: 10px 12px; border-radius: 8px;">
          <div style="color: #64748b; font-size: 9px; font-weight: 600; margin-bottom: 2px;">CNIC / B-FORM</div>
          <div style="color: #1e293b; font-size: 11px; font-weight: bold; font-family: monospace;">${student.cnic || "N/A"}</div>
        </div>
        <div style="background: rgba(255,255,255,0.95); padding: 10px 12px; border-radius: 8px;">
          <div style="color: #64748b; font-size: 9px; font-weight: 600; margin-bottom: 2px;">CLASS TIMING</div>
          <div style="color: #1e293b; font-size: 11px; font-weight: bold;">${(student.classTiming || "N/A").substring(0, 15)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.95); padding: 10px 12px; border-radius: 8px;">
          <div style="color: #64748b; font-size: 9px; font-weight: 600; margin-bottom: 2px;">CLASS DAYS</div>
          <div style="color: #1e293b; font-size: 11px; font-weight: bold;">${(student.classDays?.join(", ") || "N/A").substring(0, 15)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.95); padding: 10px 12px; border-radius: 8px; grid-column: span 2;">
          <div style="color: #64748b; font-size: 9px; font-weight: 600; margin-bottom: 2px;">ADMISSION STATUS</div>
          <div style="color: #22c55e; font-size: 12px; font-weight: bold;">✓ Approved</div>
        </div>
      </div>

      <!-- QR Code Section -->
      <div style="padding: 20px; display: flex; justify-content: center;">
        <div style="
          background: #fff;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        ">
          <img src="${qrCodeImage}" style="width: 100px; height: 100px; display: block;" />
        </div>
      </div>
      <div style="text-align: center; color: rgba(255,255,255,0.9); font-size: 10px; font-weight: 600; margin-top: -10px;">
        Scan for Verification
      </div>

      <!-- Bottom Instructions -->
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fef3c7;
        padding: 14px 18px;
      ">
        <div style="color: #92400e; font-size: 10px; font-weight: bold; margin-bottom: 6px; text-align: center;">
          IMPORTANT INSTRUCTIONS
        </div>
        <div style="color: #451a03; font-size: 8px; line-height: 1.5; text-align: center;">
          • Please colour print of this Admit/ID card<br/>
          • Attestation of ID/Admit Card is extremely mandatory from HMITLC<br/>
          • Bring CNIC/B-Form and Last qualification Marksheet (both original) at Attestation
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 24px;
        background: #1e3a8a;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="color: rgba(255,255,255,0.9); font-size: 8px; text-align: center;">
          This card is for HMITLC premises only. If found, please return to HMITLC.
        </div>
      </div>
    </div>
  `;

  const idCardElement = container.querySelector("#id-card-preview");

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(idCardElement, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: null
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [86, 54] // Standard vertical ID card size (landscape for print, but we render portrait)
    });

    // Add image to PDF - fit to page
    pdf.addImage(imgData, "PNG", 0, 0, 86, 54);

    // Save PDF
    const fileName = `HMITLC_ID_Card_${student.studentId || "student"}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

export default generateSinglePageIdCard;