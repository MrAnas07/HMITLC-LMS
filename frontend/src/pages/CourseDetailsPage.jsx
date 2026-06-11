import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Home,
  Lightbulb,
  ListChecks
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then(({ data }) => setCourse(data.course))
      .catch((error) => setMessage(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#1045b8] border-t-transparent sm:h-12 sm:w-12" />
          <p className="mt-3 text-xs font-semibold text-slate-500 sm:mt-4 sm:text-sm">Loading course...</p>
        </motion.div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <p className="text-base font-black text-slate-700 sm:text-lg dark:text-slate-200">{message || "Course not found"}</p>
          <Link
            to="/courses"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[#1045b8] px-6 text-sm font-bold text-white transition hover:bg-[#0d3b8e]"
          >
            <ArrowLeft size={16} /> Back to Courses
          </Link>
        </motion.div>
      </section>
    );
  }

  const isCourseFull = course.seatsAvailable === 0;
  const teacherInitial = course.teacher?.name?.charAt(0) || "T";

  return (
    <section className="page-enter relative isolate min-h-screen bg-white dark:bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />

      {/* Hero Section */}
      <div className="px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-12 md:px-8 md:pt-12 md:pb-14 lg:px-10 lg:pt-14 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">

            {/* Left Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideFromLeft}
              className="order-2 md:order-1"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold tracking-wide text-[#1045b8] sm:mb-4 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs dark:bg-blue-900/30 dark:text-blue-400"
              >
                <Home size={12} /> {course.category}
              </motion.span>

              <h1
                className="mb-2 text-xl font-black text-slate-950 sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.8rem] dark:text-white"
                style={{ lineHeight: "1.4" }}
              >
                {course.title}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:mt-4 sm:text-base md:text-lg dark:text-slate-400"
              >
                {course.description?.length > 160
                  ? course.description.slice(0, 160) + "..."
                  : course.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="mt-5 grid max-w-md grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:mt-8 md:gap-5"
              >
                <motion.div variants={staggerItem} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4 md:p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1045b8] sm:text-xs dark:text-blue-400">
                    <Clock size={14} /> Duration
                  </div>
                  <p className="mt-1.5 text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">
                    {course.duration || "N/A"}
                  </p>
                </motion.div>
                <motion.div variants={staggerItem} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4 md:p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1045b8] sm:text-xs dark:text-blue-400">
                    <ListChecks size={14} /> Weekly Hours
                  </div>
                  <p className="mt-1.5 text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">
                    {course.weeklyHours || "N/A"}
                  </p>
                </motion.div>
              </motion.div>

              {/* Course Incharge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-5 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:mt-6 sm:gap-4 sm:rounded-2xl sm:p-4 md:mt-8 md:p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1045b8] text-sm font-black text-white shadow-lg sm:h-12 sm:w-12 sm:text-base md:h-14 md:w-14 md:text-lg">
                  {course.teacher?.avatarUrl ? (
                    <img
                      src={course.teacher.avatarUrl}
                      alt={course.teacher.name}
                      className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12 md:h-14 md:w-14"
                    />
                  ) : (
                    teacherInitial
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 sm:text-xs dark:text-slate-400">Course Incharge</p>
                  <p className="text-sm font-black text-slate-950 sm:text-base md:text-lg dark:text-white">
                    {course.teacher?.name || "N/A"}
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8"
              >
                {user?.role === "student" ? (
                  isCourseFull ? (
                    <span className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gray-400 px-6 text-sm font-bold text-white opacity-60 cursor-not-allowed sm:w-auto">
                      Admissions Closed
                    </span>
                  ) : (
                    <Link
                      to={`/admission?course=${course._id}`}
                      className="btn-neon-blue inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#1045b8] sm:w-auto"
                    >
                      Register Now <ArrowRight size={16} />
                    </Link>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="btn-neon-blue inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#1045b8] sm:w-auto"
                  >
                    Login as Student <ArrowRight size={16} />
                  </Link>
                )}
                <Link
                  to="/courses"
                  className="btn-neon-green inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-emerald-600 sm:w-auto"
                >
                  <ArrowLeft size={16} /> Back to Courses
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Course Thumbnail */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideFromRight}
              className="order-1 md:order-2"
            >
              <div className="w-full max-w-md mx-auto md:max-w-none">
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  src={course.thumbnailUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"}
                  alt={course.title}
                  className="w-full rounded-2xl object-cover shadow-xl shadow-blue-900/10 sm:rounded-3xl sm:shadow-2xl sm:shadow-blue-900/20 aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl space-y-5 px-4 pb-12 sm:space-y-6 sm:px-6 sm:pb-16 md:space-y-8 md:px-8 md:pb-20 lg:px-10">

        {/* Prerequisites */}
        {course.prerequisites && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg md:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/80 p-4 sm:gap-3 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-950/40">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600 sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle2 size={16} />
              </span>
              <h2 className="text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">Prerequisites</h2>
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                {course.prerequisites}
              </p>
            </div>
          </motion.div>
        )}

        {/* Course Description */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg md:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/80 p-4 sm:gap-3 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-950/40">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#1045b8] sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10 dark:bg-blue-900/30 dark:text-blue-400">
              <BookOpen size={16} />
            </span>
            <h2 className="text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">Course Description</h2>
          </div>
          <div className="p-4 sm:p-5 md:p-6">
            <p className="text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
              {course.description}
            </p>
          </div>
        </motion.div>

        {/* What You Will Learn */}
        {course.learningOutcomes?.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white shadow-md sm:rounded-3xl sm:shadow-lg md:shadow-xl dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-900 dark:shadow-none"
          >
            <div className="flex items-center gap-2.5 border-b border-emerald-100 bg-emerald-50/60 p-4 sm:gap-3 sm:p-5 md:p-6 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600 sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Lightbulb size={16} />
              </span>
              <h2 className="text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">What You Will Learn</h2>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-2 p-4 sm:space-y-2.5 sm:p-5 md:space-y-3 md:p-6"
            >
              {course.learningOutcomes.map((outcome, idx) => (
                <motion.div
                  variants={staggerItem}
                  className="flex items-start gap-2.5 rounded-xl bg-white/80 p-3 sm:gap-3 sm:p-3.5 md:p-4 dark:bg-slate-800/50"
                  key={idx}
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700 md:text-base dark:text-slate-200">{outcome}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Course Outline */}
        {course.courseOutline?.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg md:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/80 p-4 sm:gap-3 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-950/40">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#1045b8] sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10 dark:bg-blue-900/30 dark:text-blue-400">
                <GraduationCap size={16} />
              </span>
              <h2 className="text-base font-black text-slate-950 sm:text-lg md:text-xl dark:text-white">Course Outline</h2>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4 p-4 sm:space-y-5 sm:p-5 md:space-y-6 md:p-6"
            >
              {course.courseOutline.map((module, mIdx) => (
                <motion.div
                  variants={staggerItem}
                  className="border-l-2 border-[#1045b8] pl-3 sm:border-l-3 sm:pl-4 md:border-l-4 md:pl-6"
                  key={mIdx}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1045b8] text-xs font-black text-white sm:h-8 sm:w-8 md:h-9 md:w-9 md:text-sm">
                      {mIdx + 1}
                    </span>
                    <h3 className="text-sm font-black text-slate-950 sm:text-base md:text-lg dark:text-white">{module.title}</h3>
                  </div>
                  {module.topics?.length > 0 && (
                    <div className="mt-2 ml-9 space-y-1.5 sm:mt-2.5 sm:ml-10 sm:space-y-2 md:mt-3 md:ml-12">
                      {module.topics.map((topic, tIdx) => (
                        <div className="flex items-start gap-2 sm:gap-2.5" key={tIdx}>
                          <ArrowRight size={14} className="mt-1 shrink-0 text-[#1045b8]" />
                          <span className="text-sm text-slate-600 md:text-base dark:text-slate-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Admissions Closed Banner */}
        {isCourseFull && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-center sm:rounded-3xl sm:p-5 md:p-6 dark:border-red-900/40 dark:bg-red-950/30"
          >
            <p className="text-base font-black text-red-700 sm:text-lg md:text-xl dark:text-red-400">Admissions Closed</p>
            <p className="mt-1 text-sm text-red-600 sm:text-base dark:text-red-300">
              This course is full. New admissions will open when admin adds more seats.
            </p>
          </motion.div>
        )}

        {message && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm font-semibold text-slate-700 sm:rounded-2xl sm:p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseDetailsPage;
