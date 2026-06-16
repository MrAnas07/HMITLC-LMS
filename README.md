# HMITLC — Hasrat Mohani IT Literacy Centre

<div align="center">

![Banner](https://img.shields.io/badge/HMITLC-LMS-0052CC?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

A full-stack Learning Management System built for IT education institutions — featuring admissions, QR attendance, quizzes, ID cards, WhatsApp notifications, and multi-teacher management.

**Live Frontend** · **Live API**

</div>

---

## Overview

HMITLC is a production-grade MERN stack platform designed to digitize the complete student lifecycle — from admission to graduation. It serves students, teachers, and administrators with role-based access, real-time attendance tracking via QR codes, a fullscreen exam engine with anti-cheating measures, and automated WhatsApp + email notifications.

---

## Key Features

### Admission & Enrollment
- Multi-step admission form with real-time field validation
- One-student-one-course policy — blocks duplicate active enrollments
- Status workflow: Pending → Approved / Rejected / Graduated
- Auto-seeded Master Admin account for secure initial access

### QR Attendance System
- Camera-based QR scanner for teachers
- Course-specific and batch-specific attendance tracking
- Today vs past-date report logic with auto-absent calculation
- Attendance percentage with animated progress bars

### Quiz & Examination
- Teacher-created quizzes with secret key verification
- Auto-fetched student batch from admission record
- Fullscreen lockdown exam with tab-change and fullscreen-exit detection
- 3-strike cheating counter with auto-submit
- Server-side question shuffling (Fisher-Yates)
- Quiz management: create, edit, delete, toggle active/inactive
- Student results with grade letters (A+ → F), performance analytics

### ID Card Generator
- Dual-sided professional PDF ID cards
- Student photo with circular crop modal
- QR code linking to live verification URL
- jsPDF + html2canvas + QRCode generation

### Notifications
- WhatsApp messages with V-Card contact card
- MailerLite email integration (submission, approval, rejection, graduation)
- Graduation message with feedback form link

### Multi-Teacher Management
- Role-based token signup system (HMITLC-TCH-XXXX)
- Row-level security — teachers manage only their assigned courses
- Teacher profile with qualification, course, and batch assignment

### Admin Controls
- Full dashboard with admissions, users, attendance, quizzes, and courses tabs
- Promote/demote users with animated confirmation modals
- Factory reset (hidden button) with secret key — wipes all data except admin
- Master Admin auto-seeder for production security

### Student Dashboard
- Admission status with animated graduation banner
- Attendance view with course-specific filtering
- Quiz results with summary cards, performance bar, and grade table

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router 6, Tailwind CSS, Framer Motion |
| Backend | Node.js 20, Express 4, Mongoose 8 |
| Database | MongoDB 7 (Atlas) |
| Auth | JWT, bcryptjs |
| PDF | jsPDF, html2canvas, QRCode.js |
| Notifications | WhatsApp (Baileys), MailerLite API |
| Deployment | Vercel (Frontend + Backend), Hugging Face Spaces |
| CI/CD | GitHub Actions → auto-deploy |

---

## Project Structure

```
HMITLC-LMS/
├── backend/
│   ├── api/index.js            # Vercel serverless handler
│   ├── vercel.json             # Vercel routing config
│   ├── Dockerfile              # Hugging Face Spaces
│   ├── clear-data.js           # Pre-deploy data wipe
│   └── src/
│       ├── app.js              # Express app setup
│       ├── server.js           # Local dev entry point
│       ├── config/database.js  # MongoDB connection + admin seeder
│       ├── controllers/        # Route handlers
│       ├── middleware/         # Auth, CORS, error handling
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API routes
│       └── utils/              # WhatsApp, MailerLite, helpers
│
├── frontend/
│   └── src/
│       ├── api/client.js       # Axios instance with fallback URL
│       ├── components/         # Layout, ProtectedRoute, Toast
│       ├── context/AuthContext  # Auth state management
│       ├── pages/              # 16+ page components
│       ├── styles.css          # Neon buttons, gradient slides
│       ├── App.jsx             # Routes
│       └── main.jsx            # Entry point
│
├── .github/workflows/deploy.yml
├── .gitignore
└── README.md
```

---

## Security

- JWT authentication with 30-day token expiration
- Password hashing with bcryptjs
- CORS restricted to production + localhost origins
- Helmet.js security headers
- Express mongo-sanitize and XSS protection
- Input validation on all endpoints
- Rate limiting (250 req/15 min)
- Factory reset requires admin JWT + system secret key
- Master Admin auto-seeded on first DB connection

---

## Deployment

| Service | Purpose | Status |
|---------|---------|--------|
| Vercel | Frontend + Backend API | Active |
| Hugging Face Spaces | WhatsApp Bot (server) | Active |
| MongoDB Atlas | Database | Active |
| GitHub Actions | Auto-deploy backend | Active |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for Hasrat Mohani IT Literacy Centre**

</div>
