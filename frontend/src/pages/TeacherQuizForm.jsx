import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  Key,
  Clock,
  HelpCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileQuestion,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";

const defaultQuestion = { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 };

const OPTION_LABELS = ["A", "B", "C", "D"];

const TeacherQuizForm = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    quizKey: "",
    durationInMinutes: 30,
    courseName: "",
    batchName: ""
  });
  const [questions, setQuestions] = useState([{ ...defaultQuestion }]);
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses?all=true");
        const data = res.data;
        if (data.courses) {
          let filteredCourses = data.courses.filter((c) => c.isPublished !== false);
          if (user?.role === "teacher") {
            filteredCourses = filteredCourses.filter(
              (c) => c.teacher?._id === user.id || c.teacher === user.id
            );
          }
          setCourses(filteredCourses);
          if (user?.role === "teacher" && filteredCourses.length === 1) {
            setQuizInfo((prev) => ({ ...prev, courseName: filteredCourses[0].title }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, [user]);

  const addQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
    setExpandedQuestion(questions.length);
  };

  const removeQuestion = (idx) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
    if (expandedQuestion >= questions.length - 1) {
      setExpandedQuestion(Math.max(0, questions.length - 2));
    }
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const hasValidQuestions = questions.some(
    (q) =>
      q.questionText.trim() !== "" &&
      q.options.every((opt) => opt.trim() !== "")
  );

  const handleSave = async (e) => {
    e.preventDefault();

    if (!quizInfo.title || !quizInfo.quizKey || !quizInfo.courseName) {
      showToast("Please fill all quiz details.", "error");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        showToast(`Question #${i + 1} text is empty.`, "error");
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          showToast(`Question #${i + 1}, Option ${OPTION_LABELS[j]} is empty.`, "error");
          return;
        }
      }
    }

    setLoading(true);
    try {
      const res = await api.post("/quiz/create", {
        ...quizInfo,
        durationInMinutes: Number(quizInfo.durationInMinutes),
        questions
      });
      showToast(res.data.message, "success");
      setQuizInfo({ title: "", quizKey: "", durationInMinutes: 30, courseName: "", batchName: "" });
      setQuestions([{ ...defaultQuestion }]);
      setExpandedQuestion(0);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
            Create New{" "}
            <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {user?.role === "admin"
              ? "Create quizzes for any course on the platform"
              : "Create quizzes for your assigned courses only"}
          </p>
        </motion.div>

        {/* Teacher restriction */}
        {user?.role === "teacher" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10"
          >
            <AlertCircle size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              You can only create quizzes for courses you are assigned to. Contact admin to get assigned to more courses.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Quiz Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-900 dark:text-white sm:text-lg">
              <BookOpen size={18} className="text-[#1045b8]" /> Quiz Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <FileQuestion size={12} /> Quiz Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTML & CSS Final Quiz"
                  value={quizInfo.title}
                  onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Key size={12} /> Secret Quiz Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTML5"
                  value={quizInfo.quizKey}
                  onChange={(e) => setQuizInfo({ ...quizInfo, quizKey: e.target.value })}
                  className="w-full rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-amber-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Clock size={12} /> Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={quizInfo.durationInMinutes}
                  onChange={(e) => setQuizInfo({ ...quizInfo, durationInMinutes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <BookOpen size={12} /> Course
                  {user?.role === "teacher" && (
                    <span className="ml-1 text-[10px] text-blue-600 dark:text-blue-400">(Your courses only)</span>
                  )}
                </label>
                <select
                  value={quizInfo.courseName}
                  onChange={(e) => setQuizInfo({ ...quizInfo, courseName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                    {user?.role === "teacher"
                      ? "No courses assigned to you yet."
                      : "No courses available."}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <ListChecks size={12} /> Batch / Section ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. CIT-2026-A"
                  value={quizInfo.batchName}
                  onChange={(e) => setQuizInfo({ ...quizInfo, batchName: e.target.value.toUpperCase().trim() })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  Enter the exact batch ID as printed on student ID cards
                </p>
              </div>
            </div>
          </motion.div>

          {/* Questions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#1045b8] text-white">
                  <HelpCircle size={16} />
                </span>
                <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
                  Questions
                </h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {questions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-press inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg"
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {questions.map((q, qIdx) => {
                  const isExpanded = expandedQuestion === qIdx;
                  const isComplete = q.questionText.trim() && q.options.every((o) => o.trim());

                  return (
                    <motion.div
                      key={qIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ delay: qIdx * 0.03 }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* Question Header */}
                      <button
                        type="button"
                        onClick={() => setExpandedQuestion(isExpanded ? -1 : qIdx)}
                        className="flex w-full items-center gap-3 bg-slate-50 p-4 text-left transition hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 sm:p-4"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1045b8] text-xs font-black text-white">
                          {qIdx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {q.questionText || `Question #${qIdx + 1}`}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {q.options.filter((o) => o.trim()).length}/4 options
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              Correct: Option {OPTION_LABELS[q.correctOptionIndex]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(qIdx);
                              }}
                              className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <span className="text-slate-400 dark:text-slate-500">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </div>
                      </button>

                      {/* Question Body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 border-t border-slate-100 p-4 dark:border-slate-800 sm:p-5">
                              <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                  <Lightbulb size={11} /> Question Text
                                </label>
                                <input
                                  type="text"
                                  placeholder="Type your question here..."
                                  value={q.questionText}
                                  onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                  required
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-400">
                                  Options — tap to select correct answer
                                </label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {q.options.map((opt, oIdx) => {
                                    const isCorrect = q.correctOptionIndex === oIdx;
                                    return (
                                      <label
                                        key={oIdx}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                                          isCorrect
                                            ? "border-emerald-400 bg-emerald-50 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`correct_${qIdx}`}
                                          checked={isCorrect}
                                          onChange={() => updateQuestion(qIdx, "correctOptionIndex", oIdx)}
                                          className="sr-only"
                                        />
                                        <span
                                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black transition ${
                                            isCorrect
                                              ? "bg-emerald-500 text-white"
                                              : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                                          }`}
                                        >
                                          {OPTION_LABELS[oIdx]}
                                        </span>
                                        <input
                                          type="text"
                                          placeholder={`Option ${OPTION_LABELS[oIdx]}`}
                                          value={opt}
                                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                          className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                                          required
                                        />
                                        {isCorrect && (
                                          <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                                        )}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Publish Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <button
              type="submit"
              disabled={loading || courses.length === 0 || !hasValidQuestions}
              className="btn-gradient-slide flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black disabled:opacity-40 disabled:cursor-not-allowed sm:text-lg"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {loading ? "Publishing..." : "Publish Quiz"}
            </button>
            {!hasValidQuestions && (
              <p className="mt-2 text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Add at least one question with all options filled to publish
              </p>
            )}
          </motion.div>
        </form>
      </div>
    </section>
  );
};

export default TeacherQuizForm;
