import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";

const StudentAttendanceView = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });
  const [courseName, setCourseName] = useState("");
  const [batchName, setBatchName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        const response = await api.get("/attendance/my-attendance");
        if (response.data.success) {
          setLogs(response.data.data);
          setMetrics(response.data.metrics);
          setCourseName(response.data.courseName);
          setBatchName(response.data.batchName);
          setStudentId(response.data.studentId);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchMyAttendance();
  }, []);

  const attendancePercentage =
    metrics.total > 0
      ? Math.round(((metrics.present + metrics.late) / metrics.total) * 100)
      : 0;

  const getPercentageColor = () => {
    if (attendancePercentage >= 75) return "text-green-600 dark:text-green-400";
    if (attendancePercentage >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressBarColor = () => {
    if (attendancePercentage >= 75) return "from-green-500 to-emerald-400";
    if (attendancePercentage >= 50) return "from-amber-500 to-yellow-400";
    return "from-red-500 to-rose-400";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <section className="relative overflow-hidden bg-white px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100 text-red-500">
                <XCircle size={18} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                  My <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Attendance</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden bg-white px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-700 dark:bg-green-950/40 dark:text-green-300">
                    Student View
                  </span>
                </div>
                <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                  My <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Attendance</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Track your daily attendance and progress
                </p>
              </div>
            </div>

            {/* Student Info Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {studentId && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  <Users size={12} />
                  {studentId}
                </span>
              )}
              {courseName && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                  <BookOpen size={12} />
                  {courseName}
                </span>
              )}
              {batchName && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  🏷️ {batchName}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metrics Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {/* Attendance Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="col-span-2 rounded-2xl border border-[#1045b8]/20 bg-gradient-to-br from-[#1045b8]/5 to-blue-100 p-5 shadow-lg lg:col-span-1 dark:border-blue-500/20 dark:from-blue-950/20 dark:to-blue-900/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1045b8] dark:text-blue-300">
                  Attendance Rate
                </p>
                <p className={`mt-1 text-3xl font-black ${getPercentageColor()}`}>
                  {attendancePercentage}%
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1045b8] text-white shadow-lg shadow-blue-900/20">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor()}`}
              />
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {attendancePercentage >= 75
                ? "Excellent! Keep it up!"
                : attendancePercentage >= 50
                ? "Need improvement"
                : "Warning: Low attendance"}
            </p>
          </motion.div>

          {/* Present */}
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

          {/* Late */}
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

          {/* Absent */}
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

          {/* Total Days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Days
                </p>
                <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                  {metrics.total}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Calendar size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Attendance Log Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#1045b8] dark:text-blue-300">
                <Calendar size={16} /> Attendance History
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                Your Daily Logs
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Users size={16} /> {logs.length} records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1045b8] border-t-transparent" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Loading your attendance...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-black uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 sticky top-0">
                    <th className="p-4">#</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Day</th>
                    <th className="p-4 text-center">Scan Time</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300">
                              <Calendar size={30} />
                            </div>
                            <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                              No Attendance Records Yet
                            </p>
                            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                              Your attendance history will appear here once your teacher scans your ID card during class.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log, index) => (
                        <motion.tr
                          key={log._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <td className="p-4 text-sm font-bold text-slate-400">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300">
                                <Calendar size={14} />
                              </div>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {new Date(log.date + "T00:00:00").toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {new Date(log.date + "T00:00:00").toLocaleDateString(
                              "en-US",
                              { weekday: "short" }
                            )}
                          </td>
                          <td className="p-4 text-center font-mono text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {log.time || "—"}
                          </td>
                          <td className="p-4 text-center">
                            {log.status === "Present" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-black text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                PRESENT
                              </span>
                            ) : log.status === "Late" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                <Clock size={12} />
                                LATE
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

export default StudentAttendanceView;
