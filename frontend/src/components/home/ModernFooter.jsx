import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

const ModernFooter = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-white dark:border-slate-800">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr] lg:px-8">
      <div>
        <Link className="inline-flex items-center gap-3" to="/">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1045b8] text-lg font-black">H</span>
          <span>
            <span className="block text-lg font-black">HMITLC</span>
            <span className="block text-xs text-slate-400">Hasrat Mohani IT Literacy Centre</span>
          </span>
        </Link>
        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
          A modern IT literacy centre helping students build career-ready digital skills through structured admissions, expert teachers, and practical courses.
        </p>
        <div className="mt-5 flex gap-3">
          {[Facebook, Instagram, Linkedin].map((Icon, index) => (
            <a className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-slate-200 transition hover:bg-[#1045b8]" href="/" key={index}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-black">Quick Links</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          <Link className="transition hover:text-yellow-400" to="/courses">Courses</Link>
          <Link className="transition hover:text-yellow-400" to="/admission">Admission</Link>
          <Link className="transition hover:text-yellow-400" to="/about">About</Link>
          <Link className="transition hover:text-yellow-400" to="/contact">Contact</Link>
        </div>
      </div>

      <div>
        <h3 className="font-black">Contact</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          <p className="flex gap-2"><Phone size={16} /> +92 300 0000000</p>
          <p className="flex gap-2"><Mail size={16} /> info@hmitlc.edu.pk</p>
          <p className="flex gap-2"><MapPin size={16} /> Karachi, Pakistan</p>
        </div>
      </div>

      <div>
        <h3 className="font-black">Newsletter</h3>
        <p className="mt-4 text-sm leading-6 text-slate-300">Get admission updates and new course announcements.</p>
        <form className="mt-4 flex rounded-2xl bg-white p-1">
          <input className="min-w-0 flex-1 rounded-xl px-3 text-sm text-slate-900 outline-none" placeholder="Email address" type="email" />
          <button className="btn-press grid h-10 w-10 place-items-center rounded-xl bg-[#1045b8] text-white" type="button">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} HMITLC. Built for professional IT education.
    </div>
  </footer>
);

export default ModernFooter;
