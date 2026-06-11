import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  BookOpen,
  Key,
  Clock,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";
import { showToast } from "../components/Toast";

const EditQuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    quizKey: "",
    durationInMinutes: 30,
    courseName: "",
    batchName: "",
    isActive: true
  });
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/details/${id}`);
        if (res.data.success) {
          const q = res.data.data;
          setQuizInfo({
            title: q.title,
            quizKey: q.quizKey,
            durationInMinutes: q.durationInMinutes,
            courseName: q.courseName,
            batchName: q.batchName,
            isActive: q.isActive
          });
          setQuestions(q.questions);
        }
      } catch (err) {
        showToast(getErrorMessage(err), "error");
        navigate(-1);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id, navigate]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!quizInfo.title || !quizInfo.quizKey) {
      showToast("Title and Quiz Key are required.", "error");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        showToast(`Question #${i + 1} text is empty.`, "error");
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          showToast(`Question #${i + 1}, Option ${j + 1} is empty.`, "error");
          return;
        }
      }
    }

    setSaving(true);
    try {
      const res = await api.put(`/quiz/update/${id}`, {
        ...quizInfo,
        durationInMinutes: Number(quizInfo.durationInMinutes),
        questions
      });
      if (res.data.success) {
        showToast("Quiz updated successfully!", "success");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#1045b8]" />
        <span className="ml-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Loading quiz...
        </span>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-8 dark:bg-slate-950 sm:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
            Edit <span className="bg-gradient-to-r from-[#1045b8] to-[#f59e0b] bg-clip-text text-transparent">Quiz</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Modify questions, options, and quiz settings
          </p>
        </motion.div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Quiz Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-900 dark:text-white sm:text-lg">
              <BookOpen size={18} className="text-[#1045b8]" /> Quiz Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400">Title</label>
                <input
                  type="text"
                  value={quizInfo.title}
                  onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Key size={12} /> Quiz Key
                </label>
                <input
                  type="text"
                  value={quizInfo.quizKey}
                  onChange={(e) => setQuizInfo({ ...quizInfo, quizKey: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-amber-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Clock size={12} /> Duration (min)
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
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <BookOpen size={12} /> Course
                </label>
                <input
                  type="text"
                  value={quizInfo.courseName}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <GraduationCap size={12} /> Batch
                </label>
                <input
                  type="text"
                  value={quizInfo.batchName}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-bold text-slate-600 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400">Status</label>
                <button
                  type="button"
                  onClick={() => setQuizInfo({ ...quizInfo, isActive: !quizInfo.isActive })}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                    quizInfo.isActive
                      ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {quizInfo.isActive ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {quizInfo.isActive ? "Active (Live)" : "Inactive (Off)"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
                Questions ({questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.05 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Question Header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(expandedQuestion === qIdx ? -1 : qIdx)}
                  className="flex w-full items-center justify-between bg-slate-50 p-4 text-left transition hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1045b8] text-xs font-black text-white sm:h-9 sm:w-9">
                      {qIdx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {q.questionText || `Question #${qIdx + 1}`}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Correct: Option {(q.correctOptionIndex || 0) + 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    {expandedQuestion === qIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Question Body */}
                {expandedQuestion === qIdx && (
                  <div className="space-y-4 border-t border-slate-100 p-4 dark:border-slate-800 sm:p-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Question Text</label>
                      <input
                        type="text"
                        placeholder="Enter your question here..."
                        value={q.questionText}
                        onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-400">
                        Options (Select the correct answer)
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${
                              q.correctOptionIndex === oIdx
                                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctOptionIndex === oIdx}
                              onChange={() => updateQuestion(qIdx, "correctOptionIndex", oIdx)}
                              className="sr-only"
                            />
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${
                                q.correctOptionIndex === oIdx
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <input
                              type="text"
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                              className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                              required
                            />
                            {q.correctOptionIndex === oIdx && (
                              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              disabled={saving}
              className="btn-neon-blue flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black sm:text-lg"
            >
              {saving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </form>
      </div>
    </section>
  );
};

export default EditQuizForm;
