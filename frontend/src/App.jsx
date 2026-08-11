import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, useEffect, Suspense } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import PageMotion from "./utils/animations/PageMotion.jsx";

const HomePage = lazy(() => import("./pages/HomePage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailsPage = lazy(() => import("./pages/CourseDetailsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AdmissionsPage = lazy(() => import("./pages/AdmissionsPage"));
const QuizEntranceDesk = lazy(() => import("./pages/QuizEntranceDesk"));
const VerifyStudentPage = lazy(() => import("./pages/VerifyStudentPage"));
const AdmissionPage = lazy(() => import("./pages/AdmissionPage"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherScannerPage = lazy(() => import("./pages/TeacherScannerPage"));
const TeacherQuizForm = lazy(() => import("./pages/TeacherQuizForm"));
const EditQuizForm = lazy(() => import("./pages/EditQuizForm"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const SeatAllocationPage = lazy(() => import("./pages/SeatAllocationPage"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#1045b8] border-t-transparent" />
      <p className="mt-3 text-sm font-semibold text-slate-500">Loading...</p>
    </div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </AnimatePresence>
    </>
  );
};

export default App;
