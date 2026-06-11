import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Code2,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound
} from "lucide-react";

export const heroStats = [
  { value: 1200, suffix: "+", label: "active learners" },
  { value: 24, suffix: "+", label: "career courses" },
  { value: 18, suffix: "+", label: "expert mentors" }
];

export const stats = [
  { icon: UsersRound, value: 1200, suffix: "+", label: "Students trained" },
  { icon: BookOpenCheck, value: 24, suffix: "+", label: "Professional courses" },
  { icon: GraduationCap, value: 18, suffix: "+", label: "Expert teachers" },
  { icon: Award, value: 900, suffix: "+", label: "Certificates issued" }
];

export const features = [
  {
    icon: BriefcaseBusiness,
    title: "Job-ready skills",
    text: "Learn modern tools, workflows, and practical IT skills that map to real market needs."
  },
  {
    icon: UsersRound,
    title: "Expert teachers",
    text: "Study with instructors who combine classroom guidance with project-based mentoring."
  },
  {
    icon: Code2,
    title: "Real projects",
    text: "Build portfolio work across web, design, data, cybersecurity, and digital literacy."
  },
  {
    icon: Award,
    title: "Certifications",
    text: "Approved students receive verified identity cards and certificates for completed tracks."
  },
  {
    icon: CalendarClock,
    title: "Flexible timings",
    text: "Morning, afternoon, and evening options make learning easier around your routine."
  },
  {
    icon: Headphones,
    title: "Student support",
    text: "Admission tracking, teacher guidance, and admin support stay connected in one portal."
  }
];

export const testimonials = [
  {
    name: "Muhammad Anas",
    role: "Web & Mobile Student",
    quote: "HMITLC helped me move from basic computer knowledge to building real MERN projects with confidence.",
    avatar: "MA"
  },
  {
    name: "Areeba Khan",
    role: "Graphic Design Student",
    quote: "The classes feel practical, focused, and supportive. The admission dashboard made every step clear.",
    avatar: "AK"
  },
  {
    name: "Bilal Ahmed",
    role: "Cybersecurity Learner",
    quote: "I liked the small batches and teacher feedback. It feels like a serious institute, not just online notes.",
    avatar: "BA"
  }
];

export const trustPoints = [
  { icon: ShieldCheck, text: "Secure admissions" },
  { icon: Sparkles, text: "Premium learning paths" },
  { icon: CheckCircle2, text: "Admin-approved access" },
  { icon: Star, text: "Student-first support" }
];
