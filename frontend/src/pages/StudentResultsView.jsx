import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Calendar,
  FileText,
  Loader2,
  BarChart3,
  AlertTriangle,
  Lock,
  Target,
  Flame,
  Medal,
  TrendingUp,
  Clock
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";

const gradeColor = (pct) => {
  if (pct >= 80) return { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-500/30" };
  if (pct >= 50) return { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-200 dark:ring-blue-500/30" };
  if (pct >= 30) return { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-500/30" };
  return { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", ring: "ring-red-200 dark:ring-red-500/30" };
};

const gradeLabel = (pct) => {
  if (pct >= 80) return "Excellent";
  if (pct >= 50) return "Passed";
  if (pct >= 30) return "Needs Work";
  return "Failed";
};

const gradeEmoji = (pct) => {
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
};

const StudentResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/quiz/my-results");
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 size={32} className="animate-spin text-[#1045b8]" />
          <div className="absolute inset-0 animate-ping rounded-full bg-[#1045b8]/20" />
        </div>
        <span className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">
          Loading your academic records...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/30 dark:bg-red-500/10">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-red-100 dark:bg-red-500/20">
          <XCircle size={24} className="text-red-500" />
        </div>
        <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  const totalQuizzes = results.length;
  const avgScore = totalQuizzes > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalQuizzes) : 0;
  const passedCount = results.filter((r) => r.percentage >= 50).length;
  const failedCount = results.filter((r) => r.percentage < 50).length;
  const totalCheating = results.reduce((s, r) => s + (r.cheatingAttempts || 0), 0);
  const bestScore = totalQuizzes > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

  return (
    <section className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#1045b8]/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white shadow-lg shadow-blue-900/20">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                Academic <span className="bg-gradient-to-r from-[#1045b8] to-[#f59e0b] bg-clip-text text-transparent">Examination Report</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Your complete quiz history, scores, and performance analytics
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Quizzes", value: totalQuizzes, icon: FileText, gradient: "from-[#1045b8] to-blue-600" },
          { label: "Average Score", value: `${avgScore}%`, icon: BarChart3, gradient: "from-[#f59e0b] to-amber-600" },
          { label: "Best Score", value: `${bestScore}%`, icon: Medal, gradient: "from-emerald-500 to-emerald-600" },
          { label: "Passed", value: `${passedCount}/${totalQuizzes}`, icon: Trophy, gradient: "from-violet-500 to-violet-600" }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition group-hover:scale-150 ${card.gradient}" />
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md sm:h-12 sm:w-12`}>
              <card.icon size={20} />
            </div>
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 sm:text-xs">
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Performance Bar */}
      {totalQuizzes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#1045b8]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Performance Overview
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {passedCount} passed / {failedCount} failed
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalQuizzes > 0 ? (passedCount / totalQuizzes) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Passed ({passedCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Failed ({failedCount})
            </span>
            {totalCheating > 0 && (
              <span className="flex items-center gap-1">
                <AlertTriangle size={10} className="text-amber-500" /> {totalCheating} Total Flags
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white sm:text-lg">
                <FileText size={18} className="text-[#1045b8]" /> Quiz Results
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Detailed breakdown of each quiz attempt
              </p>
            </div>
            {totalQuizzes > 0 && (
              <span className="hidden items-center gap-1.5 rounded-full bg-[#1045b8]/10 px-3 py-1.5 text-[10px] font-black text-[#1045b8] dark:bg-blue-500/10 dark:text-blue-300 sm:inline-flex">
                <Flame size={12} /> {totalQuizzes} Total Attempts
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-500">
                <th className="p-4">#</th>
                <th className="p-4">Quiz / Course</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center">Grade</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Security</th>
                <th className="p-4 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50">
                      <FileText size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-base font-black text-slate-600 dark:text-slate-400">
                      No Quiz Results Found
                    </p>
                    <p className="mt-2 max-w-sm mx-auto text-xs text-slate-400 dark:text-slate-500">
                      You haven't taken any quizzes yet. Start a quiz from the Examination Portal to see your results here.
                    </p>
                  </td>
                </tr>
              ) : (
                results.map((r, idx) => {
                  const gc = gradeColor(r.percentage);
                  const passed = r.percentage >= 50;
                  return (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                    >
                      {/* Index */}
                      <td className="p-4">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Quiz Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${gc.bg} ${gc.text}`}>
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {r.quizTitle}
                            </p>
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              {r.courseName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-baseline gap-1">
                          <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                            {r.score}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            /{r.totalQuestions}
                          </span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="p-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${gc.bg} ${gc.text} ring-1 ${gc.ring}`}>
                            {gradeEmoji(r.percentage)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            {r.percentage}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {passed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30">
                            <CheckCircle2 size={10} /> PASSED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30">
                            <XCircle size={10} /> FAILED
                          </span>
                        )}
                      </td>

                      {/* Security */}
                      <td className="p-4 text-center">
                        {r.cheatingAttempts >= 3 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-600 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30">
                            <Lock size={10} /> Terminated
                          </span>
                        ) : r.cheatingAttempts > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30">
                            <AlertTriangle size={10} /> {r.cheatingAttempts} Flag{r.cheatingAttempts > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30">
                            <ShieldCheck size={10} /> Clean
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar size={12} className="text-slate-400" />
                          <span className="font-medium">
                            {new Date(r.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default StudentResultsView;
