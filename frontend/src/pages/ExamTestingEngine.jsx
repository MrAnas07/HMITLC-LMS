import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  ShieldAlert,
  User,
  CreditCard,
  BookOpen,
  ChevronRight,
  Lock
} from "lucide-react";
import axios from "axios";
import { showToast } from "../components/Toast";

const ExamTestingEngine = ({ examData, studentId, studentName }) => {
  const [index, setIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData.durationInMinutes * 60);
  const [cheatingAttempts, setCheatingAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goFullScreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen().catch(() => {});
  }, []);

  const submitTest = useCallback(async (forced = false) => {
    if (submitted) return;
    setSubmitted(true);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/quiz/submit`, {
        quizId: examData.quizId,
        studentId,
        answers: selectedAnswers,
        cheatingCount: forced ? 3 : cheatingAttempts
      });
      if (forced) {
        showToast("Test auto-submitted due to security policy breach.", "error");
      } else {
        showToast("Quiz submitted successfully!", "success");
      }
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Submission failed", "error");
      setSubmitted(false);
    }
  }, [examData.quizId, studentId, selectedAnswers, cheatingAttempts, submitted]);

  useEffect(() => {
    goFullScreen();

    const checkTabChange = () => {
      if (document.hidden) {
        setCheatingAttempts((prev) => {
          const next = prev + 1;
          setWarningMsg(`Tab switch detected! Warning ${next}/3 — Auto-submit on 3rd strike`);
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 4000);
          if (next >= 3) submitTest(true);
          return next;
        });
      }
    };

    const checkFullScreenExit = () => {
      if (!document.fullscreenElement && !submitted) {
        setCheatingAttempts((prev) => {
          const next = prev + 1;
          setWarningMsg(`Fullscreen exit attempt blocked! Warning ${next}/3 — Auto-submit on 3rd strike`);
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 4000);
          // Instant re-lock within 100ms
          setTimeout(() => {
            goFullScreen();
          }, 100);
          if (next >= 3) submitTest(true);
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", checkTabChange);
    document.addEventListener("fullscreenchange", checkFullScreenExit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", checkTabChange);
      document.removeEventListener("fullscreenchange", checkFullScreenExit);
      clearInterval(timer);
    };
  }, [goFullScreen, submitTest, submitted]);

  const currentQ = examData.questions[index];
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = examData.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isOptionSelected = selectedAnswers[currentQ._id] !== undefined;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Warning Overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-x-0 top-0 z-[100] bg-gradient-to-r from-red-600 to-red-700 p-4 text-center text-sm font-black shadow-2xl"
          >
            <div className="flex items-center justify-center gap-2">
              <ShieldAlert size={18} />
              {warningMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="shrink-0 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white shadow-lg shadow-blue-900/30">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white sm:text-base">{examData.title}</h3>
              <div className="mt-0.5 flex items-center gap-3 text-[10px] text-slate-400 sm:text-xs">
                <span className="flex items-center gap-1">
                  <User size={10} /> {studentName}
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1">
                  <CreditCard size={10} /> <span className="font-mono text-blue-400">{studentId}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Answered Counter */}
            <div className="hidden items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-[10px] font-bold text-slate-400 sm:flex">
              <CheckCircle2 size={12} className="text-emerald-500" />
              {answeredCount}/{totalQuestions}
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-mono font-bold ${
              timeLeft < 300
                ? "bg-red-600/20 text-red-400 animate-pulse ring-1 ring-red-500/30"
                : "bg-slate-800 text-white"
            }`}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>

            {/* Lock Icon */}
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <Lock size={14} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1045b8] to-[#f59e0b]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {/* Question Number Badge */}
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1045b8]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1045b8] dark:text-blue-300">
              Question {index + 1} of {totalQuestions}
            </span>
            {isOptionSelected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 size={10} /> Selected
              </span>
            )}
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur sm:p-7"
            >
              {/* Question Text */}
              <h2 className="mb-6 text-base font-semibold leading-relaxed text-white sm:text-lg">
                {currentQ.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => (
                  <motion.button
                    key={oIdx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQ._id]: oIdx })}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition sm:p-5 ${
                      selectedAnswers[currentQ._id] === oIdx
                        ? "border-[#1045b8] bg-[#1045b8]/10 shadow-lg shadow-blue-900/20"
                        : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-black transition ${
                      selectedAnswers[currentQ._id] === oIdx
                        ? "bg-[#1045b8] text-white"
                        : "bg-slate-700 text-slate-400"
                    }`}>
                      {optionLabels[oIdx]}
                    </span>
                    <span className={`text-sm font-semibold transition ${
                      selectedAnswers[currentQ._id] === oIdx ? "text-white" : "text-slate-300"
                    }`}>
                      {opt}
                    </span>
                    {selectedAnswers[currentQ._id] === oIdx && (
                      <CheckCircle2 size={18} className="ml-auto shrink-0 text-[#1045b8]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-end">
            {index === totalQuestions - 1 ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={!isOptionSelected}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={16} /> Finish & Submit
              </button>
            ) : (
              <button
                onClick={() => setIndex(index + 1)}
                disabled={!isOptionSelected}
                className="flex items-center gap-2 rounded-xl bg-[#1045b8] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-800/50 py-2 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          HMITLC Secure Examination Engine
        </p>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-500/10">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-white">Submit Quiz?</h3>
              <p className="mt-2 text-sm text-slate-400">
                You have answered {answeredCount} of {totalQuestions} questions.
                {answeredCount < totalQuestions && (
                  <span className="mt-1 block text-amber-400">
                    {totalQuestions - answeredCount} question(s) unanswered!
                  </span>
                )}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-700"
                >
                  Review
                </button>
                <button
                  onClick={() => {
                    setShowSubmitConfirm(false);
                    submitTest(false);
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500"
                >
                  Confirm Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamTestingEngine;
