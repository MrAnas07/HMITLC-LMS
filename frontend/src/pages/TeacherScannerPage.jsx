import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Camera, XCircle, RefreshCw, Clock, User, BookOpen } from "lucide-react";
import { api, getErrorMessage } from "../api/client";

const TeacherScannerPage = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  const fetchStats = async () => {
    try {
      const response = await api.get("/attendance/stats");
      setTodayCount(response.data.todayCount);
      setTotalStudents(response.data.totalStudents);
      setRecentScans(response.data.recentRecords || []);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const scanner = new Html5Qrcode("qr-reader");

    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          onScanSuccess,
          onScanFailure
        );
        setIsScanning(true);
      } catch (error) {
        console.error("Scanner start failed:", error);
        setErrorStatus(true);
        setStatusMessage("Camera access denied or not available. Please allow camera permission.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
          scannerRef.current.clear().catch(() => {});
        } catch (e) {
          console.error("Scanner cleanup error:", e);
        }
      }
    };
  }, []);

  async function onScanSuccess(decodedText) {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.pause(true);
    } catch (e) {}

    // Extract student ID from URL or use raw text
    let studentId = decodedText;
    const verifyMatch = decodedText.match(/verify\/([A-Za-z0-9\-]+)/i);
    if (verifyMatch) {
      studentId = verifyMatch[1];
    }

    setStatusMessage("Processing Attendance...");
    setErrorStatus(false);

    try {
      const response = await api.post("/attendance/scan", {
        studentId: studentId,
      });

      if (response.data.success) {
        setErrorStatus(false);
        setStatusMessage(`PRESENT MARKED!`);

        setRecentScans((prev) => [
          {
            studentName: response.data.studentName,
            studentId: response.data.studentId,
            courseName: response.data.courseName,
            time: response.data.time,
            status: "Present",
          },
          ...prev.slice(0, 9),
        ]);

        setTodayCount((prev) => prev + 1);
      }
    } catch (error) {
      setErrorStatus(true);
      setStatusMessage(getErrorMessage(error));
    }

    setTimeout(() => {
      setStatusMessage("");
      if (scannerRef.current) {
        try {
          scannerRef.current.resume();
        } catch (e) {
          console.error("Resume failed:", e);
        }
      }
    }, 3000);
  }

  function onScanFailure() {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden bg-white px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-10 md:py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-200 sm:px-4 sm:py-2 sm:text-xs">
            <Camera size={14} />
            QR Attendance Scanner
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
            Attendance <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Scanner</span>
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Scan student ID card QR codes to mark attendance
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-white sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">Today&apos;s Attendance</p>
                <p className="mt-1 text-2xl font-black text-green-600 sm:text-3xl">{todayCount}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300 sm:h-12 sm:w-12">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-white sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">Total Students</p>
                <p className="mt-1 text-2xl font-black text-[#1045b8] sm:text-3xl">{totalStudents}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#1045b8] dark:bg-blue-950/40 dark:text-blue-300 sm:h-12 sm:w-12">
                <User size={20} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-white sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">Attendance Rate</p>
                <p className="mt-1 text-2xl font-black text-amber-600 sm:text-3xl">
                  {totalStudents > 0 ? Math.round((todayCount / totalStudents) * 100) : 0}%
                </p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 sm:h-12 sm:w-12">
                <BookOpen size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scanner Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#1045b8] text-white sm:h-10 sm:w-10">
                <Camera size={16} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">QR Scanner</h2>
                <p className="text-[10px] text-slate-500 sm:text-xs">Point camera at student ID card</p>
              </div>
            </div>

            <div
              ref={containerRef}
              id="qr-reader"
              className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              style={{ minHeight: "250px" }}
            />

            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 rounded-2xl p-3 text-center text-sm font-bold sm:p-4 ${
                    errorStatus
                      ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
                      : "border border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200"
                  }`}
                >
                  {errorStatus ? <XCircle size={18} className="mx-auto mb-1" /> : <CheckCircle2 size={18} className="mx-auto mb-1" />}
                  {statusMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {!isScanning && !statusMessage && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-4">
                <Camera size={20} className="mx-auto mb-2 text-amber-600" />
                <p className="text-xs font-bold text-amber-700 dark:text-amber-200 sm:text-sm">
                  Waiting for camera access...
                </p>
                <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-300 sm:text-xs">
                  Please allow camera permission when prompted
                </p>
              </div>
            )}
          </div>

          {/* Recent Scans Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-green-500 text-white sm:h-10 sm:w-10">
                <Clock size={16} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">Recent Scans</h2>
                <p className="text-[10px] text-slate-500 sm:text-xs">Today&apos;s attendance log</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentScans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800 sm:p-8">
                  <Camera size={28} className="mx-auto text-slate-300 dark:text-slate-600 sm:text-3xl" />
                  <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                    No scans yet today
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
                    Scanned students will appear here
                  </p>
                </div>
              ) : (
                recentScans.map((scan, index) => (
                  <motion.div
                    key={`${scan.studentId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50/50 p-2.5 dark:border-green-500/20 dark:bg-green-500/5 sm:gap-3 sm:p-3"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300 sm:h-10 sm:w-10">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                        {scan.studentName}
                      </p>
                      <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                        {scan.studentId} · {scan.courseName}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-bold text-green-600 dark:text-green-400 sm:text-xs">
                        {scan.time}
                      </p>
                      <p className="text-[9px] text-slate-400 sm:text-[10px]">PRESENT</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherScannerPage;
