import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CoursePreviewCard from "./CoursePreviewCard";

const FeaturedCourses = ({ courses = [] }) => (
  <section className="bg-slate-50 py-20 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1045b8]">Featured Courses</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
            Learn the skills employers actually need.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Explore practical HMITLC programs designed around projects, mentorship, and approved student access.
          </p>
        </div>
        <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-white" to="/courses">
          View all courses <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <CoursePreviewCard course={course} index={index} key={course._id} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCourses;
