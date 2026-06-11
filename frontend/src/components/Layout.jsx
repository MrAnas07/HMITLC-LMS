import { motion } from "framer-motion";
import { GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Sun, UserPlus, X, Camera, FileQuestion } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModernFooter from "./home/ModernFooter";

const navClass = ({ isActive }) =>
  `group relative rounded-full px-4 py-2 text-sm font-bold transition ${
    isActive
      ? "bg-[#1045b8] text-white shadow-lg shadow-blue-900/15"
      : "text-slate-700 hover:text-[#1045b8] dark:text-slate-200 dark:hover:text-white"
  }`;

const Layout = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("lms_dark_mode");
    return stored ? JSON.parse(stored) : false;
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem("lms_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const dashboardPath =
    user?.role === "teacher" ? "/teacher" : user?.role === "admin" ? "/admin" : "/student";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = (
    <>
      <NavLink className={navClass} to="/courses">
        Courses
      </NavLink>
      <NavLink className={navClass} to="/about">
        About
      </NavLink>
      <NavLink className={navClass} to="/contact">
        Contact
      </NavLink>
      <NavLink className={navClass} to="/admissions">
        Admissions
      </NavLink>
      {user && user.role === "student" && (
        <NavLink className={navClass} to="/quiz">
          <span className="flex items-center gap-1.5">
            <FileQuestion size={14} />
            Quiz
          </span>
        </NavLink>
      )}
      {user && (
        <NavLink className={navClass} to={dashboardPath}>
          Dashboard
        </NavLink>
      )}
      {user && (user.role === "teacher" || user.role === "admin") && (
        <NavLink className={navClass} to="/scan-attendance">
          <span className="flex items-center gap-1.5">
            <Camera size={14} />
            Scanner
          </span>
        </NavLink>
      )}
    </>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-academy-paper text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="sticky top-0 z-40 border-b border-white/30 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-2 font-bold text-slate-950 dark:text-white" to="/">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white shadow-lg shadow-blue-950/20">
                <GraduationCap size={20} />
              </span>
              <span>
                <span className="block leading-4">HMITLC</span>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Hasrat Mohani IT Literacy Centre
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">{links}</div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                aria-label="Toggle dark mode"
                className="btn-press grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-[#1045b8] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                onClick={() => setDarkMode((value) => !value)}
                type="button"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {user ? (
                <>
                  <span className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {user.name} · {user.role}
                  </span>
                  <button className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-[#1045b8] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" onClick={handleLogout} type="button">
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-[#1045b8] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" to="/login">
                    <LayoutDashboard size={16} />
                    Login
                  </Link>
                  <Link className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5" to="/signup">
                    <UserPlus size={16} />
                    Sign up
                  </Link>
                </>
              )}
            </div>

            <button className="btn-press grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 md:hidden" onClick={() => setOpen((value) => !value)} type="button">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {links}
                <button
                  className="btn-secondary"
                  onClick={() => setDarkMode((value) => !value)}
                  type="button"
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />} Theme
                </button>
                {user ? (
                  <button className="btn-secondary" onClick={handleLogout} type="button">
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <>
                    <NavLink className={navClass} to="/login">
                      Login
                    </NavLink>
                    <NavLink className={navClass} to="/signup">
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.header>

        <main>
          <Outlet />
        </main>

        <ModernFooter />
      </div>
    </div>
  );
};

export default Layout;
