import { Award, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const lessonMinutes = course.lessons?.reduce((sum, lesson) => sum + Number(lesson.durationMinutes || 0), 0);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <img
        alt={course.title}
        className="h-44 w-full object-cover"
        src={
          course.thumbnailUrl ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
        }
      />
      <div className="space-y-4 p-5">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700">{course.category}</span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">{course.level}</span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{course.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Teacher: {course.teacher?.name || "HMITC Faculty"}
          </p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {course.duration || `${lessonMinutes || 0}m`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Award size={14} /> {course.level}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={14} /> {Number(course.averageRating || 0).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-950 dark:text-white">{course.price ? `Rs ${course.price}` : "Free"}</span>
          <Link className="btn-primary" to={`/courses/${course.slug || course._id}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
