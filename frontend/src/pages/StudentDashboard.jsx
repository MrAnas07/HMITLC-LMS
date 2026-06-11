import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Sparkles,
  Trophy,
  UserRound,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../api/client";
import StudentAttendanceView from "../components/StudentAttendanceView";
import StudentResultsView from "./StudentResultsView";

const statusIcon = {
  Pending: Clock,
  Approved: CheckCircle2,
  Rejected: XCircle,
  Graduated: GraduationCap
};

const statusClass = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  Rejected: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
  Graduated: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({ applications: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/users/dashboard")
      .then(({ data }) => setData(data))
      .catch((error) => setMessage(getErrorMessage(error)));
  }, []);

  const applications = data.applications || [];
  const approvedCount = applications.filter((application) => application.status === "Approved").length;
  const pendingCount = applications.filter((application) => application.status === "Pending").length;
  const rejectedCount = applications.filter((application) => application.status === "Rejected").length;
  const graduatedCount = applications.filter((application) => application.status === "Graduated").length;

  const summaryCards = [
    ["Total Applications", applications.length, FileText],
    ["Approved", approvedCount, CheckCircle2],
    ["Pending", pendingCount, Clock],
    ["Rejected", rejectedCount, XCircle],
    ["Graduated", graduatedCount, GraduationCap]
  ];

  return (
    <section className="dashboard-soft page-enter relative isolate min-h-screen overflow-hidden bg-white pb-10 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white dark:bg-slate-950" />

      <section className="relative isolate overflow-hidden bg-white px-4 py-12 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-16 md:px-8 md:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]"></div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black tracking-widest text-[#1045b8] shadow-sm backdrop-blur animate-fade-in-up dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2">
            <span>⭐</span>
            <span>Student Portal</span>
            <span>⭐</span>
          </div>
          <h1 className="mb-6 text-3xl font-black leading-tight animate-fade-in-up delay-100 text-slate-950 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Student <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="mb-10 max-w-3xl mx-auto text-base font-semibold text-slate-600 dark:text-slate-300 animate-fade-in-up delay-200 sm:text-lg md:text-xl">
            Track your admission status, courses and download your ID card.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <button
              onClick={() => setActiveTab("overview")}
              className={`btn-press inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition sm:px-6 ${
                activeTab === "overview"
                  ? "bg-[#1045b8] text-white shadow-lg shadow-blue-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-[#1045b8]/40 hover:text-[#1045b8] dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <FileText size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`btn-press inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition sm:px-6 ${
                activeTab === "attendance"
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-green-500/40 hover:text-green-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <BarChart3 size={16} />
              My Attendance
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`btn-press inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition sm:px-6 ${
                activeTab === "results"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-red-500/40 hover:text-red-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <Trophy size={16} />
              My Results
            </button>
          </div>
        </div>
      </section>

      {activeTab === "attendance" ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <StudentAttendanceView />
        </div>
      ) : activeTab === "results" ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          <StudentResultsView />
        </div>
      ) : (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-4 text-slate-950 shadow-xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-white sm:p-6 md:p-8">
          <div className="grid gap-4 sm:gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 sm:p-5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 sm:text-sm">Application Summary</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="text-xl font-black sm:text-2xl">{approvedCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[11px]">Approved</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="text-xl font-black sm:text-2xl">{pendingCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[11px]">Pending</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="text-xl font-black sm:text-2xl">{rejectedCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[11px]">Rejected</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-3 text-center dark:border-blue-500/30 dark:bg-blue-500/10">
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300 sm:text-2xl">{graduatedCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 sm:text-[11px]">Graduated</p>
                </div>
              </div>
              <Link className="btn-press mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5" to="/admission">
                Apply For Admission <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>

        {graduatedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-6 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-amber-50/30 shadow-2xl shadow-blue-900/15 dark:border-blue-500/30 dark:from-blue-950/40 dark:via-slate-900 dark:to-amber-950/10 dark:shadow-none"
          >
            {/* Animated background circles */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative p-6 sm:p-8 lg:p-10 text-center">
              {/* Animated Graduation Cap */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative mx-auto mb-5"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-500/40 sm:h-20 sm:w-20">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GraduationCap size={32} className="sm:hidden" />
                    <GraduationCap size={40} className="hidden sm:block" />
                  </motion.div>
                </div>
                {/* Sparkle dots */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                  className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1.1 }}
                  className="absolute bottom-1 -right-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                />
              </motion.div>

              {/* Animated Heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 sm:text-xs">
                  🎓 Achievement Unlocked
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-3 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-amber-600 dark:from-blue-200 dark:via-blue-300 dark:to-amber-300 sm:text-3xl lg:text-4xl"
              >
                Congratulations!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-2 text-lg font-black text-blue-800 dark:text-blue-300 sm:text-xl"
              >
                You're a Graduate
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-3 max-w-lg mx-auto text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
              >
                You have successfully completed your course at HMITLC.
                <br className="hidden sm:block" />
                You are now eligible to apply for new courses and advance your career.
              </motion.p>

              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-xs font-black text-white shadow-lg shadow-blue-600/30 sm:text-sm"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <GraduationCap size={16} />
                </motion.div>
                Graduated
              </motion.div>

              {/* Animated Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-6"
              >
                <Link
                  to="/courses"
                  className="group btn-press relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1045b8] via-blue-600 to-[#0d3b8e] px-8 text-sm font-black text-white shadow-xl shadow-blue-900/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/35 hover:-translate-y-0.5 sm:text-base"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    Browse New Courses
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}

        {message && (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {message}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {summaryCards.map(([label, value, Icon]) => (
            <div className="card-animate hover-lift rounded-3xl border border-slate-200 bg-white/85 p-4 text-slate-950 shadow-xl shadow-blue-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:text-white sm:p-5" key={label}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-200 sm:h-12 sm:w-12">
                  <Icon size={20} className="sm:hidden" />
                  <Icon size={21} className="hidden sm:block" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-black sm:mt-5 sm:text-4xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:p-6">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#1045b8] dark:text-blue-300 sm:text-sm">
                <GraduationCap size={16} /> Applications
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">My admission records</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:px-4 sm:py-2 sm:text-sm">
              <FileText size={16} /> {applications.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((application) => {
              const Icon = statusIcon[application.status] || Clock;
              return (
                <article className="p-4 sm:p-5 lg:p-6" key={application._id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#1045b8]/10 text-[#1045b8] dark:bg-blue-500/10 dark:text-blue-300 sm:h-12 sm:w-12">
                          <BookOpen size={20} className="sm:hidden" />
                          <BookOpen size={22} className="hidden sm:block" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-black text-slate-950 dark:text-white sm:text-xl md:text-2xl">
                            {application.selectedCourse?.title || "Admission Application"}
                          </h3>
                          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 sm:mt-2 sm:text-sm">
                            <Calendar size={14} className="sm:hidden" />
                            <Calendar size={16} className="hidden sm:block" /> Submitted on {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex h-11 w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wide dark:text-slate-300 sm:px-4 sm:text-sm ${statusClass[application.status]}`}>
                      <Icon size={14} className="sm:hidden" />
                      <Icon size={16} className="hidden sm:block" /> {application.status}
                    </span>
                  </div>

                  {application.status === "Approved" && application.classTiming && (
                    <div className="mt-6 rounded-3xl border border-[#1045b8]/20 bg-gradient-to-br from-[#1045b8]/10 via-white to-yellow-50 p-4 dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900 sm:p-5 md:p-6">
                      <h4 className="flex items-center gap-2 text-base font-black text-[#1045b8] dark:text-white sm:text-lg md:text-xl">
                        <Clock size={18} className="sm:hidden" />
                        <Clock size={20} className="hidden sm:block" /> My Class Schedule
                      </h4>
                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                          <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Course</span>
                          <span className="mt-1 block break-words font-bold text-slate-950 dark:text-white">{application.selectedCourse?.title || "N/A"}</span>
                        </div>
                        {application.batchName && (
                          <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                            <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Batch</span>
                            <span className="mt-1 block font-bold text-slate-950 dark:text-white">{application.batchName}</span>
                          </div>
                        )}
                        <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                          <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Timing</span>
                          <span className="mt-1 block font-bold text-slate-950 dark:text-white">{application.classTiming}</span>
                        </div>
                        <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                          <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Days</span>
                          <span className="mt-1 block font-bold text-slate-950 dark:text-white">
                            {application.classDays?.join(", ") || "N/A"}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                          <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Approved</span>
                          <span className="mt-1 block font-bold text-emerald-600 dark:text-emerald-400">
                            {application.approvedAt ? new Date(application.approvedAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-white/85 p-3 dark:bg-slate-800 sm:p-4">
                          <span className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Student ID</span>
                          <span className="mt-1 block break-words font-black text-[#1045b8] dark:text-blue-300">
                            {application.studentId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.status === "Graduated" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative mt-6 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-amber-50/30 p-5 dark:border-blue-500/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-amber-950/10 sm:p-6 md:p-8"
                    >
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl" />
                      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />

                      <div className="relative flex flex-col items-center text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          className="relative mb-4"
                        >
                          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 sm:h-16 sm:w-16">
                            <motion.div
                              animate={{ rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <GraduationCap size={28} />
                            </motion.div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow shadow-amber-400/50"
                          />
                        </motion.div>

                        <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-200 dark:to-blue-300 sm:text-xl">
                          Course Completed
                        </h4>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          You have successfully completed{" "}
                          <span className="font-bold text-blue-700 dark:text-blue-300">
                            {application.selectedCourse?.title || "this course"}
                          </span>. You are now eligible to apply for new courses.
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-1.5 text-xs font-black text-white shadow-lg shadow-blue-600/25">
                          <GraduationCap size={14} /> Graduated
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
                    <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 sm:p-4"><UserRound size={14} className="mb-1 text-[#1045b8] sm:hidden" /><UserRound size={16} className="mb-2 text-[#1045b8] hidden sm:block" /><span className="block text-xs font-black uppercase tracking-wider text-slate-400">Name</span> {application.fullName}</p>
                    <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 sm:p-4"><UserRound size={14} className="mb-1 text-[#1045b8] sm:hidden" /><UserRound size={16} className="mb-2 text-[#1045b8] hidden sm:block" /><span className="block text-xs font-black uppercase tracking-wider text-slate-400">Father</span> {application.fatherName}</p>
                    <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 sm:p-4"><GraduationCap size={14} className="mb-1 text-[#1045b8] sm:hidden" /><GraduationCap size={16} className="mb-2 text-[#1045b8] hidden sm:block" /><span className="block text-xs font-black uppercase tracking-wider text-slate-400">Qualification</span> {application.lastQualification}</p>
                    <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 sm:p-4"><BookOpen size={14} className="mb-1 text-[#1045b8] sm:hidden" /><BookOpen size={16} className="mb-2 text-[#1045b8] hidden sm:block" /><span className="block text-xs font-black uppercase tracking-wider text-slate-400">Computer</span> {application.computerProficiency}</p>
                  </div>

                  {application.status === "Approved" && (
                    <Link
                      className="btn-primary btn-press mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-5 py-3 font-black"
                      state={{ activeTab: "idcard", cnic: application.cnic || "" }}
                      to="/admissions"
                    >
                      Download Your ID Card <Download size={16} />
                    </Link>
                  )}
                </article>
              );
            })}

            {!applications.length && (
              <div className="p-8 text-center sm:p-10 md:p-12">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-[#1045b8]/10 text-[#1045b8] dark:text-blue-300 sm:h-16 sm:w-16">
                  <GraduationCap size={26} className="sm:hidden" />
                  <GraduationCap size={30} className="hidden sm:block" />
                </div>
                <p className="mt-4 text-base font-black text-slate-700 dark:text-slate-300 sm:text-lg md:text-xl">No admission application submitted yet.</p>
                <Link className="btn-primary btn-press mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-5 py-3 font-black" to="/admission">
                  Apply for admission <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export default StudentDashboard;
