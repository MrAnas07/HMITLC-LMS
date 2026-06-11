import { motion } from "framer-motion";
import { ArrowRight, Clock, Star, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const CoursePreviewCard = ({ course, index = 0 }) => (
  <motion.article
    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1045b8] via-blue-500 to-[#f59e0b] p-[1px] shadow-xl shadow-blue-950/10"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
  >
    <div className="h-full overflow-hidden rounded-3xl bg-white dark:bg-slate-900">
      <div className="relative h-52 overflow-hidden">
        <img
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={
            course.thumbnailUrl ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#1045b8] backdrop-blur">
          {course.price ? `Rs ${course.price}` : "Free"}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-[#0d3b8e]">
          {course.level || "Beginner"}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {course.duration || "12 weeks"}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${
              (course.seatsAvailable ?? course.totalSeats ?? 40) === 0
                ? "bg-red-100 text-red-700"
                : (course.seatsAvailable ?? course.totalSeats ?? 40) <= 5
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}>
              {(course.seatsAvailable ?? course.totalSeats ?? 40) === 0
                ? "🔴 Full"
                : (course.seatsAvailable ?? course.totalSeats ?? 40) <= 5
                ? `🟡 ${course.seatsAvailable ?? course.totalSeats ?? 40} left`
                : `🟢 ${course.seatsAvailable ?? course.totalSeats ?? 40} seats`}
            </span>
            <span className="inline-flex items-center gap-1 text-yellow-500">
              <Star fill="currentColor" size={14} /> {Number(course.averageRating || 4.8).toFixed(1)}
            </span>
          </div>
        </div>
        <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {course.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <UserRound size={16} /> {course.teacher?.name || "HMITLC Faculty"}
          </p>
          <Link className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1045b8] text-white transition hover:bg-[#0d3b8e]" to={`/courses/${course.slug || course._id}`}>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  </motion.article>
);

export default CoursePreviewCard;
