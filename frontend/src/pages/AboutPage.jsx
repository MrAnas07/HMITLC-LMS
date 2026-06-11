import { Award, BookOpenCheck, Building2, UsersRound } from "lucide-react";

const AboutPage = () => (
  <div className="page-enter min-h-screen bg-slate-50 dark:bg-slate-950">

    {/* HERO SECTION */}
    <div className="relative isolate overflow-hidden bg-white px-4 py-12 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]"></div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* VIP Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-black tracking-widest text-[#1045b8] shadow-sm backdrop-blur animate-fade-in-up dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2 sm:text-xs">
          <span>⭐</span>
          <span>Hasrat Mohani IT Literacy Centre</span>
          <span>⭐</span>
        </div>

        <h1 className="text-2xl font-black leading-tight mb-4 animate-fade-in-up delay-100 text-slate-950 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl sm:mb-6">
          Empowering the Next<br/>
          <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Generation</span> of IT Professionals
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 animate-fade-in-up delay-200 sm:text-base md:text-lg md:leading-7 lg:text-xl lg:leading-8 sm:mb-10">
          Hasrat Mohani IT Literacy Centre has been transforming lives through quality, accessible IT education — helping students build real skills for the real world.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up delay-300 sm:gap-6">
          {[
            { number: "500+", label: "Graduates" },
            { number: "10+", label: "Courses" },
            { number: "100%", label: "Practical Training" },
            { number: "FREE", label: "Selected Courses" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl px-4 py-3 text-center hover-scale shadow-xl dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-4">
              <div className="text-xl font-black text-[#1045b8] sm:text-3xl">{stat.number}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FREE COURSES VIP BANNER */}
    <div className="mx-auto max-w-5xl px-4 -mt-6 relative z-10 animate-fade-in-up delay-200 sm:-mt-8 sm:px-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl p-4 shadow-2xl border-4 border-yellow-500 sm:p-6">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-600 opacity-20 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-600 opacity-20 rounded-full"></div>
        <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-3xl animate-float sm:text-5xl">🎓</div>
            <div>
              <div className="text-xs font-black text-yellow-900 uppercase tracking-wide sm:text-2xl">Selected Courses — 100% FREE</div>
              <div className="mt-1 text-[10px] text-yellow-800 sm:text-sm">No fees. No barriers. Just pure knowledge and skill-building.</div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-yellow-900 text-yellow-300 font-black text-sm px-4 py-2 rounded-xl tracking-widest shadow-lg border-2 border-yellow-700 sm:text-lg sm:px-6 sm:py-3">
              ✨ ENROLL FREE
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* MISSION SECTION */}
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 text-center animate-fade-in-up sm:mb-12">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-black text-[#1045b8] tracking-widest sm:px-4 sm:py-2 sm:text-xs">OUR MISSION</div>
        <h2 className="mb-4 text-2xl font-black text-gray-900 sm:text-3xl md:text-4xl">Why We Exist</h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
          To provide <span className="font-bold text-[#1045b8]">accessible, high-quality IT education</span> to students from all walks of life — equipping them with the skills needed to thrive in the digital world.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {[
          {
            icon: "🎯",
            title: "Quality Education",
            desc: "Industry-relevant curriculum designed and delivered by certified IT professionals.",
            color: "from-blue-50 to-blue-100",
            border: "border-blue-200"
          },
          {
            icon: "🌍",
            title: "Accessible & FREE",
            desc: "Breaking financial barriers — selected courses are completely FREE for every student.",
            color: "from-yellow-50 to-yellow-100",
            border: "border-yellow-300",
            vip: true
          },
          {
            icon: "🏆",
            title: "Proven Results",
            desc: "Hundreds of successful graduates placed in top companies across Pakistan.",
            color: "from-green-50 to-green-100",
            border: "border-green-200"
          },
        ].map((card, i) => (
          <div key={i} className={`card-animate hover-lift relative overflow-hidden bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-4 shadow-md sm:p-6`}>
            {card.vip && (
              <div className="absolute top-3 right-3 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-yellow-900 shadow sm:text-xs">FREE</div>
            )}
            <div className="mb-3 text-3xl sm:text-4xl">{card.icon}</div>
            <h3 className="mb-2 text-base font-black text-gray-900 sm:text-lg">{card.title}</h3>
            <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* WHAT WE OFFER */}
    <div className="bg-[#0d3b8e] py-10 px-4 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center animate-fade-in-up sm:mb-12">
          <div className="mb-4 inline-block rounded-full bg-white bg-opacity-10 px-3 py-1.5 text-[10px] font-black text-yellow-400 tracking-widest sm:px-4 sm:py-2 sm:text-xs">OUR COURSES</div>
          <h2 className="mb-4 text-2xl font-black text-white sm:text-3xl md:text-4xl">What We Offer</h2>
          <p className="text-sm text-blue-200 sm:text-base md:text-lg">Cutting-edge courses built for today&apos;s job market</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { icon: "💻", title: "Computer Information Technology\nCIT" },
            { icon: "📈", title: "Digital Marketing\n& SEO" },
            { icon: "🎨", title: "Graphic Designing" },
          ].map((course, i) => (
            <div key={i} className="hover-lift w-full cursor-pointer rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 text-center transition-all duration-300 sm:w-48 sm:p-5">
              <div className="mb-2 text-2xl sm:text-3xl">{course.icon}</div>
              <div className="whitespace-pre-line text-xs font-bold leading-snug text-white sm:text-sm">{course.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* WHY CHOOSE US */}
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid grid-cols-1 gap-8 items-center sm:gap-12 md:grid-cols-2">
        <div className="animate-slide-left">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-black text-[#1045b8] tracking-widest sm:px-4 sm:py-2 sm:text-xs">WHY US</div>
          <h2 className="mb-4 text-2xl font-black text-gray-900 sm:text-3xl sm:mb-6 md:text-4xl">Why Choose HMITLC?</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              "Experienced & certified instructors with industry background",
              "Hands-on practical training on real-world projects",
              "Small batch sizes for personal attention & mentorship",
              "Job placement assistance after course completion",
              "FREE courses available — zero financial barrier",
              "Flexible class timings for working students",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2 animate-fade-in-up sm:gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-6 sm:w-6">
                  <span className="text-[10px] font-black text-white sm:text-xs">✓</span>
                </div>
                <p className="text-sm font-medium text-gray-700 sm:text-base">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats card */}
        <div className="animate-slide-right">
          <div className="rounded-3xl bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] p-5 text-white shadow-2xl sm:p-8">
            <h3 className="mb-4 font-black text-base uppercase tracking-wide text-yellow-400 sm:text-xl sm:mb-6">Our Impact</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { number: "500+", label: "Students Trained" },
                { number: "10+", label: "Active Courses" },
                { number: "FREE", label: "Courses Available" },
                { number: "100%", label: "Practical Focus" },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-10 p-3 text-center sm:p-4">
                  <div className="text-lg font-black text-yellow-400 sm:text-2xl">{stat.number}</div>
                  <div className="mt-1 text-[10px] font-medium text-blue-200 sm:text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-yellow-400 p-3 text-center sm:mt-6 sm:p-4">
              <div className="text-xs font-black text-yellow-900 sm:text-sm">🎓 Transforming Lives Through IT Education</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* CONTACT SECTION */}
    <div className="bg-gray-900 py-10 px-4 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl text-center animate-fade-in-up">
        <div className="mb-4 inline-block rounded-full bg-white bg-opacity-10 px-3 py-1.5 text-[10px] font-black text-yellow-400 tracking-widest sm:px-4 sm:py-2 sm:text-xs">CONTACT US</div>
        <h2 className="mb-4 text-2xl font-black text-white sm:text-3xl md:text-4xl">Get In Touch</h2>
        <p className="mb-8 text-sm text-gray-400 sm:text-base sm:mb-10">We&apos;d love to hear from you. Reach out and start your IT journey today.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
          {[
            { icon: "📍", label: "Address", value: "Hasrat Mohani Road, Karachi, Pakistan" },
            { icon: "📞", label: "Phone", value: "+92 300 0000000" },
            { icon: "✉️", label: "Email", value: "info@hmitlc.edu.pk" },
            { icon: "🌐", label: "Website", value: "www.hmitlc.edu.pk" },
          ].map((item, i) => (
            <div key={i} className="hover-lift rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 p-4 text-center sm:p-5">
              <div className="mb-2 text-2xl sm:text-3xl">{item.icon}</div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">{item.label}</div>
              <div className="text-xs font-medium text-white sm:text-sm">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default AboutPage;
