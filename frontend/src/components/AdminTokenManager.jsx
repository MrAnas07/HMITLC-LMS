import { motion } from "framer-motion";
import { Check, Copy, Key, Plus, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import { showToast } from "./Toast";

export default function AdminTokenManager() {
  const [tokens, setTokens] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const [activeRes, allRes] = await Promise.all([
        api.get("/admin/active-tokens"),
        api.get("/admin/all-tokens")
      ]);
      setTokens(activeRes.data.data || []);
      setAllTokens(allRes.data.data || []);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchTokens(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/admin/generate-token");
      if (res.data.success) {
        showToast(`Code Generated: ${res.data.data.tokenCode}`, "success");
        fetchTokens();
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setGenerating(false);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const usedCount = allTokens.filter((t) => t.isUsed).length;
  const activeCount = tokens.length;

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString("en-PK", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Codes", value: activeCount, icon: Key, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Used Codes", value: usedCount, icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Generated", value: allTokens.length, icon: ShieldCheck, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
          >
            <div className={`p-2.5 rounded-lg ${item.bg}`}>
              <item.icon size={18} className={item.color} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generate Button + Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-neon-blue inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 min-h-11 text-sm font-black"
        >
          {generating ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Plus size={16} />
          )}
          {generating ? "Generating..." : "Generate New Code"}
        </button>

        <button
          onClick={() => setShowAll(!showAll)}
          className="btn-press inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 min-h-11 text-sm font-semibold text-slate-700 hover:border-purple-400 hover:text-purple-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-purple-500/40 transition"
        >
          <ShieldCheck size={16} />
          {showAll ? "Show Active Only" : "Show All History"}
        </button>
      </div>

      {/* Tokens List */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Generated By</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Created</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </td>
                </tr>
              ) : (showAll ? allTokens : tokens).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                    <Key size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tokens found. Generate a new code to get started.</p>
                  </td>
                </tr>
              ) : (
                (showAll ? allTokens : tokens).map((token, i) => (
                  <motion.tr
                    key={token._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-wider">
                        {token.tokenCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {token.generatedBy?.name || "System"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(token.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {token.isUsed ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <UserCheck size={10} />
                          Used
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                          <Key size={10} />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!token.isUsed && (
                        <button
                          onClick={() => copyToClipboard(token.tokenCode)}
                          className="btn-press inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/40 transition"
                        >
                          {copiedCode === token.tokenCode ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                      {token.isUsed && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {token.usedByEmail || "-"}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <p className="font-bold">Security Notes:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-600/80 dark:text-amber-400/70">
              <li>Each code works only once and expires immediately after use</li>
              <li>Unused codes auto-delete after 7 days</li>
              <li>Copy the code and share it with the teacher via secure channel</li>
              <li>Teacher must enter this code during signup to verify identity</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
