import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Camera,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  FileText,
  FileQuestion,
  GraduationCap,
  ImageIcon,
  Layers,
  List,
  ListChecks,
  PenLine,
  Plus,
  Save,
  Tag,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AttendanceCourseSelector from "../components/AttendanceCourseSelector";
import TeacherQuizForm from "./TeacherQuizForm";
import QuizListManager from "./QuizListManager";

const initialCourse = {
  title: "",
  description: "",
  category: "Web Development",
  level: "Beginner",
  duration: "12 weeks",
  weeklyHours: "4 hours",
  price: 0,
  prerequisites: "",
  learningOutcomes: [],
  courseOutline: [],
  isPublished: true
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [dashboard, setDashboard] = useState({ courses: [], admissions: [] });
  const [form, setForm] = useState(initialCourse);
  const [files, setFiles] = useState({ thumbnail: null });
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([
    "Web Development", "Mobile Development", "Cloud Computing",
    "Cybersecurity", "Data Science", "AI and Machine Learning",
    "DevOps", "UI/UX Design"
  ]);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [levelOptions, setLevelOptions] = useState(["Beginner", "Intermediate", "Advanced"]);
  const [customLevel, setCustomLevel] = useState("");
  const [showCustomLevel, setShowCustomLevel] = useState(false);

  const loadDashboard = () => {
    api
      .get("/users/dashboard")
      .then(({ data }) => setDashboard(data))
      .catch((error) => setMessage(getErrorMessage(error)));
  };

  useEffect(loadDashboard, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "learningOutcomes" || key === "courseOutline") {
          payload.append(key, JSON.stringify(value));
        } else {
          payload.append(key, value);
        }
      });
      if (files.thumbnail) payload.append("thumbnail", files.thumbnail);

      if (editingId) {
        await api.patch(`/courses/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/courses", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setForm(initialCourse);
      setFiles({ thumbnail: null });
      setEditingId("");
      loadDashboard();
      setMessage("Course saved.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const edit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration || "12 weeks",
      weeklyHours: course.weeklyHours || "4 hours",
      price: course.price,
      prerequisites: course.prerequisites || "",
      learningOutcomes: course.learningOutcomes || [],
      courseOutline: course.courseOutline || [],
      isPublished: course.isPublished
    });
  };

  const remove = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      loadDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const teacherStats = [
    {
      label: "All Courses",
      value: dashboard.courses?.length || 0,
      Icon: BookOpen
    },
    {
      label: "My Courses",
      value: dashboard.myCourses?.length || 0,
      Icon: BookOpen
    },
    {
      label: "Applications",
      value: dashboard.admissions?.length || 0,
      Icon: ClipboardList
    },
    {
      label: "Published",
      value: dashboard.courses?.filter((course) => course.isPublished).length || 0,
      Icon: CheckCircle2
    }
  ];

  return (
    <section className="dashboard-soft page-enter relative isolate min-h-screen overflow-hidden bg-white pb-10 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white dark:bg-slate-950" />

      <section className="relative isolate overflow-hidden bg-white px-4 py-12 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]"></div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-black tracking-widest text-[#1045b8] shadow-sm backdrop-blur animate-fade-in-up dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200">
            <span>⭐</span>
            <span>Teacher Portal</span>
            <span>⭐</span>
          </div>
          <h1 className="mb-6 text-3xl font-black leading-tight animate-fade-in-up delay-100 text-slate-950 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Teacher <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-base text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl animate-fade-in-up delay-200">
            Manage your courses, students and track learning progress.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button
              onClick={() => setActiveTab("courses")}
              className={`btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition sm:px-6 sm:py-2.5 sm:text-sm ${
                activeTab === "courses"
                  ? "bg-[#1045b8] text-white shadow-lg shadow-blue-900/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#1045b8]/40 hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
              type="button"
            >
              <BookOpen size={16} />
              Courses
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition sm:px-6 sm:py-2.5 sm:text-sm ${
                activeTab === "attendance"
                  ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-green-500/40 hover:text-green-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
              type="button"
            >
              <BarChart3 size={16} />
              Attendance Report
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition sm:px-6 sm:py-2.5 sm:text-sm ${
                activeTab === "quiz"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-red-500/40 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
              type="button"
            >
              <FileQuestion size={16} />
              Create Quiz
            </button>
          </div>
        </div>
      </section>

      {activeTab === "attendance" ? (
        <AttendanceCourseSelector
          userRole="teacher"
          onBack={() => setActiveTab("courses")}
        />
      ) : activeTab === "quiz" ? (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-8">
          <QuizTabPanel userRole={user?.role} />
        </div>
      ) : (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-4 text-slate-950 shadow-xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-white sm:p-5 md:p-6">
          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 sm:p-5 md:p-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Current Course</p>
              <p className="mt-3 break-ways text-xl font-black sm:text-2xl">{form.title || "New course draft"}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
                {editingId ? "Editing existing course" : "Ready to create"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {teacherStats.map(({ label, value, Icon }) => (
            <div className="card-animate hover-lift rounded-3xl border border-slate-200 bg-white/85 p-4 text-slate-950 shadow-xl shadow-blue-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:text-white sm:p-5 md:p-6" key={label}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-200">
                  <Icon size={21} />
                </span>
              </div>
              <p className="mt-5 text-3xl font-black sm:text-4xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate("/scan-attendance")}
            className="btn-press card-animate hover-lift w-full min-h-[44px] rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 text-left sm:p-5"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="mb-0 text-3xl">📷</div>
              <div>
                <div className="text-sm font-black text-green-700">QR Attendance Scanner</div>
                <div className="mt-0.5 text-xs text-slate-500">Scan student ID cards to mark attendance</div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:flex lg:flex-row">
          <form className="h-fit w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:max-w-[430px]" onSubmit={submit}>
            <div className="border-b border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:p-5 md:p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1045b8]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1045b8] dark:text-blue-300">
                {editingId ? <PenLine size={14} /> : <Plus size={14} />} {editingId ? "Edit course" : "Add course"}
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
                {editingId ? "Update course details" : "Create a course"}
              </h2>
            </div>

            <div className="space-y-4 p-4 sm:p-5 md:p-6">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <BookOpen size={15} /> Course title
                </span>
                <input className="input input-animate min-h-[44px]" placeholder="Course title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <FileText size={15} /> Description
                </span>
                <textarea className="input input-animate min-h-32" placeholder="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <Tag size={15} /> Category
                  </span>
                  <select className="input input-animate min-h-[44px]" value={form.category} onChange={(event) => {
                    if (event.target.value === "custom") {
                      setShowCustomCategory(true);
                    } else {
                      setShowCustomCategory(false);
                      setForm((prev) => ({ ...prev, category: event.target.value }));
                    }
                  }}>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="custom">+ Add Custom Category</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <Layers size={15} /> Level
                  </span>
                  <select className="input input-animate min-h-[44px]" value={form.level} onChange={(event) => {
                    if (event.target.value === "custom") {
                      setShowCustomLevel(true);
                    } else {
                      setShowCustomLevel(false);
                      setForm((prev) => ({ ...prev, level: event.target.value }));
                    }
                  }}>
                    {levelOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="custom">+ Add Custom Level</option>
                  </select>
                </label>
              </div>

              {showCustomCategory && (
                <div className="flex gap-2">
                  <input
                    className="input input-animate min-h-[44px] flex-1"
                    placeholder="Type custom category..."
                    value={customCategory}
                    onChange={(event) => setCustomCategory(event.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary btn-press min-h-[44px] rounded-xl px-3"
                    onClick={() => {
                      if (customCategory.trim()) {
                        setCategoryOptions((prev) => [...prev, customCategory.trim()]);
                        setForm((prev) => ({ ...prev, category: customCategory.trim() }));
                        setShowCustomCategory(false);
                        setCustomCategory("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              )}

              {showCustomLevel && (
                <div className="flex gap-2">
                  <input
                    className="input input-animate min-h-[44px] flex-1"
                    placeholder="Type custom level..."
                    value={customLevel}
                    onChange={(event) => setCustomLevel(event.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary btn-press min-h-[44px] rounded-xl px-3"
                    onClick={() => {
                      if (customLevel.trim()) {
                        setLevelOptions((prev) => [...prev, customLevel.trim()]);
                        setForm((prev) => ({ ...prev, level: customLevel.trim() }));
                        setShowCustomLevel(false);
                        setCustomLevel("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <Calendar size={15} /> Duration
                  </span>
                  <input className="input input-animate min-h-[44px]" placeholder="e.g. 12 weeks" value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <Clock size={15} /> Weekly Hours
                  </span>
                  <input className="input input-animate min-h-[44px]" placeholder="e.g. 4 hours" value={form.weeklyHours} onChange={(event) => setForm((prev) => ({ ...prev, weeklyHours: event.target.value }))} />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <Tag size={15} /> Price
                </span>
                <input className="input input-animate min-h-[44px]" type="text" value={form.price} placeholder="e.g. FREE or 1500" onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <FileText size={15} /> Prerequisites
                </span>
                <textarea
                  className="input input-animate min-h-20"
                  placeholder="e.g. No prerequisites. Open to beginners who can use phones and computers."
                  value={form.prerequisites}
                  onChange={(event) => setForm((prev) => ({ ...prev, prerequisites: event.target.value }))}
                />
              </label>

              <div className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <ListChecks size={15} /> Learning Outcomes
                </span>
                <div className="mt-2 space-y-2">
                  {(form.learningOutcomes || []).map((item, idx) => (
                    <div className="flex gap-2" key={idx}>
                      <input
                        className="input input-animate min-h-[44px] flex-1"
                        value={item}
                        onChange={(event) => {
                          const updated = [...form.learningOutcomes];
                          updated[idx] = event.target.value;
                          setForm((prev) => ({ ...prev, learningOutcomes: updated }));
                        }}
                        placeholder="e.g. Master Google Sheets/Excel with practical real-world scenarios"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, learningOutcomes: [...(prev.learningOutcomes || []), ""] }))}
                    className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#1045b8] hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <Plus size={16} /> Add Learning Outcome
                  </button>
                </div>
              </div>

              <div className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <GraduationCap size={15} /> Course Outline
                </span>
                <div className="mt-2 space-y-3">
                  {(form.courseOutline || []).map((module, mIdx) => (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70" key={mIdx}>
                      <div className="flex gap-2">
                        <input
                          className="input input-animate min-h-[44px] flex-1"
                          value={module.title}
                          onChange={(event) => {
                            const updated = [...form.courseOutline];
                            updated[mIdx] = { ...updated[mIdx], title: event.target.value };
                            setForm((prev) => ({ ...prev, courseOutline: updated }));
                          }}
                          placeholder="Module title, e.g. Introduction to IT & Spreadsheet Basics"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              courseOutline: prev.courseOutline.filter((_, i) => i !== mIdx)
                            }));
                          }}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-2 ml-2 space-y-1.5 border-l-2 border-[#1045b8]/20 pl-3">
                        {(module.topics || []).map((topic, tIdx) => (
                          <div className="flex gap-2" key={tIdx}>
                            <span className="mt-2.5 text-sm text-[#1045b8]">→</span>
                            <input
                              className="input input-animate min-h-[44px] flex-1"
                              value={topic}
                              onChange={(event) => {
                                const updated = [...form.courseOutline];
                                updated[mIdx].topics[tIdx] = event.target.value;
                                setForm((prev) => ({ ...prev, courseOutline: updated }));
                              }}
                              placeholder="Topic, e.g. What is Information Technology"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...form.courseOutline];
                                updated[mIdx].topics = updated[mIdx].topics.filter((_, i) => i !== tIdx);
                                setForm((prev) => ({ ...prev, courseOutline: updated }));
                              }}
                              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-400 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...form.courseOutline];
                            updated[mIdx].topics = [...(updated[mIdx].topics || []), ""];
                            setForm((prev) => ({ ...prev, courseOutline: updated }));
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#1045b8] hover:underline"
                        >
                          <Plus size={12} /> Add Topic
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({
                      ...prev,
                      courseOutline: [...(prev.courseOutline || []), { title: "", topics: [""] }]
                    }))}
                    className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#1045b8] hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <Plus size={16} /> Add Module
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                  <ImageIcon size={15} /> Thumbnail image
                </span>
                <input className="input input-animate min-h-[44px]" accept="image/*" type="file" onChange={(event) => setFiles((prev) => ({ ...prev, thumbnail: event.target.files?.[0] || null }))} />
              </label>

              <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <span>
                  <span className="block text-sm font-black text-slate-800 dark:text-slate-100">Published</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Visible in course listings</span>
                </span>
                <span className="relative inline-flex items-center">
                  <input checked={form.isPublished} className="peer sr-only" type="checkbox" onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.checked }))} />
                  <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#1045b8] dark:bg-slate-700" />
                  <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>

              {message && (
                <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {message}
                </p>
              )}

              <button className="btn-primary btn-press w-full min-h-[44px] rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] py-3 font-black" type="submit">
                {editingId ? <Save size={16} /> : <Plus size={16} />} Save course
              </button>
            </div>
          </form>

          <div className="w-full space-y-6 lg:flex-1">
            {/* Course Library */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:p-6">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#1045b8] dark:text-blue-300">
                    <BookOpen size={16} /> Course Library
                  </p>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">All Institutional Courses</h2>
                </div>
                <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {dashboard.courses?.length || 0} total
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dashboard.courses?.map((course) => {
                  const isMyCourse = course.teacher && course.teacher._id === user?.id;
                  return (
                  <div key={course._id} className="p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1045b8]/10 text-[#1045b8] dark:bg-blue-500/10 dark:text-blue-300">
                            <BookOpen size={16} />
                          </span>
                          <p className="truncate text-base font-black text-slate-950 dark:text-white">{course.title}</p>
                          {isMyCourse ? (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              My Course
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                              {course.teacher?.name || "Staff"}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 ml-11 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {course.category} · {course.level} · {course.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-11 sm:ml-0">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                          course.isPublished
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {course.isPublished ? "Live" : "Draft"}
                        </span>
                        {isMyCourse ? (
                          <>
                            <button className="btn-press inline-flex items-center gap-1.5 rounded-xl bg-[#1045b8] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d3b8e] dark:bg-blue-600 dark:hover:bg-blue-700" onClick={() => edit(course)} type="button">
                              <PenLine size={13} /> Edit
                            </button>
                            <button aria-label={`Delete ${course.title}`} className="btn-press inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400" onClick={() => remove(course._id)} type="button">
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            View Only
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}

                {!dashboard.courses?.length && (
                  <div className="p-6 text-center sm:p-8 md:p-10">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#1045b8]/10 text-[#1045b8] dark:text-blue-300">
                      <BookOpen size={30} />
                    </div>
                    <p className="mt-4 text-lg font-black text-slate-700 dark:text-slate-200">No courses in the institution yet.</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create your first course using the form above.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Applications */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:p-6">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#1045b8] dark:text-blue-300">
                    <Users size={16} /> Students
                  </p>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">My Course Applications</h2>
                </div>
                <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {dashboard.admissions?.length || 0} records
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dashboard.admissions?.map((admission) => (
                  <div className="grid gap-3 p-4 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:p-5 md:grid-cols-[1fr_auto] md:items-center" key={admission._id}>
                    <div className="min-w-0">
                      <p className="break-words font-black text-slate-950 dark:text-white">{admission.fullName}</p>
                      <p className="mt-1 break-words font-semibold text-slate-500 dark:text-slate-300">
                        {admission.email} · {admission.selectedCourse?.title || "General Admission"}
                      </p>
                    </div>
                    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                      admission.status === "Approved"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : admission.status === "Rejected"
                          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
                          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                    }`}>
                      {admission.status}
                    </span>
                  </div>
                ))}
                {!dashboard.admissions?.length && (
                  <div className="p-6 text-center sm:p-8 md:p-10">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400/15 text-amber-600">
                      <ClipboardList size={30} />
                    </div>
                    <p className="mt-4 text-lg font-black text-slate-700 dark:text-slate-200">No admission applications yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

const QuizTabPanel = ({ userRole }) => {
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
          Manage Quizzes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "create" ? <TeacherQuizForm /> : <QuizListManager />}
    </div>
  );
};

export default TeacherDashboard;
