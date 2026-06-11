import { motion } from "framer-motion";
import { BookOpenCheck, Filter, GraduationCap, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import CoursePreviewCard from "../components/home/CoursePreviewCard";

const categoriesList = [
  "All",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science",
  "AI and Machine Learning",
  "DevOps",
  "UI/UX Design"
];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [filters, setFilters] = useState({ search: "", category: "All", level: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(["All", ...data.categories.map((category) => category.name)]))
      .catch(() => setCategories(categoriesList));
  }, []);

  useEffect(() => {
    const params = {
      search: filters.search || undefined,
      category: filters.category !== "All" ? filters.category : undefined,
      level: filters.level || undefined
    };

    api
      .get("/courses", { params })
      .then(({ data }) => setCourses(data.courses))
      .catch((error) => setMessage(getErrorMessage(error)));
  }, [filters]);

  const activeFilters = useMemo(
    () => [
      filters.category !== "All" ? filters.category : null,
      filters.level || null,
      filters.search ? `"${filters.search}"` : null
    ].filter(Boolean),
    [filters]
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      <section className="relative isolate overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-[#1045b8] shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles size={14} className="sm:h-4 sm:w-4" /> Professional IT Courses
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl sm:mt-6">
              Explore career-focused{" "}
              <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">
                learning tracks
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg md:mt-5 md:leading-8">
              Browse HMITLC programs, compare levels, check duration, and apply for admission to unlock course content after approval.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 sm:mt-10"
          >
            {[
              [BookOpenCheck, `${courses.length || "20+"}`, "available courses"],
              [GraduationCap, "Approved", "access model"],
              [Filter, "Smart", "search filters"]
            ].map(([Icon, value, label]) => (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-5" key={label}>
                <Icon className="text-[#1045b8]" size={22} />
                <p className="mt-3 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{value}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-5 max-w-7xl px-4 sm:-mt-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_180px]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="input input-animate h-11 w-full rounded-2xl pl-11 sm:h-12"
                placeholder="Search courses, skills, or topics"
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              />
            </label>
            <select
              className="input input-animate h-11 w-full rounded-2xl sm:h-12"
              value={filters.category}
              onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select
              className="input input-animate h-11 w-full rounded-2xl sm:h-12"
              value={filters.level}
              onChange={(event) => setFilters((prev) => ({ ...prev, level: event.target.value }))}
            >
              <option value="">All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {activeFilters.map((item) => (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#1045b8]" key={item}>
                  {item}
                </span>
              ))}
              <button
                className="btn-press rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                onClick={() => setFilters({ search: "", category: "All", level: "" })}
                type="button"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1045b8] sm:text-sm">Course Catalogue</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">Choose your next skill.</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
            Showing {courses.length} {courses.length === 1 ? "course" : "courses"}
          </p>
        </div>

        {message && <p className="mb-5 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700 sm:mb-6 sm:p-4">{message}</p>}

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            {courses.map((course, index) => (
              <CoursePreviewCard course={course} index={index} key={course._id} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-6 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
            <Search className="mx-auto text-slate-400" size={32} />
            <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white sm:text-xl">No courses found</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
              Try changing your search, category, or level filters.
            </p>
          </div>
        )}
      </section>
    </motion.main>
  );
};

export default CoursesPage;
