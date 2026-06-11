import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", teacherCode: "" });
  const [message, setMessage] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const user = await signup(form);
      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <section className="section grid min-h-[70vh] place-items-center page-enter">
      <form
        className="w-full max-w-md mx-auto rounded-lg border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-soft"
        onSubmit={submit}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">Choose student or teacher access.</p>
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <select
            className="input input-animate p-2.5 sm:p-3 h-11 min-h-[44px]"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value, teacherCode: "" }))}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {form.role === "teacher" && (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950/30">
              <label className="block text-sm font-bold text-amber-700 dark:text-amber-300">
                Teacher Verification Code
              </label>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Enter the official institute invitation code to create a teacher account.
              </p>
              <input
                className="input input-animate mt-2 w-full p-2.5 sm:p-3 h-11 min-h-[44px] border-2 border-amber-400 bg-white text-center font-mono text-sm font-bold tracking-widest dark:bg-slate-800"
                placeholder="Enter invitation code"
                value={form.teacherCode}
                onChange={(event) => setForm((prev) => ({ ...prev, teacherCode: event.target.value }))}
              />
            </div>
          )}

          <input
            className="input input-animate p-2.5 sm:p-3 h-11 min-h-[44px]"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className="input input-animate p-2.5 sm:p-3 h-11 min-h-[44px]"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="input input-animate p-2.5 sm:p-3 h-11 min-h-[44px]"
            placeholder="Password, minimum 8 characters"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />

          {message && (
            <p className="rounded-md bg-red-50 p-3 sm:p-4 text-sm sm:text-base text-red-700">{message}</p>
          )}
          <button
            className="btn-primary w-full btn-press h-11 min-h-[44px] p-2.5 sm:p-3 text-base sm:text-lg"
            type="submit"
          >
            Sign up
          </button>
        </div>
        <p className="mt-4 sm:mt-5 text-center text-sm sm:text-base text-slate-600">
          Already registered?{" "}
          <Link className="font-semibold text-academy-blue" to="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignupPage;
