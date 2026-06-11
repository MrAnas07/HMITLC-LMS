import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { stats } from "./sectionData";

const StatsSection = () => (
  <section className="relative overflow-hidden bg-[#0d3b8e] py-16 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(245,158,11,0.22),transparent_24%),radial-gradient(circle_at_84%_70%,rgba(255,255,255,0.13),transparent_28%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {stats.map((item, index) => (
        <motion.div
          className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.38, delay: index * 0.07 }}
          key={item.label}
        >
          <item.icon className="text-yellow-400" size={28} />
          <p className="mt-5 text-4xl font-black">
            <CountUp value={item.value} suffix={item.suffix} />
          </p>
          <p className="mt-2 text-sm font-semibold text-blue-100">{item.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
