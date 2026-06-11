import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import AdminPanel from "./pages/AdminPanel";
import AdmissionPage from "./pages/AdmissionPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import AdmissionsPage from "./pages/AdmissionsPage";
import LoginPage from "./pages/LoginPage";
import SeatAllocationPage from "./pages/SeatAllocationPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherScannerPage from "./pages/TeacherScannerPage";
import TeacherQuizForm from "./pages/TeacherQuizForm";
import QuizEntranceDesk from "./pages/QuizEntranceDesk";
import EditQuizForm from "./pages/EditQuizForm";
import VerifyStudentPage from "./pages/VerifyStudentPage";
import PageMotion from "./utils/animations/PageMotion.jsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <Toast />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route index element={<PageMotion><HomePage /></PageMotion>} />
            <Route path="courses" element={<PageMotion><CoursesPage /></PageMotion>} />
            <Route path="courses/:id" element={<PageMotion><CourseDetailsPage /></PageMotion>} />
            <Route path="about" element={<PageMotion><AboutPage /></PageMotion>} />
            <Route path="contact" element={<PageMotion><ContactPage /></PageMotion>} />
            <Route path="login" element={<PageMotion><LoginPage /></PageMotion>} />
            <Route path="signup" element={<PageMotion><SignupPage /></PageMotion>} />
            <Route path="admissions" element={<PageMotion><AdmissionsPage /></PageMotion>} />
            <Route path="quiz" element={<PageMotion><QuizEntranceDesk /></PageMotion>} />
            <Route path="verify/:studentId" element={<PageMotion><VerifyStudentPage /></PageMotion>} />

            <Route element={<ProtectedRoute />}>
              <Route path="admission" element={<PageMotion><AdmissionPage /></PageMotion>} />
            </Route>

            <Route element={<ProtectedRoute roles={["student"]} />}>
              <Route path="student" element={<PageMotion><StudentDashboard /></PageMotion>} />
              <Route path="dashboard/student" element={<PageMotion><StudentDashboard /></PageMotion>} />
            </Route>

            <Route element={<ProtectedRoute roles={["teacher", "admin"]} />}>
              <Route path="teacher" element={<PageMotion><TeacherDashboard /></PageMotion>} />
              <Route path="dashboard/teacher" element={<PageMotion><TeacherDashboard /></PageMotion>} />
              <Route path="scan-attendance" element={<TeacherScannerPage />} />
              <Route path="create-quiz" element={<PageMotion><TeacherQuizForm /></PageMotion>} />
              <Route path="quiz/edit/:id" element={<PageMotion><EditQuizForm /></PageMotion>} />
            </Route>

            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="admin" element={<PageMotion><AdminPanel /></PageMotion>} />
              <Route path="admin/seats" element={<PageMotion><SeatAllocationPage /></PageMotion>} />
              <Route path="dashboard/admin" element={<PageMotion><AdminPanel /></PageMotion>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
