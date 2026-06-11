// ============================================
// HMITLC LMS - Admissions Page
// Updated with better error handling and image support
// ============================================

import { CheckCircle2, Download, FileText, Loader2, UserPlus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { showToast, showError } from '../components/Toast';
import { generateHMITLCIdCard } from '../utils/hml2canvasIdCardGenerator';
import { preloadImage } from '../utils/imageLoader';
import { VALIDATION } from '../constants';

// Validation helpers
const isCnicValid = (value) => new RegExp(`^\\d{${VALIDATION.CNIC_LENGTH}}$`).test(value);

const AdmissionsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'registration');
  const [cnic, setCnic] = useState(location.state?.cnic || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Prevent non-numeric input
  const handleKeyDown = (e) => {
    const char = e.key;
    if (!/^\d$/.test(char) && char !== 'Backspace' && char !== 'Delete' && char !== 'Tab') {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericOnly = pastedData.replace(/\D/g, '').slice(0, VALIDATION.CNIC_LENGTH);
    setCnic(numericOnly);
  };

  const handleDownload = async () => {
    if (!isCnicValid(cnic)) {
      setError(`CNIC must be exactly ${VALIDATION.CNIC_LENGTH} digits`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.get('/id-card/search', { params: { cnic } });
      const student = response.data.student;

      // Preload profile image before generating ID card
      let processedStudent = { ...student };

      if (student.profilePicture) {
        try {
          const processedImage = await preloadImage(student.profilePicture);
          if (processedImage) {
            processedStudent.profilePicture = processedImage;
          }
        } catch (imgError) {
          console.warn('Profile image preloading failed:', imgError);
          // Continue without the image
        }
      }

      // Generate PDF ID card
      await generateHMITLCIdCard(processedStudent);

      showToast('ID Card downloaded successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';

      if (msg.includes('not approved') || msg.includes('pending')) {
        setError('Your admission is not approved yet. Please wait for admin approval.');
      } else if (msg.includes('not found') || msg.includes('No student')) {
        setError('No student record found with this CNIC. Please check and try again.');
      } else {
        setError(msg);
        showError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    const token = localStorage.getItem('lms_token');
    if (token) {
      navigate('/admission');
    } else {
      navigate('/signup', { state: { from: { pathname: '/admission' } } });
    }
  };

  return (
    <section className="page-enter relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-white py-8 dark:bg-slate-950 sm:py-10 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black text-[#1045b8] shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2 sm:text-sm">
            Admissions & ID Card Portal
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl sm:mt-5 md:text-4xl lg:text-5xl">
            Hasrat Mohani <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">IT Literacy Centre</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:mt-4 md:text-lg md:leading-8">
            Access your admission or download your student ID card
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('registration')}
            className={`btn-press relative overflow-hidden rounded-3xl border p-4 text-left shadow-xl transition-all duration-300 sm:p-5 sm:p-6 ${
              activeTab === 'registration'
                ? 'border-transparent bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white'
                : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${activeTab === 'registration' ? 'bg-white/20' : 'bg-academy-blue/10'}`}>
                <FileText size={20} className={activeTab === 'registration' ? 'text-white' : 'text-academy-blue sm:text-academy-blue'} />
              </div>
              <div>
                <h3 className="text-sm font-bold sm:text-base">Registration Form</h3>
                <p className={`text-xs ${activeTab === 'registration' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Apply for admission
                </p>
              </div>
            </div>
            {activeTab === 'registration' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('idcard')}
            className={`btn-press relative overflow-hidden rounded-3xl border p-4 text-left shadow-xl transition-all duration-300 sm:p-5 sm:p-6 ${
              activeTab === 'idcard'
                ? 'border-transparent bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white'
                : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${activeTab === 'idcard' ? 'bg-white/20' : 'bg-academy-blue/10'}`}>
                <Download size={20} className={activeTab === 'idcard' ? 'text-white' : 'text-academy-blue sm:text-academy-blue'} />
              </div>
              <div>
                <h3 className="text-sm font-bold sm:text-base">Download ID Card</h3>
                <p className={`text-xs ${activeTab === 'idcard' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Get your student ID
                </p>
              </div>
            </div>
            {activeTab === 'idcard' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-6 sm:p-8">
          {activeTab === 'registration' && (
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-academy-blue/10 sm:h-10 sm:w-10">
                  <UserPlus size={18} className="text-academy-blue" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950 dark:text-white sm:text-xl">Student Registration</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Submit your admission application</p>
                </div>
              </div>

              <div className="rounded-3xl bg-blue-50 p-4 dark:bg-blue-900/20 sm:p-6">
                <h3 className="mb-3 text-sm font-bold text-blue-800 dark:text-blue-200 sm:text-base">How to Register</h3>
                <ol className="space-y-2 text-xs text-blue-700 dark:text-blue-300 sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span> Create an account or login
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span> Fill out the admission form with your details
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span> Submit and wait for admin approval
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span> Download your student ID card after approval
                  </li>
                </ol>
              </div>

              <button onClick={handleRegisterClick} className="btn-press mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-4 py-3 text-sm font-black text-white shadow-lg sm:mt-6 sm:px-5">
                <UserPlus size={18} />
                Proceed to Registration
              </button>
            </div>
          )}

          {activeTab === 'idcard' && (
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-academy-blue/10 sm:h-10 sm:w-10">
                  <Download size={18} className="text-academy-blue" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950 dark:text-white sm:text-xl">Download Your ID Card</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    Enter your CNIC to download your student ID card
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">
                    CNIC Number <span className="text-slate-400">({VALIDATION.CNIC_LENGTH} digits)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={VALIDATION.CNIC_LENGTH}
                    placeholder="4210112345671"
                    value={cnic}
                    onChange={(e) => {
                      setCnic(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    className={`input input-animate h-12 w-full rounded-2xl text-base tracking-widest sm:text-lg ${
                      isCnicValid(cnic)
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : cnic.length > 0
                        ? 'border-red-500 ring-2 ring-red-500/20'
                        : ''
                    }`}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {cnic.length}/{VALIDATION.CNIC_LENGTH} digits
                    </p>
                    {cnic.length > 0 && (
                      <span className={`text-xs ${isCnicValid(cnic) ? 'text-emerald-600' : 'text-red-500'} sm:text-sm`}>
                        {isCnicValid(cnic) ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={14} /> Valid CNIC
                          </span>
                        ) : (
                          'Invalid CNIC format'
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300 sm:p-4 sm:text-sm">
                    <XCircle size={18} className="flex-shrink-0 sm:text-sm" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  disabled={loading || !isCnicValid(cnic)}
                  className="btn-press flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-5 py-3 text-base font-black text-white shadow-lg disabled:opacity-70 sm:text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Download ID Card
                    </>
                  )}
                </button>

                <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 sm:p-4 sm:text-sm">
                  <p className="font-semibold">Note:</p>
                  <p>Only approved students can download their ID card. Make sure your admission has been approved by the admin.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdmissionsPage;
