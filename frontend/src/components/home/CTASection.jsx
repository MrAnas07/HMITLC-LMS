import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="bg-white py-20 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1045b8] via-[#0d3b8e] to-slate-950 p-8 text-white shadow-2xl shadow-blue-950/20 sm:p-10 lg:p-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.25),transparent_28%),radial-gradient(circle_at_8%_80%,rgba(255,255,255,0.16),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-yellow-300">
              <Sparkles size={16} /> Admissions are open
            </span>
            <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              Ready to start your professional IT journey?
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Submit your admission application, get approved by the institute team, and begin learning with a structured digital dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-[#0d3b8e] shadow-xl transition hover:-translate-y-0.5 hover:bg-yellow-300" to="/admission">
              Apply Now <ArrowRight size={18} />
            </Link>
            <Link className="btn-press inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15" to="/contact">
              Talk to Admissions
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
