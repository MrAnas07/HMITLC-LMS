import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Key,
  User,
  CreditCard,
  BookOpen,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Lock,
  ShieldAlert,
  X,
  CheckCircle2
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ExamTestingEngine from "./ExamTestingEngine";
import { api, getErrorMessage } from "../api/client";

const QuizEntranceDesk = () => {
  const { user } = useAuth();
  const [examData, setExamData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [admissionData, setAdmissionData] = useState(null);
  const [fetchingAdmission, setFetchingAdmission] = useState(true);

  const [formData, setFormData] = useState({
    studentName: "",
    cnic: "",
    studentId: "",
    courseName: "",
    quizKey: ""
  });

  useEffect(() => {
    const fetchAdmission = async () => {
      if (!user?.id) {
        setFetchingAdmission(false);
        return;
      }
      try {
        const res = await api.get("/admissions/my");
        if (res.data?.admission) {
          const adm = res.data.admission;
          setAdmissionData(adm);
          setFormData((prev) => ({
            ...prev,
            studentName: adm.fullName || "",
            cnic: adm.cnic || "",
            studentId: adm.studentId || "",
            courseName: adm.selectedCourse?.title || ""
          }));
        }
      } catch (err) {
        console.error("Failed to fetch admission:", err);
      }
      setFetchingAdmission(false);
    };
    fetchAdmission();
  }, [user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.studentName || !formData.studentId || !formData.courseName || !formData.quizKey) {
      setError("Please enter the Secret Quiz Key provided by your teacher.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${apiUrl}/quiz/verify-key`, {
        studentName: formData.studentName,
        cnic: formData.cnic,
        studentId: formData.studentId.toUpperCase().trim(),
        courseName: formData.courseName,
        quizKey: formData.quizKey
      });
      if (res.data.success) {
        setExamData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed!");
    }
    setLoading(false);
  };

  if (examData) {
    return (
      <ExamTestingEngine
        examData={examData}
        studentId={formData.studentId}
        studentName={formData.studentName}
      />
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fafc] via-white to-[#f0f4ff] px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center sm:mb-8"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1045b8]/20 bg-[#1045b8]/5 px-3 py-1.5 text-xs font-black tracking-widest text-[#1045b8] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            <Lock size={12} />
            HMITLC Examination Portal
          </span>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
            Verify <span className="bg-gradient-to-r from-[#1045b8] to-[#f59e0b] bg-clip-text text-transparent">Your Identity</span>
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Enter the secret key from your teacher to start the exam
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b]" />

          <form onSubmit={handleVerify} className="p-5 sm:p-7">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  className="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 dark:border-red-500/30 dark:from-red-500/10 dark:to-red-500/5"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-100 dark:bg-red-500/20">
                      <ShieldAlert size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                        Verification Failed
                      </p>
                      <p className="mt-1 text-sm font-semibold text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Student Info Section */}
            <div className="mb-5 space-y-3">
              {fetchingAdmission ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 size={16} className="animate-spin text-[#1045b8]" />
                  <span className="text-xs font-semibold text-slate-500">Loading your data...</span>
                </div>
              ) : !admissionData ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    No admission record found. Please submit an admission first.
                  </p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <User size={12} /> Student Name
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    />
                  </div>

                  {/* CNIC */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <CreditCard size={12} /> CNIC / B-Form
                    </label>
                    <input
                      type="text"
                      value={formData.cnic}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-bold text-slate-700 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    />
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <CreditCard size={12} /> Student ID
                    </label>
                    <input
                      type="text"
                      value={formData.studentId}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-bold text-[#1045b8] cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-blue-400"
                    />
                  </div>

                  {/* Batch */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <GraduationCap size={12} /> Batch (Assigned)
                    </label>
                    <input
                      type="text"
                      value={admissionData?.batchName || "Not assigned"}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-bold text-slate-700 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    />
                  </div>

                  {/* Course */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <BookOpen size={12} /> Course
                    </label>
                    <input
                      type="text"
                      value={formData.courseName}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Secret Key - Only Manual Input */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Key size={12} /> Secret Quiz Key
              </label>
              <input
                type="text"
                placeholder="Enter key from teacher"
                value={formData.quizKey}
                onChange={(e) => setFormData({ ...formData, quizKey: e.target.value })}
                className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-center font-mono text-lg font-black uppercase tracking-[0.25em] text-amber-800 outline-none transition placeholder:text-amber-400 placeholder:tracking-widest placeholder:text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                required
              />
              <p className="mt-2 text-center text-[10px] font-bold text-amber-600/70 dark:text-amber-400/60">
                Ask your teacher for the secret key
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !admissionData || !formData.quizKey}
              className="btn-gradient-slide mt-6 flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-black sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Start Quiz
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizEntranceDesk;
