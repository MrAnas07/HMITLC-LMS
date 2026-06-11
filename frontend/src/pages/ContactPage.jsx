import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { api, getErrorMessage } from "../api/client";
import { showToast } from "../components/Toast";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      showToast("Message sent successfully! We will get back to you soon.", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter bg-slate-50 dark:bg-slate-950">
      <section className="relative isolate overflow-hidden bg-white px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-14 md:py-20 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-black tracking-[0.22em] text-[#1045b8] shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2 sm:text-xs">
            WE&apos;D LOVE TO HEAR FROM YOU
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-normal sm:text-3xl sm:mt-5 md:text-4xl lg:text-5xl xl:text-6xl">
            Get In <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7 md:mt-5 md:leading-8 lg:text-lg">
            Have questions about FREE IT courses, admission process, batches, or career guidance? Our team is ready to help you start confidently.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 grid max-w-7xl grid-cols-1 gap-3 px-4 sm:-mt-8 sm:grid-cols-2 sm:px-6 sm:gap-4 lg:grid-cols-4 lg:px-8">
        {[
          {
            icon: "📍",
            title: "Address",
            text: "Hasrat Mohani Road, Karachi, Pakistan",
            className: "from-[#1045b8] to-[#0d3b8e]"
          },
          {
            icon: "📞",
            title: "Phone",
            text: "+92 300 0000000",
            className: "from-emerald-500 to-green-700"
          },
          {
            icon: "✉️",
            title: "Email",
            text: "info@hmitlc.edu.pk",
            className: "from-purple-500 to-indigo-700"
          },
          {
            icon: "🕐",
            title: "Hours",
            text: "Mon–Sat / 9AM–6PM",
            className: "from-yellow-400 to-orange-500"
          }
        ].map((item) => (
          <article
            className={`card-animate hover-lift rounded-3xl bg-gradient-to-br ${item.className} p-4 text-white shadow-xl sm:p-5`}
            key={item.title}
          >
            <div className="text-xl sm:text-2xl sm:text-3xl">{item.icon}</div>
            <h2 className="mt-2 text-sm font-black sm:mt-3 sm:text-base sm:text-lg">{item.title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/90 sm:text-sm sm:leading-6">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-5 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 md:gap-8 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="animate-slide-left flex">
          <form className="card-animate hover-lift flex w-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6 md:min-h-[680px] lg:min-h-full sm:p-8" onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-5">
              <h2 className="text-lg font-black text-slate-950 dark:text-white sm:text-xl sm:text-2xl">Send Us a Message</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-6">
                Fill the form and our admissions team will contact you soon.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm">Full Name *</label>
                <input
                  className="input input-animate h-11 w-full"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm">Email *</label>
                <input
                  className="input input-animate h-11 w-full"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm">Phone</label>
                <input
                  className="input input-animate h-11 w-full"
                  name="phone"
                  placeholder="03001234567"
                  value={form.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm">Subject *</label>
                <select
                  className="input input-animate h-11 w-full"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select subject</option>
                  <option value="Course Inquiry">Course Inquiry</option>
                  <option value="Admission Process">Admission Process</option>
                  <option value="Fee Structure">Fee Structure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200 sm:text-sm">Message *</label>
                <textarea
                  className="input input-animate min-h-[140px] w-full sm:min-h-[160px] md:min-h-[180px] lg:min-h-[220px]"
                  name="message"
                  placeholder="Write your message..."
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button
                className="btn-press mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:col-span-2"
                disabled={loading}
                type="submit"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                {loading ? "Sending..." : "🚀 Send Message"}
              </button>
            </div>
          </form>
        </div>

        <div className="animate-slide-right space-y-4 sm:space-y-5">
          <article className="card-animate hover-lift rounded-3xl bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] p-4 text-white shadow-xl sm:p-5 sm:p-6">
            <h2 className="text-lg font-black sm:text-xl sm:text-2xl">Hasrat Mohani IT Literacy Centre</h2>
            <p className="mt-3 text-xs leading-6 text-blue-50 sm:text-sm sm:leading-7">
              HMITLC provides FREE courses and practical digital training for students who want to build real IT skills for education, freelancing, and careers.
            </p>
            <div className="mt-3 grid gap-2.5 text-xs sm:mt-4 sm:gap-3 sm:text-sm">
              {[
                "Certified instructors",
                "Practical training",
                "Small batches",
                "FREE courses",
                "Job placement support"
              ].map((item) => (
                <p className="flex items-center gap-2" key={item}>
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-yellow-400 text-[10px] font-black text-[#0d3b8e] sm:text-xs">✓</span>
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="card-animate hover-lift rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-5 sm:p-6">
            <h2 className="text-base font-black text-slate-950 dark:text-white sm:text-lg sm:text-xl">Quick Connect</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3">
              {[
                ["📱", "WhatsApp", "text-green-600", "bg-green-50"],
                ["🌐", "Website", "text-blue-600", "bg-blue-50"],
                ["📧", "Email", "text-purple-600", "bg-purple-50"],
                ["📍", "Location", "text-red-600", "bg-red-50"]
              ].map(([icon, title, color, bg]) => (
                <button className={`btn-press hover-lift rounded-2xl ${bg} p-3 text-left ${color} sm:p-4`} key={title} type="button">
                  <span className="text-lg sm:text-xl sm:text-2xl">{icon}</span>
                  <span className="mt-1 block text-[10px] font-black sm:text-xs sm:text-sm">{title}</span>
                </button>
              ))}
            </div>
          </article>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 md:pb-12 lg:px-8">
        <article className="card-animate hover-lift rounded-3xl bg-yellow-400 p-4 text-slate-950 shadow-xl sm:p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-black sm:text-xl sm:text-2xl">Working Hours</h2>
              <p className="mt-1 text-xs font-semibold text-yellow-900 sm:text-sm">
                Visit the centre or contact admissions during office hours.
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#0d3b8e] px-3 py-1.5 text-[10px] font-black text-white sm:px-4 sm:py-2 sm:text-xs">
              Mon–Sat
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 text-xs font-semibold sm:mt-5 sm:grid-cols-3 sm:gap-3 sm:text-sm">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white/85 p-2.5 sm:p-3 sm:p-4">
              <span className="min-w-0 whitespace-nowrap text-[11px] sm:text-xs">Monday–Friday</span>
              <span className="inline-flex min-w-[72px] justify-center rounded-full bg-green-600 px-2 py-1 text-[10px] font-black text-white sm:min-w-[80px] sm:min-w-[92px] sm:px-3 sm:py-1 sm:text-xs">9AM–6PM</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white/85 p-2.5 sm:p-3 sm:p-4">
              <span className="min-w-0 whitespace-nowrap text-[11px] sm:text-xs">Saturday</span>
              <span className="inline-flex min-w-[72px] justify-center rounded-full bg-green-600 px-2 py-1 text-[10px] font-black text-white sm:min-w-[80px] sm:min-w-[92px] sm:px-3 sm:py-1 sm:text-xs">9AM–2PM</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white/85 p-2.5 sm:p-3 sm:p-4">
              <span className="min-w-0 whitespace-nowrap text-[11px] sm:text-xs">Sunday</span>
              <span className="inline-flex min-w-[72px] justify-center rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white sm:min-w-[80px] sm:min-w-[92px] sm:px-3 sm:py-1 sm:text-xs">Closed</span>
            </div>
          </div>
        </article>
      </section>

      <section className="px-4 pb-8 sm:px-6 sm:pb-10 md:pb-12 lg:px-8">
        <div className="card-animate hover-lift mx-auto flex max-w-7xl flex-col gap-3 rounded-3xl bg-slate-950 p-4 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5 sm:p-7">
          <div>
            <h2 className="text-lg font-black sm:text-xl sm:text-2xl">🎓 Ready to Start Your IT Journey?</h2>
            <p className="mt-2 text-xs text-slate-300 sm:text-sm">Apply now and take your first step toward practical IT skills.</p>
          </div>
          <a
            className="btn-press inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-400 px-5 py-2.5 text-sm font-black text-[#0d3b8e] shadow-lg transition hover:bg-yellow-300 sm:w-auto"
            href="/admission"
          >
            🚀 Apply For Admission Now
          </a>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
