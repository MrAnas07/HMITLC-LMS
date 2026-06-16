# HMITLC - Hasrat Mohani IT Literacy Centre Management System

<div align="center">

![HMITC Banner](https://img.shields.io/badge/HMITC-Management%20System-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-47a248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A comprehensive Learning Management System (LMS) for IT education institutions**

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [MongoDB Setup](#mongodb-setup)
- [Running Locally](#running-locally)
- [Build for Production](#build-for-production)
- [Project Structure](#project-structure)
- [Admin Features](#admin-features)
- [Student Features](#student-features)
- [ID Card Generator](#id-card-generator)
- [Security](#security)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure login/signup with role-based access
- 📝 **Student Admission System** - Multi-step registration with validation
- 🎓 **Course Management** - CRUD operations for courses
- 👨‍🏫 **Teacher Dashboard** - Manage assigned courses and students
- 📊 **Admin Dashboard** - Complete control over admissions and users
- 🪪 **ID Card Generator** - Professional PDF generation with QR codes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - User-controlled theme preference

### Validation Features
- 📱 **Phone Validation** - 11-digit Pakistani phone format
- 🪪 **CNIC Validation** - 13-digit Pakistani national ID format
- 📸 **Image Upload** - Profile picture with size/type validation
- ✉️ **Email Validation** - Standard email format check

---

## 🖼️ Screenshots

### Student ID Card Preview

The system generates professional dual-sided ID cards:

**Front Side:**
- HMITLC branding with graduation cap
- Student photo (circular passport style)
- Student name, course, ID number
- Batch information

**Back Side:**
- Student details (Name, Father's Name, CNIC)
- QR code for verification
- Institute contact information
- Legal disclaimer

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3+ | UI Framework |
| Vite | 5.x | Build Tool |
| React Router | 6.x | Routing |
| Tailwind CSS | 3.x | Styling |
| Lucide React | Latest | Icons |
| React Hook Form | 7.x | Form Management |
| Axios | 1.x | HTTP Client |
| jsPDF | 2.x | PDF Generation |
| html2canvas | 1.x | Canvas Rendering |
| QRCode | Latest | QR Code Generation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 4.x | Web Framework |
| MongoDB | 7+ | Database |
| Mongoose | 8.x | ODM |
| JWT | Latest | Authentication |
| bcryptjs | 2.x | Password Hashing |
| Express Rate Limit | 7.x | Rate Limiting |
| Helmet | 7.x | Security Headers |
| CORS | 2.x | Cross-Origin Support |

---

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- MongoDB 7 or higher (local or Atlas)
- npm or yarn package manager

### Clone the Repository
```bash
git clone https://github.com/MrAnas07/HMITC-LMS.git
cd HMITC-LMS
```

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Install All Dependencies (Root)
```bash
npm run install:all
```

---

## 🔐 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hmitc-lms
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hmitc-lms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# File Upload Limits
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=250
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=HMITC LMS
```

---

## 🗄️ MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/products/community)
2. Start the service: `mongod`
3. Create database: `hmitc-lms`

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 sandbox)
3. Create database user with read/write permissions
4. Whitelist IP `0.0.0.0/0` for development
5. Copy connection string and update `.env`

---

## 🚀 Running Locally

### Start Backend Server
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:5173
```

### Run Both Simultaneously (Root)
```bash
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 🏗️ Build for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output will be in frontend/dist
```

### Preview Production Build
```bash
npm run preview
```

### Backend Production
```bash
cd backend
npm start
# Set NODE_ENV=production in .env
```

---

## 📁 Project Structure

```
HMITC-LMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/              # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── course.controller.js
│   │   │   ├── admission.controller.js
│   │   │   └── idCard.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── error.middleware.js   # Error handling
│   │   │   └── upload.middleware.js   # File upload
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   └── Admission.js
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── course.routes.js
│   │   │   └── admission.routes.js
│   │   ├── utils/
│   │   │   ├── asyncHandler.js       # Async wrapper
│   │   │   └── apiError.js           # Custom error class
│   │   └── server.js                 # Express server entry
│   ├── uploads/                      # Uploaded files
│   ├── .env                          # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Axios instance
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Main layout
│   │   │   ├── ProtectedRoute.jsx    # Route guard
│   │   │   └── Toast.jsx              # Notifications
│   │   ├── constants/
│   │   │   └── index.js               # App constants
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── AdmissionPage.jsx
│   │   │   ├── AdmissionsPage.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── hml2canvasIdCardGenerator.js  # PDF generator
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── .env                          # Environment variables
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── vite.config.js                # Vite configuration
│   └── package.json
│
├── .gitignore
├── package.json                      # Workspace root
└── README.md
```

---

## 👨‍💼 Admin Features

1. **Dashboard Overview**
   - Total students, courses, teachers
   - Recent admissions
   - Quick actions

2. **Admission Management**
   - View all pending admissions
   - Approve/reject admissions
   - Assign class timing and batch
   - Generate student IDs

3. **Course Management**
   - Create/update/delete courses
   - View enrolled students
   - Set course availability

4. **User Management**
   - View all users (students, teachers)
   - Update user roles
   - Deactivate accounts

5. **ID Card Generation**
   - Generate ID cards for approved students
   - Download PDF copies

---

## 🎓 Student Features

1. **Registration**
   - Multi-step admission form
   - Profile picture upload
   - Real-time validation

2. **Dashboard**
   - View admission status
   - Download ID card
   - View assigned course

3. **Profile Management**
   - Update personal information
   - View course details
   - Check class schedule

---

## 🪪 ID Card Generator

The system generates professional dual-sided ID cards using:

- **jsPDF** - PDF document generation
- **html2canvas** - HTML to canvas conversion
- **QRCode** - QR code generation

### Features
- Professional HMITLC branding
- Student photo (passport style)
- QR code for verification
- Dual-sided design (front + back)
- High-definition export
- Landscape PDF format

### Usage
```javascript
import { generateHMITLCIdCard } from "./utils/hml2canvasIdCardGenerator";

const student = {
  fullName: "Muhammad Anas",
  fatherName: "Muhammad Amir",
  cnic: "4210112345671",
  studentId: "HMITC-2026-001",
  courseName: "Web and Mobile App Development",
  batchName: "BATCH 11",
  profilePicture: "base64string..."
};

await generateHMITLCIdCard(student);
```

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Token expiration (30 days)

2. **API Security**
   - Rate limiting (250 requests/15 min)
   - Helmet.js security headers
   - CORS configuration
   - Input validation

3. **Data Protection**
   - Environment variables for secrets
   - No sensitive data in code
   - MongoDB connection security

### Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets in production**
3. **Enable rate limiting in production**
4. **Use HTTPS in production**
5. **Regular dependency updates**

---

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

### Render/Railway (Backend)
1. Connect repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### MongoDB Atlas
1. Create production cluster
2. Update connection string
3. Enable IP whitelist
4. Configure replica set (optional)

---

## 🔮 Future Improvements

- [ ] Email notifications for admission status
- [ ] SMS integration for updates
- [ ] Payment gateway integration
- [ ] Attendance tracking system
- [ ] Online examination module
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Anas**
- GitHub: [@MrAnas07](https://github.com/MrAnas07)

---

<div align="center">

**Built with ❤️ for Hasrat Mohani IT Literacy Centre**

</div>