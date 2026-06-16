# HMITLC — Hasrat Mohani IT Literacy Centre

<div align="center">

![HMITC Banner](https://img.shields.io/badge/HMITC-Management%20System-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-47a248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A full-stack MERN Learning Management System for IT education — featuring QR attendance, fullscreen exam engine, WhatsApp notifications, multi-teacher management, and automated email workflows.

**Live Frontend** · **Live API**

</div>

---

## Overview

HMITLC is a production-grade platform designed to digitize the complete student lifecycle — from admission to graduation. It serves students, teachers, and administrators with role-based access, real-time attendance tracking, a lockdown exam engine with anti-cheating measures, and automated notifications via WhatsApp and email.

---

## Core Features

### Admission & Enrollment
- Multi-step admission form with real-time Pakistani format validation (CNIC 13-digit, Phone 03XXXXXXXXX)
- One-student-one-course policy — blocks duplicate active enrollments
- Status workflow: Pending → Approved / Rejected / Graduated
- Auto-seeded Master Admin account for secure production access

### QR Attendance System
- Camera-based QR scanner for teachers using html5-qrcode
- Course-specific and batch-specific attendance tracking
- Today vs past-date report logic with auto-absent calculation
- Attendance percentage with animated progress bars
- Students see their own attendance filtered by course

### Quiz & Examination
- Teacher-created quizzes with secret key verification
- Auto-fetched student batch from admission record — students don't type it
- Fullscreen lockdown exam with tab-change detection (3 warnings = auto-submit)
- Fullscreen-exit detection with 100ms re-lock
- Server-side question shuffling (Fisher-Yates) before sending to frontend
- Quiz management: create, edit, delete, toggle active/inactive
- Correct option displayed as "Correct: Option A" in entrance desk
- Student results with grade letters (A+ → F), performance analytics, summary cards

### ID Card Generator
- Dual-sided professional PDF ID cards with jsPDF + html2canvas
- Student photo with custom circular crop modal
- QR code linking to live verification URL (`/verify/HMITLC-2026-010`)
- HMITLC branding with graduation cap design

### WhatsApp Notifications
- Admission submission confirmation with V-Card contact card
- Approval congratulations message
- Rejection with reason
- Graduation congratulations with feedback form link
- Professional English messaging with institute header

### Email Notifications (MailerLite)
- Automated emails at every admission event
- Submission confirmation
- Approval congratulations
- Rejection with reason
- Graduation congratulations
- HTML templates matching WhatsApp message style

### Multi-Teacher Management
- Role-based token signup system (HMITLC-TCH-XXXX with 7-day expiry)
- Row-level security — teachers see all courses but only edit/delete their own
- Teacher profile with qualification, course, and batch assignment
- Admin can generate and manage tokens

### Admin Controls
- Full dashboard with Admissions, Users, Attendance, Quizzes, and Courses tabs
- Promote/demote users with animated confirmation modals
- Factory reset (hidden double-click button) with secret key — wipes all data except admin
- Master Admin auto-seeder on first database connection
- Attendance reports with course selector and date filtering

### Student Dashboard
- Three-tab layout: Overview, My Attendance, My Results
- Admission status with animated graduation banner
- Attendance view with course-specific filtering and percentage
- Quiz results with summary cards, performance bar, and grade table

### Course Management
- Course CRUD with thumbnail upload (recommended 1200×800px)
- Course details page with hero section, prerequisites, learning outcomes, course outline
- Teacher assignment per course
- Prerequisites and weekly hours tracking

### Public Pages
- Home page with hero, features, and course highlights
- Courses listing with category and level filtering
- Course details page with animated scroll-triggered sections
- Student verification portal with live auto-refresh
- Contact form with email integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion |
| Backend | Node.js 20, Express 4, Mongoose 8 |
| Database | MongoDB 7 (Atlas) |
| Auth | JWT, bcryptjs |
| PDF | jsPDF, html2canvas, QRCode.js |
| Notifications | WhatsApp (Baileys), MailerLite API |
| Deployment | Vercel (Frontend + Backend), Hugging Face Spaces |
| CI/CD | GitHub Actions → auto-deploy |
| Security | Helmet, mongo-sanitize, XSS clean, CORS |

---

## Project Structure

```
HMITLC-LMS/
├── backend/
│   ├── api/index.js              # Vercel serverless handler
│   ├── vercel.json               # Vercel routing config
│   ├── Dockerfile                # Hugging Face Spaces
│   ├── clear-data.js             # Pre-deploy data wipe
│   └── src/
│       ├── app.js                # Express app setup
│       ├── server.js             # Local dev entry point
│       ├── config/database.js    # MongoDB connection + admin seeder
│       ├── controllers/          # Route handlers
│       │   ├── auth.controller.js
│       │   ├── admission.controller.js
│       │   ├── course.controller.js
│       │   ├── quiz.controller.js
│       │   ├── admin.controller.js
│       │   ├── attendance.controller.js
│       │   └── user.controller.js
│       ├── middleware/           # Auth, CORS, error handling
│       ├── models/              # Mongoose schemas
│       │   ├── User.js
│       │   ├── Course.js
│       │   ├── Admission.js
│       │   ├── Attendance.js
│       │   ├── Quiz.js
│       │   ├── QuizResult.js
│       │   ├── Teacher.js
│       │   └── TeacherToken.js
│       ├── routes/              # API routes
│       └── utils/               # WhatsApp, MailerLite, helpers
│
├── frontend/
│   └── src/
│       ├── api/client.js         # Axios with VITE_API_URL fallback
│       ├── components/           # Layout, ProtectedRoute, Toast
│       ├── context/AuthContext    # Auth state management
│       ├── pages/                # 16+ page components
│       │   ├── HomePage.jsx
│       │   ├── CoursesPage.jsx
│       │   ├── CourseDetailsPage.jsx
│       │   ├── AdmissionPage.jsx
│       │   ├── AdminPanel.jsx
│       │   ├── TeacherDashboard.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── TeacherQuizForm.jsx
│       │   ├── QuizEntranceDesk.jsx
│       │   ├── ExamTestingEngine.jsx
│       │   ├── EditQuizForm.jsx
│       │   ├── VerifyStudentPage.jsx
│       │   └── ...
│       ├── styles.css            # Neon buttons, gradient slides
│       ├── App.jsx               # Routes
│       └── main.jsx              # Entry point
│
├── .github/workflows/deploy.yml  # Auto-deploy to Hugging Face
├── .gitignore
└── README.md
```

---

## Security

- JWT authentication with 30-day token expiration
- Password hashing with bcryptjs
- CORS restricted to production + localhost origins
- Helmet.js security headers with cross-origin resource policy
- Express mongo-sanitize and XSS protection
- Input validation on all endpoints
- Rate limiting (250 req/15 min)
- Factory reset requires admin JWT + system secret key
- Master Admin auto-seeded on first database connection
- Teacher signup verified via one-time database tokens
- Quiz questions shuffled server-side — answers never sent to frontend

---

## Deployment

| Service | Purpose | Status |
|---------|---------|--------|
| Vercel | Frontend + Backend API | Active |
| Hugging Face Spaces | WhatsApp Bot Server | Active |
| MongoDB Atlas | Database | Active |
| GitHub Actions | Auto-deploy backend | Active |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Muhammad Anas**
- GitHub: [@MrAnas07](https://github.com/MrAnas07)

---

<div align="center">

**Built for Hasrat Mohani IT Literacy Centre**

</div>
