import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit3,
  Key,
  User,
  BookOpen,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";

const QuizListManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState({});

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quiz/managed");
      if (res.data.success) {
        setQuizzes(res.data.data);
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await api.delete(`/quiz/delete/${id}`);
      if (res.data.success) {
        showToast("Quiz deleted successfully!", "success");
        setQuizzes(quizzes.filter((q) => q._id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setDeleting(false);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz._id);
    setEditForm({
      title: quiz.title,
      quizKey: quiz.quizKey,
      durationInMinutes: quiz.durationInMinutes,
      batchName: quiz.batchName,
      isActive: quiz.isActive
    });
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      const res = await api.put(`/quiz/update/${id}`, editForm);
      if (res.data.success) {
        showToast("Quiz updated successfully!", "success");
        setEditingQuiz(null);
        fetchQuizzes();
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setSaving(false);
  };

  const toggleActive = async (quiz) => {
    try {
      const res = await api.put(`/quiz/update/${quiz._id}`, { isActive: !quiz.isActive });
      if (res.data.success) {
        showToast(quiz.isActive ? "Quiz deactivated" : "Quiz activated", "success");
        fetchQuizzes();
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const toggleKeyVisibility = (id) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#1045b8]" />
        <span className="ml-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Loading quizzes...
        </span>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {user?.role === "admin" ? "All Quizzes" : "My Quizzes"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} total
          </p>
        </div>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <BookOpen size={24} className="text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            No quizzes created yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {editingQuiz === quiz._id ? (
                /* Edit Mode */
                <div className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Edit3 size={16} className="text-[#1045b8]" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">Edit Quiz</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Quiz Key</label>
                      <input
                        type="text"
                        value={editForm.quizKey}
                        onChange={(e) => setEditForm({ ...editForm, quizKey: e.target.value.toUpperCase() })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm font-bold uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Duration (min)</label>
                      <input
                        type="number"
                        min="5"
                        value={editForm.durationInMinutes}
                        onChange={(e) => setEditForm({ ...editForm, durationInMinutes: parseInt(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Batch</label>
                      <input
                        type="text"
                        value={editForm.batchName}
                        onChange={(e) => setEditForm({ ...editForm, batchName: e.target.value.toUpperCase() })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm font-bold uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Status</label>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                          editForm.isActive
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {editForm.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {editForm.isActive ? "Active (Live)" : "Inactive (Off)"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(quiz._id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1045b8] px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingQuiz(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        quiz.isActive
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      }`}>
                        {quiz.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {quiz.title}
                        </h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <BookOpen size={10} /> {quiz.courseName}
                          </span>
                          <span>|</span>
                          <span className="font-mono font-bold text-blue-500">{quiz.batchName}</span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {quiz.durationInMinutes}min
                          </span>
                        </div>
                        {user?.role === "admin" && quiz.createdBy && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                            <User size={10} /> {quiz.createdBy.name} ({quiz.createdBy.email})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quiz Key */}
                      <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 dark:bg-amber-500/10">
                        <Key size={12} className="text-amber-600 dark:text-amber-400" />
                        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400">
                          {showKey[quiz._id] ? quiz.quizKey : "••••••"}
                        </span>
                        <button
                          onClick={() => toggleKeyVisibility(quiz._id)}
                          className="ml-1 text-amber-400 transition hover:text-amber-600"
                        >
                          {showKey[quiz._id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>

                      {/* Toggle Active */}
                      <button
                        onClick={() => toggleActive(quiz)}
                        className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black transition ${
                          quiz.isActive
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {quiz.isActive ? "ON" : "OFF"}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400"
                        title="Edit Quiz"
                      >
                        <Edit3 size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirm(quiz)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                        title="Delete Quiz"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-center text-lg font-black text-slate-900 dark:text-white">
                Delete Quiz?
              </h3>
              <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-300">"{deleteConfirm.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={14} className="mx-auto animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default QuizListManager;
