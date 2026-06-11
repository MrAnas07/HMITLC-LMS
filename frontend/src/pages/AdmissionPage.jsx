import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Loader2, Send, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import CropModal from "../components/CropModal";

const isPhoneValid = (value) => /^03\d{9}$/.test(value);
const isCnicValid = (value) => /^\d{13}$/.test(value);

const getInputClass = (isValid, hasError) => {
  let classes = "input h-11 sm:h-12 border-slate-300 bg-white shadow-sm focus:border-academy-blue focus:ring-academy-blue/20";
  if (hasError) classes += " border-red-500 ring-2 ring-red-500/20";
  else if (isValid) classes += " border-emerald-500 ring-2 ring-emerald-500/20";
  return classes;
};

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;

const AdmissionPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const profilePictureRef = useRef(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      fatherName: "",
      dateOfBirth: "",
      email: user?.email || "",
      phone: "",
      fatherPhone: "",
      cnic: "",
      fatherCnic: "",
      address: "",
      selectedCourse: searchParams.get("course") || "",
      computerProficiency: "",
      lastQualification: "",
      referralSource: "",
      hasLaptop: ""
    },
    mode: "onChange"
  });

  const watchedValues = watch();
  const addressLength = watch("address")?.length || 0;
  const selectedCourse = courses.find((course) => course._id === watchedValues.selectedCourse);
  const isCourseFull = selectedCourse && selectedCourse.seatsAvailable === 0;

  const phoneValid = isPhoneValid(watchedValues.phone || "");
  const fatherPhoneValid = isPhoneValid(watchedValues.fatherPhone || "");
  const cnicValid = isCnicValid(watchedValues.cnic || "");
  const fatherCnicValid = isCnicValid(watchedValues.fatherCnic || "");

  useEffect(() => {
    api.get("/courses").then(({ data }) => {
      setCourses(data.courses);
      const selected = searchParams.get("course") || data.courses[0]?._id || "";
      setValue("selectedCourse", selected);
    });
  }, [searchParams, setValue]);

  useEffect(() => {
    if (profilePreview) {
      requestAnimationFrame(() => {
        profilePictureRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [profilePreview]);

  const handleNumericKeyDown = (e) => {
    const char = e.key;
    if (!/^\d$/.test(char) && char !== "Backspace" && char !== "Delete" && char !== "Tab") {
      e.preventDefault();
    }
  };

  const handleNumericPaste = (e, fieldName, maxLength) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericOnly = pastedData.replace(/\D/g, "").slice(0, maxLength);
    setValue(fieldName, numericOnly, { shouldValidate: true });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setMessage("Please upload a JPG or PNG image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be less than 2MB");
      return;
    }

    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImageSrc(e.target.result);
      setShowCropModal(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedDataUrl) => {
    setProfilePreview(croppedDataUrl);
    setShowCropModal(false);
    setCropImageSrc("");
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropImageSrc("");
    setProfileFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeProfile = () => {
    setProfileFile(null);
    setProfilePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = async () => {
    const valid = await trigger([
      "fullName", "fatherName", "dateOfBirth", "email",
      "phone", "fatherPhone", "cnic", "fatherCnic", "address"
    ]);

    const phoneError = !isPhoneValid(watchedValues.phone || "");
    const fatherPhoneError = !isPhoneValid(watchedValues.fatherPhone || "");
    const cnicError = !isCnicValid(watchedValues.cnic || "");
    const fatherCnicError = !isCnicValid(watchedValues.fatherCnic || "");

    if (phoneError || fatherPhoneError || cnicError || fatherCnicError) {
      setMessage("Please fix validation errors before proceeding");
      return;
    }

    if (valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submit = async (values) => {
    if (!isPhoneValid(values.phone) || !isPhoneValid(values.fatherPhone) ||
        !isCnicValid(values.cnic) || !isCnicValid(values.fatherCnic)) {
      setMessage("Please ensure phone numbers use 03XXXXXXXXX format and CNIC fields are correctly filled");
      return;
    }

    if (!profilePreview) {
      setMessage("Profile picture is required");
      return;
    }

    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/admissions", {
        ...values,
        hasLaptop: values.hasLaptop === "true",
        profilePicture: profilePreview
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/student");
      }, 2500);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-enter relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-white py-6 sm:py-10 dark:bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(16,69,184,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#020617,#0f172a)]" />

      {showCropModal && cropImageSrc && (
        <CropModal
          imageSrc={cropImageSrc}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="animate-fade-up w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl dark:bg-slate-900 sm:p-7">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 sm:h-16 sm:w-16">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
              Registration Successfully Submitted
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Redirecting you to the student dashboard...
            </p>
            <button className="btn-primary mt-5 min-h-[44px] w-full" onClick={() => navigate("/dashboard/student")} type="button">
              OK
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black text-[#1045b8] shadow-sm backdrop-blur dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200 sm:px-4 sm:py-2 sm:text-sm">
            HMITC Admission Portal
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
            Start Your <span className="bg-gradient-to-r from-[#1045b8] via-blue-500 to-[#f59e0b] bg-clip-text text-transparent">Admission Journey</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-lg sm:leading-8">
            Start your journey towards IT literacy. Fill out the form to apply for admission.
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:mb-6 sm:rounded-[2rem] sm:p-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {[1, 2].map((item) => (
              <div className="flex flex-1 items-center gap-2 sm:gap-3" key={item}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black shadow-sm sm:h-11 sm:w-11 sm:text-sm ${step >= item ? "bg-gradient-to-br from-[#1045b8] to-[#0d3b8e] text-white" : "bg-slate-100 text-slate-500"}`}>
                  {step > item ? <CheckCircle2 size={18} /> : item}
                </span>
                <div>
                  <p className="text-xs font-black text-slate-950 dark:text-white sm:text-sm">Step {item} / 2</p>
                  <p className="hidden text-xs text-slate-500 sm:block">
                    {item === 1 ? "Personal Information" : "Education & Technical Details"}
                  </p>
                </div>
                {item === 1 && (
                  <div className="hidden h-1 flex-1 rounded-full bg-slate-200 sm:block">
                    <div className={`h-1 rounded-full bg-gradient-to-r from-[#1045b8] to-[#f59e0b] ${step === 2 ? "w-full" : "w-1/2"}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:rounded-[2rem] sm:p-6 md:p-8" onSubmit={handleSubmit(submit)}>
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1045b8] sm:text-sm">Step One</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">Personal Information</h2>
                </div>
                <span className="w-fit rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-[#0d3b8e]">Required fields</span>
              </div>
              <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2 sm:gap-4 sm:mt-5">
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Full Name</span>
                  <input
                    className={`${errors.fullName ? "input h-11 sm:h-12 rounded-2xl border-red-500 ring-2 ring-red-500/20" : "input h-11 sm:h-12 rounded-2xl"} input-animate`}
                    {...register("fullName", { required: "Full name is required" })}
                  />
                  <FieldError message={errors.fullName?.message} />
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Father Name</span>
                  <input
                    className={errors.fatherName ? "input h-11 sm:h-12 rounded-2xl border-red-500 ring-2 ring-red-500/20" : "input h-11 sm:h-12 rounded-2xl"}
                    {...register("fatherName", { required: "Father name is required" })}
                  />
                  <FieldError message={errors.fatherName?.message} />
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Date of Birth</span>
                  <input
                    className="input h-11 sm:h-12 rounded-2xl"
                    type="date"
                    {...register("dateOfBirth", { required: "Date of birth is required" })}
                  />
                  <FieldError message={errors.dateOfBirth?.message} />
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Email</span>
                  <input
                    className="input h-11 sm:h-12 rounded-2xl"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  <FieldError message={errors.email?.message} />
                </label>

                <label>
                  <span className="text-xs font-semibold sm:text-sm">Phone Number (03XXXXXXXXX)</span>
                  <input
                    className={`${getInputClass(phoneValid, errors.phone || (watchedValues.phone?.length > 0 && !phoneValid))} rounded-2xl`}
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="03001234567"
                    {...register("phone", {
                      required: "Phone is required",
                      validate: (v) => isPhoneValid(v) || "Must be Pakistani number format 03XXXXXXXXX"
                    })}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, "phone", 11)}
                  />
                  <div className="mt-1 flex justify-between">
                    <FieldError message={errors.phone?.message} />
                    <span className={`text-xs ${phoneValid ? "text-emerald-600" : "text-slate-400"}`}>
                      {watchedValues.phone?.length || 0}/11
                    </span>
                  </div>
                </label>

                <label>
                  <span className="text-xs font-semibold sm:text-sm">Father Phone (03XXXXXXXXX)</span>
                  <input
                    className={`${getInputClass(fatherPhoneValid, errors.fatherPhone || (watchedValues.fatherPhone?.length > 0 && !fatherPhoneValid))} rounded-2xl`}
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="03001234567"
                    {...register("fatherPhone", {
                      required: "Father phone is required",
                      validate: (v) => isPhoneValid(v) || "Must be Pakistani number format 03XXXXXXXXX"
                    })}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, "fatherPhone", 11)}
                  />
                  <div className="mt-1 flex justify-between">
                    <FieldError message={errors.fatherPhone?.message} />
                    <span className={`text-xs ${fatherPhoneValid ? "text-emerald-600" : "text-slate-400"}`}>
                      {watchedValues.fatherPhone?.length || 0}/11
                    </span>
                  </div>
                </label>

                <label>
                  <span className="text-xs font-semibold sm:text-sm">CNIC (13 digits)</span>
                  <input
                    className={`${getInputClass(cnicValid, errors.cnic || (watchedValues.cnic?.length > 0 && !cnicValid))} rounded-2xl`}
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="4210112345671"
                    {...register("cnic", {
                      required: "CNIC is required",
                      validate: (v) => isCnicValid(v) || "Must be exactly 13 digits"
                    })}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, "cnic", 13)}
                  />
                  <div className="mt-1 flex justify-between">
                    <FieldError message={errors.cnic?.message} />
                    <span className={`text-xs ${watchedValues.cnic?.length === 13 ? "text-emerald-600" : "text-slate-400"}`}>
                      {watchedValues.cnic?.length || 0}/13
                    </span>
                  </div>
                </label>

                <label>
                  <span className="text-xs font-semibold sm:text-sm">Father CNIC (13 digits)</span>
                  <input
                    className={`${getInputClass(fatherCnicValid, errors.fatherCnic || (watchedValues.fatherCnic?.length > 0 && !fatherCnicValid))} rounded-2xl`}
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="4210112345671"
                    {...register("fatherCnic", {
                      required: "Father CNIC is required",
                      validate: (v) => isCnicValid(v) || "Must be exactly 13 digits"
                    })}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, "fatherCnic", 13)}
                  />
                  <div className="mt-1 flex justify-between">
                    <FieldError message={errors.fatherCnic?.message} />
                    <span className={`text-xs ${watchedValues.fatherCnic?.length === 13 ? "text-emerald-600" : "text-slate-400"}`}>
                      {watchedValues.fatherCnic?.length || 0}/13
                    </span>
                  </div>
                </label>

                <label className="md:col-span-2">
                  <span className="flex items-center justify-between text-xs font-semibold sm:text-sm">
                    Address <span className="font-normal text-slate-500">({addressLength}/220)</span>
                  </span>
                  <textarea
                    className={errors.address ? "input min-h-24 sm:min-h-28 rounded-2xl border-red-500" : "input min-h-24 sm:min-h-28 rounded-2xl"}
                    maxLength={220}
                    {...register("address", { required: "Address is required" })}
                  />
                  <FieldError message={errors.address?.message} />
                </label>
              </div>
              <div ref={profilePictureRef} className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:mt-6 sm:rounded-3xl sm:p-5">
                <span className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">Student Profile Picture *</span>
                <div className="relative">
                  {profilePreview ? (
                    <div className="relative">
                      <img
                        src={profilePreview}
                        alt="Profile Preview"
                        className="h-24 w-24 rounded-full object-cover border-4 border-academy-blue shadow-lg sm:h-32 sm:w-32"
                      />
                      <button
                        type="button"
                        onClick={removeProfile}
                        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-academy-blue hover:text-academy-blue dark:border-slate-600 dark:bg-slate-800 sm:h-32 sm:w-32"
                    >
                      <Camera size={28} className="sm:h-8 sm:w-8" />
                      <span className="mt-1 text-xs">Upload Photo</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">JPG/PNG, max 2MB</p>
                {message.includes("Profile") && (
                  <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
                )}
              </div>
              <div className="mt-5 flex justify-end sm:mt-6">
                <button className="btn-press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-4 py-2.5 text-sm font-black text-white shadow-lg sm:px-6 sm:py-3" onClick={nextStep} type="button">
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1045b8] sm:text-sm">Step Two</p>
                  <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">Education & Technical Details</h2>
                </div>
                <span className="w-fit rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-[#0d3b8e]">Final review</span>
              </div>
              <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2 sm:gap-4 sm:mt-5">
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Select Course</span>
                  <select className="input h-11 sm:h-12 rounded-2xl" {...register("selectedCourse")}>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                  {selectedCourse && (
                    <div className={`mt-2 rounded-xl p-3 text-sm font-medium ${
                      (selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40) === 0
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : (selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40) <= 5
                        ? "border border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border border-green-200 bg-green-50 text-green-700"
                    }`}>
                      {(selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40) === 0
                        ? "🔴 This course is full. No seats available."
                        : (selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40) <= 5
                        ? `🟡 Only ${selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40} seats remaining - Enroll soon!`
                        : `🟢 ${selectedCourse.seatsAvailable ?? selectedCourse.totalSeats ?? 40} seats available out of ${selectedCourse.totalSeats || 40}`}
                    </div>
                  )}
                  {isCourseFull && (
                    <div className="mt-2 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-red-700">
                      <div className="text-sm font-black">🔴 This course is currently FULL</div>
                      <div className="mt-1 text-xs font-medium">No seats available. Admission is closed.</div>
                    </div>
                  )}
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Computer Proficiency</span>
                  <select className="input h-11 sm:h-12 rounded-2xl" {...register("computerProficiency", { required: "Required" })}>
                    <option value="">Select</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <FieldError message={errors.computerProficiency?.message} />
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Last Qualification</span>
                  <select className="input h-11 sm:h-12 rounded-2xl" {...register("lastQualification", { required: "Required" })}>
                    <option value="">Select</option>
                    <option>Matric</option>
                    <option>Intermediate</option>
                    <option>Graduate</option>
                    <option>Other</option>
                  </select>
                  <FieldError message={errors.lastQualification?.message} />
                </label>
                <label>
                  <span className="text-xs font-semibold sm:text-sm">Where did you hear about us?</span>
                  <select className="input h-11 sm:h-12 rounded-2xl" {...register("referralSource", { required: "Required" })}>
                    <option value="">Select</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Friend</option>
                    <option>Google</option>
                    <option>Other</option>
                  </select>
                  <FieldError message={errors.referralSource?.message} />
                </label>
                <div>
                  <span className="text-xs font-semibold sm:text-sm">Do you have a Laptop?</span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <label className={`flex cursor-pointer min-h-[44px] items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold ${watchedValues.hasLaptop === "true" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300"}`}>
                      <input type="radio" value="true" {...register("hasLaptop", { required: "Required" })} />
                      Yes
                    </label>
                    <label className={`flex cursor-pointer min-h-[44px] items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold ${watchedValues.hasLaptop === "false" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300"}`}>
                      <input type="radio" value="false" {...register("hasLaptop", { required: "Required" })} />
                      No
                    </label>
                  </div>
                  <FieldError message={errors.hasLaptop?.message} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-700 sm:mt-6">
                <p className="font-bold text-slate-950">Important Notice</p>
                <p>Please ensure all information is accurate. Incomplete or false information may result in rejection.</p>
              </div>

              {message && (
                <p className={`mt-4 rounded-md p-3 text-sm ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {message}
                </p>
              )}

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:mt-6">
                <button className="btn-secondary min-h-[44px] rounded-xl" onClick={() => setStep(1)} type="button">
                  <ArrowLeft size={16} /> Back
                </button>
                <button className={`btn-press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-4 py-2.5 text-sm font-black text-white shadow-lg disabled:opacity-70 sm:px-6 sm:py-3 ${isCourseFull ? "cursor-not-allowed opacity-50" : ""}`} disabled={submitting || isCourseFull} type="submit">
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {isCourseFull ? "🔴 Admissions Closed" : "Submit Registration"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default AdmissionPage;
