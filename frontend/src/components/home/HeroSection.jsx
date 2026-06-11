import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CountUp from "./CountUp";
import { heroStats, trustPoints } from "./sectionData";

const HeroSection = () => (
  <section className="relative isolate overflow-hidden bg-white dark:bg-slate-950">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,69,184,0.18),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,rgba(248,250,252,0.75))] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.13),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
      className="absolute right-10 top-24 hidden h-36 w-36 rounded-full bg-gradient-to-br from-yellow-300/40 to-orange-400/20 blur-2xl lg:block"
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
      className="absolute bottom-16 left-8 hidden h-44 w-44 rounded-full bg-gradient-to-br from-[#1045b8]/30 to-cyan-300/20 blur-3xl lg:block"
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-3xl"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-[#1045b8] shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200">
          <Sparkles size={16} /> HMITLC Premium IT Learning
        </span>
        <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          Build Your Future with{" "}
          <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">
            Professional IT Skills
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Apply for admission, learn with expert instructors, and unlock course content after approval through a secure institute management system.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl" to="/admission">
            Apply For Admission <ArrowRight size={18} />
          </Link>
          <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3 text-sm font-black text-slate-800 shadow-lg backdrop-blur transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white" to="/courses">
            <PlayCircle size={18} /> Explore Courses
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {heroStats.map((item) => (
            <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70" key={item.label}>
              <p className="text-2xl font-black text-slate-950 dark:text-white">
                <CountUp value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.12 }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-2xl shadow-blue-950/20">
          <img
            alt="Students learning professional IT skills"
            className="h-[460px] w-full object-cover opacity-85"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b8e]/85 via-[#1045b8]/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/15 p-5 text-white shadow-xl backdrop-blur-md">
            <p className="text-sm font-bold text-yellow-300">Admission-first learning model</p>
            <p className="mt-1 text-2xl font-black">Approved students unlock structured course content.</p>
          </div>
        </div>

        <div className="absolute -left-4 top-8 hidden rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 sm:block">
          <p className="text-xs font-bold uppercase text-slate-500">Next Batch</p>
          <p className="mt-1 text-lg font-black text-[#1045b8]">Admissions Open</p>
        </div>
        <div className="absolute -right-4 bottom-24 hidden rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 sm:block">
          <p className="text-xs font-bold uppercase text-slate-500">Course Fee</p>
          <p className="mt-1 text-lg font-black text-emerald-600">Free Tracks</p>
        </div>
      </motion.div>
    </div>

    <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {trustPoints.map((point, index) => (
        <motion.div
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 + index * 0.07, duration: 0.35 }}
          key={point.text}
        >
          <point.icon className="text-[#1045b8]" size={20} />
          <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">{point.text}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HeroSection;
