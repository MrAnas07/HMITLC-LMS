import { motion } from "framer-motion";
import { features } from "./sectionData";

const WhyChooseSection = () => (
  <section className="bg-white py-20 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f59e0b]">Why Choose HMITLC</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
          A premium institute experience for practical IT education.
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Everything is built around serious learning: admissions, dashboards, teacher tools, and verified student records.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.article
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10 dark:border-slate-800 dark:bg-slate-900"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            key={feature.title}
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] transition group-hover:bg-[#1045b8] group-hover:text-white dark:bg-slate-800">
              <feature.icon size={23} />
            </div>
            <h3 className="mt-5 text-lg font-black text-slate-950 dark:text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
