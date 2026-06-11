import { useEffect, useState } from "react";
import { api } from "../api/client";

const SeatAllocationPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      const data = res.data;
      setCourses(data.courses || data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="page-enter min-h-screen bg-gray-50 dark:bg-slate-950">
      <div
        className="relative overflow-hidden px-4 py-8 text-center sm:px-6 sm:py-10 md:py-12"
        style={{
          background: "linear-gradient(135deg, rgba(16,69,184,0.08) 0%, rgba(245,158,11,0.08) 100%), linear-gradient(180deg, #f8fafc, #ffffff)"
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-black tracking-widest text-[#1045b8] shadow-sm sm:px-4 sm:py-2 sm:text-xs">
            <span>🪑</span>
            <span>ADMIN CONTROL</span>
          </div>
          <h1 className="mb-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Seat <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Allocation</span> Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Set seat limits per course and track real-time enrollment capacity.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-4 mb-6 max-w-5xl px-4 sm:-mt-4 sm:mb-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {[
            {
              label: "Total Courses",
              value: courses.length,
              icon: "📚",
              color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700"
            },
            {
              label: "Total Seats",
              value: courses.reduce((a, c) => a + (c.totalSeats || 40), 0),
              icon: "💺",
              color: "from-purple-50 to-purple-100 border-purple-200 text-purple-700"
            },
            {
              label: "Seats Booked",
              value: courses.reduce((a, c) => a + (c.seatsBooked || 0), 0),
              icon: "✅",
              color: "from-green-50 to-green-100 border-green-200 text-green-700"
            },
            {
              label: "Seats Available",
              value: courses.reduce((a, c) => a + (c.seatsAvailable ?? c.totalSeats ?? 40), 0),
              icon: "🟢",
              color: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700"
            }
          ].map((stat) => (
            <div key={stat.label} className={`card-animate rounded-2xl border bg-gradient-to-br ${stat.color} p-3 text-center shadow-sm sm:p-5`}>
              <div className="mb-2 text-xl sm:text-2xl">{stat.icon}</div>
              <div className="text-xl font-black sm:text-3xl">{loading ? "..." : stat.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-70 sm:text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
        {loading ? (
          <div className="py-12 text-center text-slate-400 sm:py-16">
            <div className="mb-3 text-3xl animate-pulse-soft sm:text-4xl">⏳</div>
            <div className="font-bold">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 sm:py-16">
            <div className="mb-3 text-3xl sm:text-4xl">📚</div>
            <div className="text-base font-bold sm:text-lg">No courses found</div>
            <div className="mt-1 text-xs sm:text-sm">Add courses first to manage seats</div>
          </div>
        ) : (
          courses.map((course) => {
            const total = course.totalSeats || 40;
            const booked = course.seatsBooked || 0;
            const available = course.seatsAvailable ?? total;
            const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
            const isFull = available === 0;
            const isAlmostFull = pct >= 80 && !isFull;

            return (
              <div key={course._id} className="card-animate hover-lift mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">{course.title}</h3>
                    <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{course.category} • {course.level}</p>
                  </div>
                  <div className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black sm:px-3 sm:text-xs ${
                    isFull ? "bg-red-100 text-red-700" :
                    isAlmostFull ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {isFull ? "🔴 FULL" : isAlmostFull ? "🟡 ALMOST FULL" : "🟢 OPEN"}
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-8">
                  <div className="text-center">
                    <div className="text-xl font-black text-[#1045b8] sm:text-3xl">{booked}</div>
                    <div className="mt-0.5 text-[10px] font-medium text-slate-500 sm:text-xs">Booked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-green-600 sm:text-3xl">{available}</div>
                    <div className="mt-0.5 text-[10px] font-medium text-slate-500 sm:text-xs">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-slate-700 dark:text-white sm:text-3xl">{total}</div>
                    <div className="mt-0.5 text-[10px] font-medium text-slate-500 sm:text-xs">Total</div>
                  </div>
                  <div className="min-w-[120px] flex-1">
                    <div className="mb-1.5 flex justify-between text-[10px] text-slate-500 sm:text-xs">
                      <span className="font-medium">Occupancy</span>
                      <span className="font-black">{pct}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 sm:h-4">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 sm:h-4 ${
                          isFull ? "bg-red-500" : isAlmostFull ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="whitespace-nowrap text-[10px] font-black uppercase tracking-wide text-slate-600 dark:text-slate-400 sm:text-xs">
                      Update Total Seats:
                    </label>
                    <input
                      type="number"
                      min="1"
                      defaultValue={total}
                      className="input-animate w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold focus:border-[#1045b8] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-24"
                      onBlur={async (event) => {
                        const newSeats = parseInt(event.target.value, 10);
                        if (newSeats > 0 && newSeats !== total) {
                          try {
                            await api.patch(`/courses/${course._id}/seats`, { totalSeats: newSeats });
                            fetchCourses();
                          } catch (error) {
                            console.error("Seat update failed:", error);
                          }
                        }
                      }}
                    />
                    <span className="text-[10px] text-slate-400 sm:text-xs">Click outside to save</span>
                  </div>
                  <div className="ml-auto">
                    <button
                      className="btn-press rounded-xl bg-[#1045b8] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#0d3b8e]"
                      onClick={fetchCourses}
                      type="button"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SeatAllocationPage;
