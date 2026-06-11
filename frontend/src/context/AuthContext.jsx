import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    if (!token) {
      setBooting(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("lms_user", JSON.stringify(data.user));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("lms_token");
          localStorage.removeItem("lms_user");
          setUser(null);
        } else {
          console.error("Auth refresh failed:", error.message);
        }
      })
      .finally(() => setBooting(false));
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("lms_token", data.token);
    localStorage.setItem("lms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("lms_token", data.token);
    localStorage.setItem("lms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    setUser(null);
    window.location.href = "/";
  };

  const value = useMemo(() => ({ user, booting, login, signup, logout }), [user, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
