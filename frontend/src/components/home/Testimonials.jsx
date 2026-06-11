import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "./sectionData";

const Testimonials = () => (
  <section className="bg-slate-50 py-20 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1045b8]">Student Stories</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
          Learners trust HMITLC for focused growth.
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.blockquote
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            key={item.name}
          >
            <Quote className="text-[#1045b8]" size={28} />
            <div className="mt-4 flex gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star fill="currentColor" size={16} key={star} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">“{item.quote}”</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-sm font-black text-white">
                {item.avatar}
              </span>
              <span>
                <span className="block font-black text-slate-950 dark:text-white">{item.name}</span>
                <span className="block text-xs font-semibold text-slate-500">{item.role}</span>
              </span>
            </div>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
