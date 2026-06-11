import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import CTASection from "../components/home/CTASection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import Testimonials from "../components/home/Testimonials";
import WhyChooseSection from "../components/home/WhyChooseSection";

const fallbackCourses = [
  {
    _id: "fallback-mern",
    title: "Web & Mobile App Development",
    slug: "web-mobile-app-development",
    description: "Master frontend, backend, APIs, databases, and deployment through practical real-world projects.",
    category: "Web Development",
    level: "Beginner",
    duration: "6 months",
    price: 0,
    averageRating: 4.9,
    teacher: { name: "HMITLC Faculty" },
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85"
  },
  {
    _id: "fallback-cyber",
    title: "Cybersecurity Foundations",
    slug: "cybersecurity-foundations",
    description: "Learn security fundamentals, web safety, ethical practices, and defensive digital skills.",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "12 weeks",
    price: 0,
    averageRating: 4.8,
    teacher: { name: "HMITLC Faculty" },
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    _id: "fallback-design",
    title: "Graphic Design & UI Basics",
    slug: "graphic-design-ui-basics",
    description: "Build visual design skills, branding foundations, UI principles, and portfolio-ready creative work.",
    category: "Design",
    level: "Beginner",
    duration: "10 weeks",
    price: 0,
    averageRating: 4.7,
    teacher: { name: "HMITLC Faculty" },
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85"
  }
];

const HomePage = () => {
  const [courses, setCourses] = useState(fallbackCourses);

  useEffect(() => {
    let mounted = true;

    api
      .get("/courses")
      .then(({ data }) => {
        if (mounted && data.courses?.length) {
          setCourses(data.courses.slice(0, 3));
        }
      })
      .catch(() => {
        if (mounted) setCourses(fallbackCourses);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <HeroSection />
      <FeaturedCourses courses={courses} />
      <WhyChooseSection />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </motion.div>
  );
};

export default HomePage;
