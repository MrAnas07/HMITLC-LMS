import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  Users,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { api, getErrorMessage } from "../api/client";
import { showToast } from "./Toast";

const ROLE_BADGES = {
  admin: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
};

const AdminUserManagement = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, userName: "", newRole: "" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId, userName, newRole) => {
    setConfirmModal({ open: true, userId, userName, newRole });
  };

  const confirmRoleUpdate = async () => {
    const { userId, userName, newRole } = confirmModal;
    setConfirmModal({ open: false, userId: null, userName: "", newRole: "" });
    setUpdatingId(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast(res.data.message, "success");
      fetchUsers();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    teacher: users.filter((u) => u.role === "teacher").length,
    student: users.filter((u) => u.role === "student").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-press grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#1045b8] dark:text-blue-300">
              <ShieldCheck size={14} /> User Management
            </p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              Role Management
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Promote or demote user roles across the system
            </p>
          </div>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1045b8] focus:ring-2 focus:ring-[#1045b8]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-slate-900 dark:text-white" },
          { label: "Admins", value: stats.admin, color: "text-red-600 dark:text-red-400" },
          { label: "Teachers", value: stats.teacher, color: "text-blue-600 dark:text-blue-400" },
          { label: "Students", value: stats.student, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
            <p className={`mt-1 text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#1045b8]" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Loading users...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Users size={30} />
          </div>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200">
            No Users Found
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-black uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${ROLE_BADGES[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.role === "student" ? (
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.name, "teacher")}
                            disabled={updatingId === user._id}
                            className="btn-press inline-flex items-center gap-1.5 rounded-xl bg-[#1045b8] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d3b8e] disabled:opacity-50"
                          >
                            {updatingId === user._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Shield size={12} />
                            )}
                            Promote
                          </button>
                        ) : user.role === "teacher" ? (
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.name, "student")}
                            disabled={updatingId === user._id}
                            className="btn-press inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50"
                          >
                            {updatingId === user._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <ShieldOff size={12} />
                            )}
                            Demote
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 italic">
                            <ShieldCheck size={12} /> Root Admin
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {confirmModal.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setConfirmModal({ open: false, userId: null, userName: "", newRole: "" })}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              >
                {/* Close */}
                <button
                  onClick={() => setConfirmModal({ open: false, userId: null, userName: "", newRole: "" })}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  type="button"
                >
                  <X size={16} />
                </button>

                {/* Icon */}
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-500/10">
                  <AlertTriangle size={26} className="text-amber-600 dark:text-amber-400" />
                </div>

                {/* Content */}
                <h3 className="text-center text-lg font-black text-slate-900 dark:text-white">
                  Confirm Role Change
                </h3>
                <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  Change <span className="font-bold text-slate-900 dark:text-white">{confirmModal.userName}</span>'s role to{" "}
                  <span className={`font-bold ${
                    confirmModal.newRole === "teacher"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {confirmModal.newRole}
                  </span>?
                </p>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setConfirmModal({ open: false, userId: null, userName: "", newRole: "" })}
                    className="btn-press flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 min-h-11 text-sm font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRoleUpdate}
                    className={`btn-press flex-1 rounded-xl px-4 py-2.5 min-h-11 text-sm font-bold text-white transition shadow-lg ${
                      confirmModal.newRole === "teacher"
                        ? "bg-[#1045b8] shadow-blue-900/20 hover:bg-[#0d3b8e]"
                        : "bg-amber-500 shadow-amber-900/20 hover:bg-amber-600"
                    }`}
                    type="button"
                  >
                    {confirmModal.newRole === "teacher" ? "Promote" : "Demote"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AdminUserManagement;
