import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { RefreshCw, CheckCircle2, XCircle, ShieldCheck, Clock, GraduationCap, BookOpen, User, CreditCard } from "lucide-react";

const VerifyStudentPage = () => {
  const { studentId } = useParams();
  const [status, setStatus] = useState("loading");
  const [student, setStudent] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pulseRefresh, setPulseRefresh] = useState(false);

  const verify = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
      setPulseRefresh(true);
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${apiUrl}/admissions/verify/${studentId}`);
      if (res.data.verified) {
        setStudent(res.data.data);
        setStatus("verified");
        setLastUpdated(new Date());
      } else {
        setStatus("failed");
      }
    } catch (error) {
      setStatus("failed");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setPulseRefresh(false), 500);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) verify();
  }, [studentId, verify]);

  // Live refresh every 10 seconds
  useEffect(() => {
    if (status !== "verified") return;
    const interval = setInterval(() => verify(false), 10000);
    return () => clearInterval(interval);
  }, [status, verify]);

  const statusConfig = {
    Active: {
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/30",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: CheckCircle2,
      label: "Active Student"
    },
    Graduated: {
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: GraduationCap,
      label: "Graduated"
    },
    Pending: {
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/30",
      text: "text-amber-700 dark:text-amber-300",
      icon: Clock,
      label: "Pending Review"
    },
    Rejected: {
      color: "from-red-500 to-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/30",
      text: "text-red-700 dark:text-red-300",
      icon: XCircle,
      label: "Rejected"
    }
  };

  const currentStatus = student ? (statusConfig[student.status] || statusConfig.Active) : null;
  const StatusIcon = currentStatus?.icon || CheckCircle2;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] via-white to-[#f0f4ff] px-4 py-8 sm:py-10 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center sm:mb-8"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-[10px] font-black tracking-widest text-[#1045b8] shadow-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-xs">
          <span>🎓</span>
          <span>HMITLC - Student Verification Portal</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl lg:text-4xl">
          ID Card <span className="bg-gradient-to-r from-[#1045b8] to-[#f59e0b] bg-clip-text text-transparent">Verification</span>
        </h1>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">Hasrat Mohani IT Literacy Centre - Official Verification System</p>
      </motion.div>

      {/* Live Status Indicator */}
      {status === "verified" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm sm:mb-6 sm:px-4 sm:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live Updates Active
          <button
            onClick={() => verify(true)}
            disabled={isRefreshing}
            className="ml-2 rounded-full p-1 transition hover:bg-slate-100"
            type="button"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : pulseRefresh ? "text-emerald-500" : ""} />
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:max-w-md sm:p-8 md:p-10"
          >
            <div className="mb-4 text-4xl animate-pulse-soft sm:text-5xl">🔍</div>
            <div className="text-base font-black text-slate-700 sm:text-lg">Verifying Student...</div>
            <div className="mt-2 text-xs text-slate-400 sm:text-sm">Checking database records</div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-6">
              <motion.div
                className="h-2 rounded-full bg-[#1045b8]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Verified State */}
        {status === "verified" && student && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-green-300 bg-white shadow-2xl dark:border-green-500/50 dark:bg-slate-900 sm:max-w-md"
          >
            {/* Top Badge */}
            <div className={`relative overflow-hidden bg-gradient-to-r ${currentStatus.color} p-4 text-center sm:p-6`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white/20 shadow-lg backdrop-blur-sm sm:h-16 sm:w-16"
              >
                <StatusIcon size={28} className="text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-black tracking-wider text-white backdrop-blur-sm sm:text-sm"
              >
                <ShieldCheck size={14} />
                VERIFIED - {currentStatus.label.toUpperCase()}
              </motion.div>
            </div>

            {/* Student Info */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {[
                  { icon: User, label: "Student Name", value: student.fullName, delay: 0.5 },
                  { icon: CreditCard, label: "Student ID", value: student.studentId, delay: 0.55, highlight: true },
                  { icon: BookOpen, label: "Course", value: student.courseName, delay: 0.6 },
                  { icon: GraduationCap, label: "Batch", value: student.batchName || "-", delay: 0.65 }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay, duration: 0.3 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 sm:p-4"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1045b8]/10 text-[#1045b8] dark:bg-blue-500/10 dark:text-blue-400">
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                        {item.label}
                      </div>
                      <div className={`text-sm font-black sm:text-base ${item.highlight ? "text-[#1045b8] dark:text-blue-400" : "text-slate-800 dark:text-white"}`}>
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mt-4 flex justify-center"
              >
                <span className={`inline-flex items-center gap-2 rounded-full ${currentStatus.bg} ${currentStatus.border} border px-4 py-2 text-xs font-black ${currentStatus.text} sm:text-sm`}>
                  <StatusIcon size={14} />
                  {currentStatus.label}
                </span>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-500/30 dark:bg-blue-500/10 sm:mt-6"
              >
                <div className="text-[10px] leading-relaxed text-blue-600 dark:text-blue-300 sm:text-xs">
                  This record is verified by <span className="font-black">Hasrat Mohani IT Literacy Centre</span>.
                </div>
                {lastUpdated && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-blue-500/70 dark:text-blue-400/60">
                    <Clock size={10} />
                    Last checked: {lastUpdated.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-red-300 bg-white p-6 text-center shadow-xl dark:border-red-500/50 dark:bg-slate-900 sm:max-w-md sm:p-8 md:p-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-400 bg-red-100 dark:border-red-500/50 dark:bg-red-500/10 sm:h-20 sm:w-20"
            >
              <XCircle size={32} className="text-red-500" />
            </motion.div>
            <div className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-[10px] font-black tracking-widest text-red-700 dark:bg-red-500/15 dark:text-red-300 sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
              NOT VERIFIED
            </div>
            <div className="mb-2 text-base font-black text-slate-800 dark:text-white sm:text-lg">Student Not Found</div>
            <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
              This ID card could not be verified. The student ID may be invalid, or the admission has not been approved yet.
            </div>
            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-2.5 text-[10px] font-medium text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300 sm:mt-6 sm:p-3 sm:text-xs">
              If you believe this is an error, please contact HMITLC directly.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refresh Button */}
      {status === "verified" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={() => verify(true)}
          disabled={isRefreshing}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#1045b8]/40 hover:text-[#1045b8] sm:mt-8 sm:px-5 sm:text-sm"
          type="button"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </motion.button>
      )}

      <Link to="/" className="mt-4 text-xs font-bold text-[#1045b8] hover:underline sm:mt-6 sm:text-sm">
        Back to HMITLC Website
      </Link>
    </div>
  );
};

export default VerifyStudentPage;
