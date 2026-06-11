import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const user = await login(form);
      const fallback = user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/student";
      navigate(location.state?.from?.pathname || fallback);
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950">Login</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">Use your student, teacher, or admin account.</p>
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <input
            className="input p-2.5 sm:p-3 h-11 min-h-[44px]"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="input input-animate p-2.5 sm:p-3 h-11 min-h-[44px]"
            placeholder="Password"
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
            Login
          </button>
        </div>
        <p className="mt-4 sm:mt-5 text-center text-sm sm:text-base text-slate-600">
          New here?{" "}
          <Link className="font-semibold text-academy-blue" to="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
