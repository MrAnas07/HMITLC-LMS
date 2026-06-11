// ============================================
// HMITLC LMS - Optimized ID Card Generator
// Professional dual-sided PDF ID card with proper image handling
// ============================================

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { createPlaceholderAvatar } from './imageLoader';
import { ID_CARD } from '../constants';

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (src.startsWith("data:")) { resolve(src); return; }
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
};

/**
 * Generate professional HMITLC Student ID Card PDF
 * @param {Object} student - Student data object
 * @param {string} student.fullName - Student full name
 * @param {string} student.fatherName - Father's name
 * @param {string} student.cnic - CNIC number
 * @param {string} student.studentId - Student ID
 * @param {string} student.courseName - Course name
 * @param {string} student.batchName - Batch name
 * @param {string} student.profilePicture - Profile image URL or base64
 * @returns {Promise<void>} - PDF download
 */
export const generateHMITLCIdCard = async (student) => {
  // Extract batch number
  const batchNum = (student.batchName || '1').replace(/[^0-9]/g, '') || '1';
  const studentId = (student.studentId || '').replace(/^HMITC-/, 'HMITLC-');

  let profileImageData = null;
  if (student.profilePicture) {
    try {
      profileImageData = await preloadImage(student.profilePicture);
    } catch (e) {
      console.error("Image load failed:", e);
    }
  }

  // Generate QR Code - Full verification URL
  const baseUrl = window.location.origin;
  const qrData = `${baseUrl}/verify/${studentId}`;

  let qrCodeImage = '';
  try {
    qrCodeImage = await QRCode.toDataURL(qrData, {
      width: ID_CARD.QR.SIZE,
      margin: ID_CARD.QR.MARGIN,
      color: {
        dark: ID_CARD.QR.DARK_COLOR,
        light: ID_CARD.QR.LIGHT_COLOR,
      },
    });
  } catch (e) {
    console.error('QR Code generation failed:', e);
    qrCodeImage = '';
  }

  // Get initials for placeholder
  const initials = student.fullName
    ? student.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2)
    : '';

  // Profile photo HTML
  const profilePhotoHTML = profileImageData
    ? `<img src="${profileImageData}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`
    : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
         <div style="width: 26px; height: 26px; background: #8a9fc0; border-radius: 50%; margin-bottom: 2px;"></div>
         <div style="width: 36px; height: 22px; background: #8a9fc0; border-radius: 10px 10px 7px 7px;"></div>
       </div>`;

  // Text truncation helper
  const truncate = (text, maxLen) => {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
  };

  // Create hidden container
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 550px;
    height: 364px;
    display: flex;
    gap: 16px;
    background: #e8ecf0;
    padding: 12px;
    border-radius: 12px;
    box-sizing: border-box;
    font-family: 'Segoe UI', Arial, sans-serif;
  `;
  document.body.appendChild(container);

  // Build HTML - both cards
  container.innerHTML = renderFrontCard({ ...student, studentId }, batchNum, profilePhotoHTML) +
    renderBackCard(student, qrCodeImage, truncate);

  try {
    // Capture with html2canvas - HD quality
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#e8ecf0',
      allowTaint: true,
    });

    // Create PDF - landscape
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [ID_CARD.DIMENSIONS.PDF_WIDTH, ID_CARD.DIMENSIONS.PDF_HEIGHT],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, ID_CARD.DIMENSIONS.PDF_WIDTH, ID_CARD.DIMENSIONS.PDF_HEIGHT);

    // Download
    const fileName = `HMITLC_ID_${studentId || 'student'}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('ID Card generation error:', error);
    throw error;
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
};

/**
 * Render Front Card HTML
 */
const renderFrontCard = (student, batchNum, profilePhotoHTML) => `
  <div style="
    width: 280px;
    height: 340px;
    background: #f4f7fc;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  ">
    <!-- Header -->
    <div style="
      height: 135px;
      background: linear-gradient(180deg, ${ID_CARD.COLORS.PRIMARY_BLUE} 0%, ${ID_CARD.COLORS.DARK_BLUE} 100%);
      position: relative;
      background-image: repeating-linear-gradient(-52deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.05) 9px);
    ">
      <!-- Watermark -->
      <div style="
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 48px;
        font-weight: 900;
        color: ${ID_CARD.COLORS.PRIMARY_BLUE};
        opacity: 0.06;
        letter-spacing: 6px;
        z-index: 1;
        white-space: nowrap;
      ">HMITLC</div>

      <!-- Logo -->
      <div style="padding: 10px 12px 4px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2;">
      <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 1px;">
        <span style="color: ${ID_CARD.COLORS.PRIMARY_BLUE}; font-size: 12px;">🎓</span>
        <span style="color: ${ID_CARD.COLORS.PRIMARY_BLUE}; font-size: 20px; font-weight: 900; letter-spacing: 3px;">HMITLC</span>
      </div>
      <div style="color: #4060a0; font-size: 6.5px; margin-bottom: 4px;">Hasrat Mohani IT Literacy Centre</div>
      <div style="display: flex; align-items: center; gap: 5px; width: 88%;">
        <div style="flex: 1; height: 1px; background: #c8d4e8;"></div>
        <div style="width: 4px; height: 4px; border-radius: 50%; background: ${ID_CARD.COLORS.PRIMARY_BLUE};"></div>
        <div style="flex: 1; height: 1px; background: #c8d4e8;"></div>
      </div>
    </div>
    

      <!-- Photo -->
      <div style="position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%); z-index: 10;">
        <div style="width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, ${ID_CARD.COLORS.PRIMARY_BLUE}, #3070e8); padding: 3px;">
          <div style="width: 100%; height: 100%; border-radius: 50%; border: 3px solid #ffffff; overflow: hidden; background: #c8d4e8; display: flex; align-items: center; justify-content: center;">
            ${profilePhotoHTML}
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; padding: 38px 10px 8px; background: #f4f7fc; position: relative; background-image: repeating-linear-gradient(-52deg, transparent, transparent 9px, rgba(200,215,245,0.25) 9px, rgba(200,215,245,0.26) 10px);">
      <div style="font-size: 13px; font-weight: 900; color: #0d1b40; text-align: center; letter-spacing: 0.3px; text-transform: uppercase; padding: 0 6px; max-width: 260px; line-height: 1.2; margin-top: 4px;">
        ${student.fullName || 'Student Name'}
      </div>
      <div style="font-size: 7.5px; font-weight: 500; color: ${ID_CARD.COLORS.PRIMARY_BLUE}; text-align: center; margin-top: 3px; max-width: 250px;">
        ${student.courseName || 'General'}
      </div>
      <div style="width: 5px; height: 5px; border-radius: 50%; background: ${ID_CARD.COLORS.PRIMARY_BLUE}; margin: 6px auto;"></div>
      <div style="background: ${ID_CARD.COLORS.PRIMARY_BLUE}; color: #ffffff; font-size: 10px; font-weight: 700; padding: 2px 18px 12px 18px; border-radius: 16px; letter-spacing: 1.2px; text-align: center; line-height: 1.3; margin-bottom: 12px;">
        ${student.studentId || 'N/A'}
      </div>
      <div style="font-size: 7.5px; font-weight: 700; color: #0d1b40; letter-spacing: 1.5px; margin-top: 5px;">
        HMITLC • BATCH ${batchNum}
      </div>
      <div style="display: flex; align-items: center; gap: 4px; width: 85%; margin-top: 8px;">
        <div style="flex: 1; height: 1px; background: #b0bcd8;"></div>
        <span style="font-size: 5px; font-weight: 700; color: #6070a0; letter-spacing: 1.5px; white-space: nowrap;">STUDENT IDENTITY CARD</span>
        <div style="flex: 1; height: 1px; background: #b0bcd8;"></div>
      </div>
    </div>

      <!-- Footer -->
    <div style="height: 32px; background: ${ID_CARD.COLORS.PRIMARY_BLUE}; display: flex; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0; border-top: 1px solid rgba(255,255,255,0.15);">
       <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Graduation Cap -->
        <polygon points="60,18 95,34 60,50 25,34" fill="rgba(255,255,255,0.92)"/>
        <path d="M85 40 L85 62 Q60 72 35 62 L35 40" fill="rgba(255,255,255,0.75)"/>
        <!-- Tassel -->
        <line x1="95" y1="34" x2="95" y2="52" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
        <circle cx="95" cy="54" r="2.5" fill="rgba(255,255,255,0.8)"/>
        <line x1="95" y1="56" x2="93" y2="64" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <line x1="95" y1="56" x2="95" y2="65" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <line x1="95" y1="56" x2="97" y2="64" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <!-- Keyboard body -->
        <rect x="18" y="78" width="72" height="28" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
        <!-- Keyboard keys row 1 -->
        <rect x="22" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="29" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="36" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="43" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="50" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="57" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="64" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="71" y="82" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <!-- Keyboard keys row 2 -->
        <rect x="22" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="29" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="36" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="43" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="50" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="57" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="64" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="71" y="88" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)"/>
        <!-- Spacebar -->
        <rect x="30" y="94" width="48" height="4" rx="1.5" fill="rgba(255,255,255,0.7)"/>
        <!-- Mouse -->
        <rect x="96" y="76" width="16" height="22" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
        <line x1="104" y1="76" x2="104" y2="88" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>
        <circle cx="104" cy="82" r="2" fill="rgba(255,255,255,0.5)"/>
        <!-- Mouse wire to keyboard -->
        <path d="M96 86 Q90 80 83 78" stroke="rgba(255,255,255,0.5)" stroke-width="1" fill="none" stroke-linecap="round"/>
      </svg>
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1px;">
        <span style="color: #ffffff; font-size: 7.5px; font-weight: 800; letter-spacing: 2px; line-height: 1;">HMITLC</span>
        <span style="color: rgba(255,255,255,0.7); font-size: 5.5px; font-weight: 400; letter-spacing: 0.5px; line-height: 1;">Hasrat Mohani IT Literacy Centre</span>
      </div>
    </div>
  </div>
