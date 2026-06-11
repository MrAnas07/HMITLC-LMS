import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  FileQuestion,
  Filter,
  GraduationCap,
  Key,
  Laptop,
  List,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api/client";
import { showToast } from "../components/Toast";
import AttendanceCourseSelector from "../components/AttendanceCourseSelector";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminTokenManager from "../components/AdminTokenManager";
import TeacherQuizForm from "./TeacherQuizForm";
import QuizListManager from "./QuizListManager";

const statuses = ["All", "Pending", "Approved", "Rejected", "Graduated"];

const statusClass = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  Rejected: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
  Graduated: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
};

const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("admissions");
  const [stats, setStats] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [waStatus, setWaStatus] = useState(null);
  const [waLoading, setWaLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    classTiming: "",
    classDays: [],
    batchName: ""
  });
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/users/dashboard"),
      api.get("/admissions", { params: status !== "All" ? { status } : {} })
    ])
      .then(([statsResponse, admissionsResponse]) => {
        setStats(statsResponse.data);
        setAdmissions(admissionsResponse.data.admissions);
      })
      .catch((error) => setMessage(getErrorMessage(error)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  useEffect(() => {
    let intervalId;

    const checkWA = async () => {
      try {
        const response = await api.get("/admissions/whatsapp/status");
        setWaStatus(response.data);
        if (response.data.isConnected && intervalId) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("WA status error:", error);
      }
    };

    intervalId = setInterval(checkWA, 5000);
    checkWA();

    return () => clearInterval(intervalId);
  }, []);

  const handleWAReset = async () => {
    if (!window.confirm("Reset WhatsApp session? You will need to scan QR again.")) return;
    setWaLoading(true);
    try {
      await api.post("/admissions/whatsapp/reset");
      alert("Session reset! Please restart the backend server, then scan new QR.");
    } catch (error) {
      alert(`Reset failed: ${getErrorMessage(error)}`);
    } finally {
      setWaLoading(false);
    }
  };

  const openApproveModal = (admission) => {
    setSelectedAdmission(admission);
    setScheduleForm({
      classTiming: "",
      classDays: [],
      batchName: ""
    });
    setShowModal(true);
  };

  const toggleDay = (day) => {
    setScheduleForm(prev => ({
      ...prev,
      classDays: prev.classDays.includes(day)
        ? prev.classDays.filter(d => d !== day)
        : [...prev.classDays, day]
    }));
  };

  const handleApprove = async () => {
    if (!scheduleForm.classTiming) {
      showToast("Please enter class timing", "error");
      return;
    }
    if (scheduleForm.classDays.length === 0) {
      showToast("Please select at least one class day", "error");
      return;
    }

    try {
      await api.patch(`/admissions/${selectedAdmission._id}`, {
        status: "Approved",
        decisionNote: "Application approved by admin",
        classTiming: scheduleForm.classTiming,
        classDays: scheduleForm.classDays,
        batchName: scheduleForm.batchName
      });
      setShowModal(false);
      setSelectedAdmission(null);
      load();
      showToast("Application approved with schedule", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleReject = async (id, reason = "") => {
    try {
      await api.patch(`/admissions/${id}`, {
        status: "Rejected",
        decisionNote: reason || "Application rejected by admin",
        rejectionReason: reason
      });
      load();
      showToast("Application rejected", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusUpdatingId(id);
    try {
      const res = await api.put(`/admissions/${id}/status`, { newStatus });
      showToast(res.data.message, "success");
      load();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const adminStats = [
    {
      label: "Total",
      value: stats?.admissions || 0,
      Icon: ClipboardList,
      caption: "Applications"
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      Icon: Clock,
      caption: "Need review"
    },
    {
      label: "Approved",
      value: stats?.approved || 0,
      Icon: CheckCircle2,
      caption: "Scheduled"
    },
    {
      label: "Rejected",
      value: stats?.rejected || 0,
      Icon: XCircle,
      caption: "Declined"
    }
  ];

  const closeApproveModal = () => {
    setShowModal(false);
    setSelectedAdmission(null);
  };

  const approveModal =
    showModal && selectedAdmission && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/70 p-4 sm:p-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="relative z-[101] my-4 sm:my-8 w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 mx-auto"
            >
              <div className="border-b border-slate-100 bg-white/95 p-4 sm:p-6 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1045b8] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                      <Calendar size={14} /> Schedule
                    </span>
                    <h3 className="mt-4 text-xl sm:text-2xl font-black">Assign Class Schedule</h3>
                    <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300 break-words">
                      {selectedAdmission.fullName} · {selectedAdmission.selectedCourse?.title || "General Admission"}
                    </p>
                  </div>
                  <button
                    aria-label="Close schedule modal"
                    onClick={closeApproveModal}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 p-4 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-100">Class Timing *</label>
                  <input
                    className="input input-animate h-11 w-full"
                    placeholder="e.g., 7:00 PM - 9:00 PM"
                    value={scheduleForm.classTiming}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, classTiming: e.target.value }))}
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Example: 10:00 AM - 12:00 PM</p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-black text-slate-800 dark:text-slate-100">Class Days *</label>
                  <div className="flex flex-wrap gap-2">
                    {allDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`btn-press rounded-full border px-3 sm:px-4 py-2.5 min-h-11 text-sm font-black transition ${
                          scheduleForm.classDays.includes(day)
                            ? "border-[#1045b8] bg-[#1045b8] text-white shadow-lg shadow-blue-900/15"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#1045b8]/40 hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-100">Batch Name (Optional)</label>
                  <input
                    className="input input-animate h-11 w-full"
                    placeholder="e.g., DM-2026-A"
                    value={scheduleForm.batchName}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, batchName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/60">
                <button className="btn-secondary btn-press flex-1 rounded-xl min-h-11" onClick={closeApproveModal} type="button">
                  Cancel
                </button>
                <button className="btn-primary btn-press flex-1 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] min-h-11" onClick={handleApprove} type="button">
                  <CheckCircle2 size={16} /> Approve
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
    {approveModal}
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="dashboard-soft page-enter relative isolate min-h-screen overflow-hidden bg-white pb-10 dark:bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white dark:bg-slate-950" />

      <section className="relative isolate overflow-hidden bg-white px-4 sm:px-6 py-16 sm:py-24 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]"></div>
        <div className="relative max-w-5xl mx-auto text-center px-2 sm:px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black tracking-widest text-[#1045b8] shadow-sm backdrop-blur animate-fade-in-up dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 mb-6">
            <span>⭐</span>
            <span>Admin Control Panel</span>
            <span>⭐</span>
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-slate-950 dark:text-white">
            Admissions <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-10 animate-fade-in-up delay-200 px-2">
            Manage admissions, courses, teachers and students from one place.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab("admissions")}
              className={`btn-press inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 min-h-11 text-sm font-black transition ${
                activeTab === "admissions"
                  ? "bg-[#1045b8] text-white shadow-lg shadow-blue-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-[#1045b8]/40 hover:text-[#1045b8] dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <ClipboardList size={16} />
              Admissions
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`btn-press inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 min-h-11 text-sm font-black transition ${
                activeTab === "users"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-purple-500/40 hover:text-purple-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <ShieldCheck size={16} />
              Users
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`btn-press inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 min-h-11 text-sm font-black transition ${
                activeTab === "attendance"
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-green-500/40 hover:text-green-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <BarChart3 size={16} />
              Attendance Report
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`btn-press inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 min-h-11 text-sm font-black transition ${
                activeTab === "quiz"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-red-500/40 hover:text-red-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
              type="button"
            >
              <FileQuestion size={16} />
              Create Quiz
            </button>
          </div>
        </div>
      </section>

      {activeTab === "users" ? (
        <section className="py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
            {/* User Management Section */}
            <AdminUserManagement
              onBack={() => setActiveTab("admissions")}
            />

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700" />

            {/* Token Manager Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-purple-100 p-2 dark:bg-purple-500/10">
                  <Key size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Teacher Invite Codes
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate one-time verification codes for new teacher accounts
                  </p>
                </div>
              </div>
              <AdminTokenManager />
            </div>
          </div>
        </section>
      ) : activeTab === "attendance" ? (
        <AttendanceCourseSelector
          userRole="admin"
          onBack={() => setActiveTab("admissions")}
        />
      ) : activeTab === "quiz" ? (
        <section className="py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <AdminQuizPanel />
          </div>
        </section>
      ) : (
        <>
      {waStatus && (
        <div className="mx-auto mb-6 sm:mb-8 max-w-5xl px-4 sm:px-6">
          <div className={`rounded-3xl border-2 p-4 sm:p-6 shadow-lg ${
            waStatus.isConnected
              ? "border-green-300 bg-green-50"
              : waStatus.qrCode
                ? "border-yellow-300 bg-yellow-50"
                : "border-red-300 bg-red-50"
          }`}>
            <div className="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className={`h-3 w-3 rounded-full ${
                    waStatus.isConnected ? "animate-pulse bg-green-500" : "bg-red-500"
                  }`} />
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    📱 WhatsApp Auto-Pilot Bot
                  </h3>
                  <span className={`rounded-full px-2.5 sm:px-3 py-1 text-xs font-black ${
                    waStatus.isConnected
                      ? "bg-green-200 text-green-800"
                      : waStatus.qrCode
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                  }`}>
                    {waStatus.isConnected ? "✅ CONNECTED" : waStatus.qrCode ? "⏳ SCAN QR" : "❌ DISCONNECTED"}
                  </span>
                </div>

                {waStatus.isConnected ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">
                      ✓ Bot active - automatic messages will be sent to students
                    </p>
                    <p className="text-xs text-green-600">
                      📨 {waStatus.queueLength || 0} messages in queue
                    </p>
                    <p className="mt-2 text-xs text-green-600">
                      ✓ Admission submitted → student ko WhatsApp alert<br />
                      ✓ Admission approved → congratulations message<br />
                      ✓ Admission rejected → rejection reason message
                    </p>
                  </div>
                ) : waStatus.qrCode ? (
                  <div>
                    <p className="mb-1 text-sm font-black text-yellow-700">
                      📲 Scan this QR code with WhatsApp to connect the bot
                    </p>
                    <p className="text-xs leading-relaxed text-yellow-600">
                      1. Open WhatsApp on your phone<br />
                      2. Tap ⋮ Menu → Linked Devices<br />
                      3. Tap "Link a Device"<br />
                      4. Scan the QR code on the right<br />
                      <span className="font-bold">⚡ QR expires in 40 seconds - scan quickly!</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Bot disconnected. Reset session and restart server.
                    </p>
                    <button
                      onClick={handleWAReset}
                      disabled={waLoading}
                      className="btn-press mt-3 rounded-xl bg-red-500 px-4 py-2.5 min-h-11 text-xs font-black text-white transition-all hover:bg-red-600 disabled:opacity-50"
                      type="button"
                    >
                      {waLoading ? "⏳ Resetting..." : "🔄 Reset WhatsApp Session"}
                    </button>
                  </div>
                )}
              </div>

              {!waStatus.isConnected && waStatus.qrCode && (
                <div className="flex-shrink-0 text-center">
                  <div className="inline-block rounded-2xl border-2 border-yellow-400 bg-white p-3 shadow-md">
                    <img
                      src={waStatus.qrCode}
                      alt="WhatsApp QR Code"
                      className="h-40 w-40 sm:h-48 sm:w-48"
                    />
                  </div>
                  <p className="mt-2 text-xs font-bold text-yellow-700">
                    🔄 Auto-refreshes every 5 seconds
                  </p>
                </div>
              )}

              {waStatus.isConnected && (
                <div className="flex-shrink-0 text-center">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-4 border-green-400 bg-green-100 shadow-lg">
                    <span className="text-3xl sm:text-4xl">✅</span>
                  </div>
                  <p className="mt-2 text-xs font-black text-green-700">ACTIVE</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pt-6">
        <label className="block rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
          <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
            <Filter size={14} /> Status Filter
          </span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 min-h-11 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-academy-blue/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        {message && (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {message}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {adminStats.map(({ label, value, Icon, caption }) => (
            <div className="card-animate hover-lift rounded-3xl border border-slate-200 bg-white/85 p-4 sm:p-5 text-slate-950 shadow-xl shadow-blue-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:text-white" key={label}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">{caption}</p>
                </div>
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-200">
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-4 sm:mt-5 text-3xl sm:text-4xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/admin/seats")}
            className="btn-press card-animate hover-lift w-full rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 text-left min-h-11"
            type="button"
          >
            <div className="mb-2 text-3xl">🪑</div>
            <div className="text-sm font-black text-[#1045b8]">Seat Allocation</div>
            <div className="mt-0.5 text-xs text-slate-500">Manage course capacity</div>
          </button>
          <button
            onClick={() => navigate("/scan-attendance")}
            className="btn-press card-animate hover-lift w-full rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-5 text-left min-h-11"
            type="button"
          >
            <div className="mb-2 text-3xl">📷</div>
            <div className="text-sm font-black text-green-700">QR Attendance Scanner</div>
            <div className="mt-0.5 text-xs text-slate-500">Scan student ID cards</div>
          </button>
        </div>

        <div className="mt-6 sm:mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#1045b8] dark:text-blue-300">
                <ClipboardList size={16} /> Applications
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {status === "All" ? "All admission applications" : `${status} admission applications`}
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <BarChart3 size={16} /> {admissions.length} shown
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <p className="m-4 sm:m-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                Loading applications...
              </p>
            )}

            {admissions.map((admission) => (
              <motion.article
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                className="p-4 sm:p-5 md:p-6"
                key={admission._id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl bg-[#1045b8]/10 text-[#1045b8] dark:bg-blue-500/10 dark:text-blue-300">
                        <UserRound size={20} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="break-words text-xl sm:text-2xl font-black text-slate-950 dark:text-white">{admission.fullName}</h3>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-500 dark:text-slate-300">
                          Father: {admission.fatherName} · {admission.selectedCourse?.title || "General Admission"}
                        </p>
                      </div>
                    </div>
                    <span className={`mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black uppercase tracking-wide ${statusClass[admission.status]}`}>
                      {admission.status === "Approved" ? <CheckCircle2 size={15} /> : admission.status === "Rejected" ? <XCircle size={15} /> : admission.status === "Graduated" ? <GraduationCap size={15} /> : <Clock size={15} />}
                      {admission.status}
                    </span>

                    {admission.status !== "Pending" && (
                      <div className="mt-3 flex items-center gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Lifecycle:
                        </label>
                        <select
                          disabled={statusUpdatingId === admission._id}
                          value={admission.status}
                          onChange={(e) => handleStatusUpdate(admission._id, e.target.value)}
                          className={`rounded-lg border px-3 py-2 text-xs font-bold cursor-pointer transition dark:bg-slate-800 dark:text-slate-200 ${
                            admission.status === "Approved"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : admission.status === "Graduated"
                              ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                              : admission.status === "Rejected"
                              ? "border-red-300 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                              : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                          }`}
                        >
                          {statusUpdatingId === admission._id ? (
                            <option>Updating...</option>
                          ) : (
                            <>
                              <option value="Pending">⏳ Pending</option>
                              <option value="Approved">✅ Approved</option>
                              <option value="Graduated">🎓 Graduated</option>
                              <option value="Rejected">❌ Rejected</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}
                  </div>

                  {admission.status === "Pending" && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button className="btn-primary btn-press rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] min-h-11 px-4 py-2.5" onClick={() => openApproveModal(admission)} type="button">
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      {rejectingId === admission._id ? (
                        <div className="mt-2 flex flex-col gap-2">
                          <textarea
                            value={rejectionReason}
                            onChange={(event) => setRejectionReason(event.target.value)}
                            placeholder="Rejection reason (e.g. CNIC image clear nahi hai)..."
                            className="input-animate w-full resize-none rounded-xl border border-red-200 px-3 py-2.5 text-sm min-h-11 focus:border-red-400 focus:outline-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              className="btn-press flex-1 rounded-xl bg-red-500 px-3 py-2.5 min-h-11 text-xs font-black text-white"
                              onClick={() => {
                                handleReject(admission._id, rejectionReason);
                                setRejectingId(null);
                                setRejectionReason("");
                              }}
                              type="button"
                            >
                              <XCircle size={14} /> Confirm Reject
                            </button>
                            <button
                              className="btn-press flex-1 rounded-xl bg-slate-200 px-3 py-2.5 min-h-11 text-xs font-black text-slate-700"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectionReason("");
                              }}
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn-press rounded-xl bg-red-100 px-3 py-2.5 min-h-11 text-xs font-black text-red-700 hover:bg-red-200" onClick={() => setRejectingId(admission._id)} type="button">
                          <XCircle size={16} /> Reject
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {admission.status === "Approved" && admission.classTiming && (
                  <div className="mt-4 sm:mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                    <h4 className="flex items-center gap-2 text-base font-black text-emerald-800 dark:text-emerald-200">
                      <Calendar size={18} /> Assigned Class Schedule
                    </h4>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                      <p className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/50"><Clock size={15} className="mb-2" /> {admission.classTiming}</p>
                      <p className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/50"><Calendar size={15} className="mb-2" /> {admission.classDays?.join(", ")}</p>
                      <p className="rounded-2xl bg-white/70 p-3 dark:bg-slate-900/50"><GraduationCap size={15} className="mb-2" /> {admission.batchName || "Batch not set"}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <p className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Mail size={16} className="mb-2 text-[#1045b8]" /> <span className="break-words">{admission.email}</span></p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Phone size={16} className="mb-2 text-[#1045b8]" /> {admission.phone}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Phone size={16} className="mb-2 text-[#1045b8]" /> Father: {admission.fatherPhone}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Calendar size={16} className="mb-2 text-[#1045b8]" /> DOB: {new Date(admission.dateOfBirth).toLocaleDateString()}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><UserRound size={16} className="mb-2 text-[#1045b8]" /> CNIC: {admission.cnic}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Users size={16} className="mb-2 text-[#1045b8]" /> Father CNIC: {admission.fatherCnic}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><GraduationCap size={16} className="mb-2 text-[#1045b8]" /> {admission.lastQualification}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Laptop size={16} className="mb-2 text-[#1045b8]" /> Computer: {admission.computerProficiency}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Laptop size={16} className="mb-2 text-[#1045b8]" /> Laptop: {admission.hasLaptop ? "Yes" : "No"}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><ShieldCheck size={16} className="mb-2 text-[#1045b8]" /> Referral: {admission.referralSource}</p>
                  <p className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><Wallet size={16} className="mb-2 text-[#1045b8]" /> Fee: {admission.selectedCourse?.price ? `Rs ${admission.selectedCourse.price}` : "Free/Not set"}</p>
                  <p className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 sm:col-span-2 xl:col-span-3"><MapPin size={16} className="mb-2 text-[#1045b8]" /> <span className="break-words">{admission.address}</span></p>
                </div>
              </motion.article>
            ))}

            {!loading && !admissions.length && (
              <div className="m-4 sm:m-5 rounded-3xl border border-dashed border-[#1045b8]/30 bg-slate-50 p-8 sm:p-10 text-center dark:bg-slate-950/40">
                <div className="mx-auto grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-3xl bg-[#1045b8]/10 text-[#1045b8] dark:text-blue-300">
                  <ClipboardList size={28} />
                </div>
                <p className="mt-4 text-base sm:text-lg font-black text-slate-700 dark:text-slate-200">No applications found for this status.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
      )}
    </motion.section>

    {/* HIDDEN FACTORY RESET - Double-click to activate */}
    <AdminFactoryReset />

    </>
  );
};

const AdminFactoryReset = () => {
  const [showModal, setShowModal] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSystemReset = async (e) => {
    e.preventDefault();

    const doubleCheck = window.confirm(
      "ATTENTION: Are you sure you want to wipe ALL website data? This cannot be undone!"
    );
    if (!doubleCheck) return;

    setLoading(true);
    try {
      const res = await api.post("/admin/factory-reset", {
        masterSecurityKey: secretKeyInput,
      });
      if (res.data.success) {
        showToast("System has been reset to factory settings.", "success");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
      setShowModal(false);
      setSecretKeyInput("");
    }
  };

  return (
    <>
      <div className="mt-8 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
        <span
          onDoubleClick={() => setShowModal(true)}
          className="cursor-default select-none text-[10px] text-slate-200 dark:text-slate-800 font-mono"
        >
          HMITLC System Core v2.6.0
        </span>
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-2xl border-t-8 border-red-600 bg-white p-6 shadow-2xl dark:bg-slate-800"
            >
              <h3 className="flex items-center justify-center gap-2 text-lg font-black text-red-600">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> MASTER FACTORY RESET
              </h3>
              <p className="mt-2 text-center text-xs text-slate-500">
                Enter your master secret key to wipe all system data permanently.
              </p>

              <form onSubmit={handleSystemReset} className="mt-4 space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Enter secret key"
                  className="w-full rounded-lg border-2 border-red-200 bg-red-50 p-2.5 text-center font-mono text-sm font-bold tracking-widest text-slate-900 focus:border-red-500 focus:outline-none dark:border-red-500/30 dark:bg-slate-700 dark:text-white"
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSecretKeyInput("");
                    }}
                    className="w-1/2 rounded-lg bg-slate-200 p-2 text-xs font-bold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 rounded-lg bg-red-600 p-2 text-xs font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-30"
                  >
                    {loading ? "Wiping..." : "Wipe Database"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
};

const AdminQuizPanel = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("create")}
          className={`btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition sm:px-6 sm:py-2.5 sm:text-sm ${
            activeTab === "create"
              ? "bg-[#1045b8] text-white shadow-lg shadow-blue-900/20"
              : "border border-slate-200 bg-white text-slate-700 hover:border-[#1045b8]/40 hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          }`}
        >
          <FileText size={16} />
          Create Quiz
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition sm:px-6 sm:py-2.5 sm:text-sm ${
            activeTab === "manage"
              ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
              : "border border-slate-200 bg-white text-slate-700 hover:border-red-500/40 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          }`}
        >
          <List size={16} />
          Manage Quizzes (All Teachers)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "create" ? <TeacherQuizForm /> : <QuizListManager />}
    </div>
  );
};

export default AdminPanel;
