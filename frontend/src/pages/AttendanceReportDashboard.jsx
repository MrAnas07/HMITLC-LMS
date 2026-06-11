import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  UserCheck,
  Users,
  XCircle,
  Download,
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";

const AttendanceReportDashboard = ({ userRole, assignedCourse, selectedCourseName, onBack }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(
    userRole === "teacher" ? assignedCourse || "" : ""
  );
  const [metrics, setMetrics] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = (selectedDate === todayStr);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses || response.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const courseFilter = selectedCourse || assignedCourse || "";
        let queryUrl = `/attendance/report?date=${selectedDate}`;
        if (courseFilter) queryUrl += `&course=${courseFilter}`;
        if (searchQuery) queryUrl += `&search=${encodeURIComponent(searchQuery)}`;

        const response = await api.get(queryUrl);

        if (response.data.success) {
          setAttendanceData(response.data.data);
          setMetrics(response.data.metrics);
        }
      } catch (error) {
        console.error("Report fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedDate, selectedCourse, assignedCourse]);

  const filteredRecords = attendanceData.filter(
    (record) =>
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attendanceRate =
    metrics.total > 0 ? Math.round((metrics.present / metrics.total) * 100) : 0;

  const isFutureDate = new Date(selectedDate + "T00:00:00") > new Date(new Date().toDateString());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden bg-white px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="btn-press grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  type="button"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      userRole === "admin"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                    }`}
                  >
                    {userRole === "admin" ? "Admin" : "Teacher"} View
                  </span>
                </div>
                <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                  {selectedCourseName || "Attendance"}{" "}
                  <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">
                    Report
                  </span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Real-time attendance analytics and student tracking
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search Name / ID..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-52"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {userRole === "admin" && (
                <div className="relative">
                  <BookOpen
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <select
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-52"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1045b8]"
                  size={16}
                />
                <input
                  type="date"
                  className="h-10 w-full rounded-xl border-2 border-[#1045b8] bg-blue-50 pl-9 pr-4 text-sm font-bold text-[#1045b8] outline-none transition focus:ring-2 focus:ring-[#1045b8]/20 dark:border-blue-500 dark:bg-slate-900 dark:text-blue-300 sm:w-auto"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metrics Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Enrolled
                </p>
                <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                  {metrics.total}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300">
                <Users size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-lg dark:border-green-500/20 dark:bg-green-500/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                  Present
                </p>
                <p className="mt-1 text-3xl font-black text-green-700 dark:text-green-300">
                  {metrics.present}
                </p>
              </div>
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                <CheckCircle2 size={20} />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-500">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-lg dark:border-amber-500/20 dark:bg-amber-500/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Late
                </p>
                <p className="mt-1 text-3xl font-black text-amber-700 dark:text-amber-300">
                  {metrics.late}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                <Clock size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-lg dark:border-red-500/20 dark:bg-red-500/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Absent
                </p>
                <p className="mt-1 text-3xl font-black text-red-700 dark:text-red-300">
                  {metrics.absent}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
                <XCircle size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 rounded-2xl border border-[#1045b8]/20 bg-gradient-to-br from-[#1045b8]/5 to-blue-100 p-5 shadow-lg lg:col-span-1 dark:border-blue-500/20 dark:from-blue-950/20 dark:to-blue-900/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1045b8] dark:text-blue-300">
                  Attendance Rate
                </p>
                <p className="mt-1 text-3xl font-black text-[#1045b8] dark:text-blue-300">
                  {attendanceRate}%
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1045b8] text-white shadow-lg shadow-blue-900/20">
                <UserCheck size={20} />
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendanceRate}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#1045b8] to-blue-400"
              />
            </div>
          </motion.div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#1045b8] dark:text-blue-300">
                <Filter size={16} /> Attendance Ledger
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Users size={16} /> {filteredRecords.length} students
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1045b8] border-t-transparent" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Loading attendance data...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-black uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4 text-center">Scan Time</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center">
                          {isFutureDate ? (
                            <div className="flex flex-col items-center">
                              <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300">
                                <Calendar size={30} />
                              </div>
                              <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                                No Attendance Yet
                              </p>
                              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                Attendance for <span className="font-bold text-[#1045b8]">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span> has not been marked yet. Students will scan their ID cards on that day.
                              </p>
                            </div>
                          ) : isToday ? (
                            <div className="flex flex-col items-center">
                              <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300">
                                <span className="animate-pulse text-3xl">⏱️</span>
                              </div>
                              <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                                Waiting for First Scan
                              </p>
                              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                No students have scanned their ID cards yet. Live attendance records will appear here as students check in throughout the day.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                <Users size={30} />
                              </div>
                              <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                                No Students Found
                              </p>
                              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                No approved students found for this date. Students need to have approved admissions to appear in attendance reports.
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((row, index) => (
                        <motion.tr
                          key={row.studentId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <td className="p-4 font-mono text-sm font-bold text-[#1045b8] dark:text-blue-400">
                            {row.studentId}
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {row.studentName}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              {row.phoneNumber}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300">
                              <BookOpen size={12} />
                              {row.courseName}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {row.batchName}
                          </td>
                          <td className="p-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {row.scannedAt
                              ? new Date(row.scannedAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )
                              : "—"}
                          </td>
                          <td className="p-4 text-center">
                            {row.status === "Present" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                PRESENT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                                <XCircle size={12} />
                                ABSENT
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportDashboard;