`;

/**
 * Render Back Card HTML
 */
const renderBackCard = (student, qrCodeImage, truncate) => `
  <div style="
    width: 280px;
    height: 340px;
    background: #f4f7fc;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  ">
    

    <!-- Header -->
    <div style="padding: 10px 12px 4px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2;">
      <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 1px;">
        <span style="color: ${ID_CARD.COLORS.PRIMARY_BLUE}; font-size: 12px;">🎓</span>
        <span style="color: ${ID_CARD.COLORS.PRIMARY_BLUE}; font-size: 20px; font-weight: 900; letter-spacing: 3px;">HMITLC</span>
      </div>
      <div style="color: #4060a0; font-size: 6.5px; margin-bottom: 4px;">Hasrat Mohani IT Literacy Centre</div>
      <div style="display: flex; align-items: center; gap: 5px; width: 88%;">
        <div style="flex: 1; height: 1px; background: #c8d4e8;"></div>
        <div style="width: 4px; height: 4px; border-radius: 50%; background: ${ID_CARD.COLORS.PRIMARY_BLUE};"></div>
        <div style="flex: 1; height: 1px; background: #c8d4e8;"></div>
      </div>
    </div>

    <!-- Info Rows -->
    <div style="padding: 2px 10px 0; display: flex; flex-direction: column; z-index: 2;">
      ${renderInfoRow('STUDENT NAME', truncate(student.fullName, 20), 'person')}
      ${renderInfoRow("FATHER'S NAME", truncate(student.fatherName, 18), 'group')}
      ${renderInfoRow('CNIC / B-FORM', student.cnic || 'N/A', 'idcard')}
      ${renderInfoRow('COURSE / BATCH', `${truncate(student.courseName, 16)} • ${student.batchName || 'BATCH 1'}`, 'book')}
    </div>

    <!-- QR Code -->
    <div style="display: flex; justify-content: center; padding: 6px 10px 0; z-index: 2;">
      <div style="width: 88px; height: 88px; border: 2px solid ${ID_CARD.COLORS.PRIMARY_BLUE}; border-radius: 8px; padding: 4px; background: #ffffff;">
        <img src="${qrCodeImage}" style="width: 80px; height: 80px; display: block;" alt="QR Code" />
      </div>
    </div>
    <div style="text-align: center; color: ${ID_CARD.COLORS.PRIMARY_BLUE}; font-size: 6px; font-weight: 600; margin-top: 2px; z-index: 2;">Scan for Attendance</div>

    <!-- Footer -->
    <div style="margin-top: auto; width: 100%; background: ${ID_CARD.COLORS.PRIMARY_BLUE}; padding: 5px 8px 4px; display: flex; flex-direction: column; align-items: center; gap: 1px; z-index: 2; flex-shrink: 0;">
      <div style="font-size: 5.5px; font-weight: 500; color: #ffffff; text-align: center; line-height: 1.4;">
         Hasrat Mohani IT Literacy Centre<br/>
          www.hmitlc.edu.pk | +92 42 111 000 128
      </div>
      <div style="font-size: 5px; color: rgba(255,255,255,0.8);">★</div>
    </div>
  </div>
`;

/**
 * Render info row helper
 */
const renderInfoRow = (label, value, iconType) => {
  const icons = {
    person: '<path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/>',
    group: '<path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
    idcard: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>',
    book: '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z"/>',
  };

  return `
    <div style="display: flex; align-items: center; gap: 7px; padding: 4px 0; border-bottom: 1px dashed #cdd8ee;">
      <div style="width: 22px; height: 22px; border-radius: 50%; background: ${ID_CARD.COLORS.PRIMARY_BLUE}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">${icons[iconType]}</svg>
      </div>
      <div>
        <div style="font-size: 5.5px; font-weight: 500; color: #6070a0; margin-bottom: 1px;">${label}</div>
        <div style="font-size: 9px; font-weight: 700; color: ${ID_CARD.COLORS.PRIMARY_BLUE}; letter-spacing: 0.3px; text-transform: uppercase;">${value}</div>
      </div>
    </div>
  `;
};

export default generateHMITLCIdCard;
