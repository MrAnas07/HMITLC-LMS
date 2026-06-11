import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Users,
  BarChart3,
  ChevronRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import AttendanceReportDashboard from "../pages/AttendanceReportDashboard";

const COURSE_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

const AttendanceCourseSelector = ({ userRole, onBack }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("lms_token");
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const params = userRole === "teacher" ? { mine: "true" } : {};
        const res = await axios.get(`${baseURL}/courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params,
          timeout: 10000,
        });
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [userRole]);

  if (selectedCourse) {
    return (
      <AttendanceReportDashboard
        userRole={userRole}
        assignedCourse={selectedCourse._id}
        selectedCourseName={selectedCourse.title}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="btn-press grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          type="button"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#1045b8] dark:text-blue-300">
            <BarChart3 size={14} /> Attendance Portal
          </p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            {userRole === "teacher" ? "My Assigned Course" : "Select a Course"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {userRole === "teacher"
              ? "View attendance report for your assigned course"
              : "View attendance report for a specific course"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#1045b8]" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Loading courses...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
            <BookOpen size={30} />
          </div>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200">
            Error Loading Courses
          </p>
          <p className="mt-2 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-[#1045b8] px-6 py-2 text-sm font-bold text-white hover:bg-[#0d3b8e]"
          >
            Retry
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <BookOpen size={30} />
          </div>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200">
            No Courses Found
          </p>
          <p className="mt-2 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
            {userRole === "teacher"
              ? "You have no assigned courses. Contact admin to get assigned."
              : "Create courses first to view attendance reports."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedCourse(course)}
              className={`group cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br ${
                COURSE_COLORS[idx % COURSE_COLORS.length]
              } p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7`}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <BookOpen size={22} />
                  </div>
                  <h3 className="text-xl font-black tracking-wide sm:text-2xl">
                    {course.title}
                  </h3>
                  {course.category && (
                    <p className="mt-1 text-xs font-semibold text-white/70">
                      {course.category}
                    </p>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-white/70" />
                    <span className="text-xs font-bold text-white/80">
                      {course.seatsAvailable || "—"} Seats
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold underline-offset-4 group-hover:underline">
                    View Report <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceCourseSelector;
