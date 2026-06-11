// ============================================
// HMITLC LMS - Reusable Motion Components
// Premium Framer Motion components
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalIn,
  overlayIn,
  buttonTap,
  cardHover,
  iconHover,
  toastSlide,
  reducedMotion,
  TIMING,
} from "./variants";

// Check for reduced motion preference
const getReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Page wrapper with professional transitions
export const PageMotion = ({ children, className, delay = 0 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: TIMING.normal, ease: [0.4, 0, 0.2, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered grid container for cards/lists
export const StaggerContainer = ({ children, className, delayChildren = 0.05, stagger = 0.05 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem = ({ children, className, delay = 0, y = 16 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: TIMING.normal, ease: [0.4, 0, 0.2, 1], delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Premium card with hover effects
export const MotionCard = ({ children, className, hover = true, onClick }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return (
      <div className={`transition-all duration-200 ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: TIMING.normal, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: TIMING.fast, ease: [0.4, 0, 0.2, 1] } } : undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Premium button with tap effect
export const MotionButton = ({ children, className, onClick, type = "button", disabled }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`transition-transform duration-100 active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: TIMING.fast, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Input field with focus animation
export const MotionInput = ({ children, className }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: TIMING.fast, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Modal with overlay
export const MotionModal = ({ isOpen, onClose, children, className }) => {
  const reduced = getReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING.fast, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: TIMING.normal, ease: [0.22, 1, 0.36, 1] }}
            className={className}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Toast container with AnimatePresence
export const MotionToast = ({ children, onClose }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div>{children}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: TIMING.fast, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Navbar with slide down animation
export const NavbarMotion = ({ children, className }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: TIMING.slow, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Icon button with hover scale
export const MotionIconButton = ({ children, className, onClick }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return (
      <button onClick={onClick} className={`transition-transform duration-150 hover:scale-110 ${className}`}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: TIMING.fast }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Skeleton loader with shimmer
export const MotionSkeleton = ({ className, width, height }) => {
  return (
    <motion.div
      className={`shimmer ${className}`}
      style={{ width, height }}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Section fade in on scroll (use with useInView)
export const SectionMotion = ({ children, className, delay = 0 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: TIMING.normal, ease: [0.4, 0, 0.2, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Tab with slide indicator
export const MotionTab = ({ children, className, active, onClick }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

// Avatar with hover effect
export const MotionAvatar = ({ children, className }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={`transition-transform duration-150 hover:scale-105 ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: TIMING.fast }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// List item with slide from left
export const MotionListItem = ({ children, className, index = 0 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: TIMING.fast,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.03,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Progress bar with fill animation
export const MotionProgressBar = ({ value, className, max = 100 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return (
      <div className={className}>
        <div style={{ width: `${(value / max) * 100}%` }} />
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      animate={{ width: `${(value / max) * 100}%` }}
      transition={{ duration: TIMING.slow, ease: [0.4, 0, 0.2, 1] }}
    />
  );
};

// Floating element (subtle float effect)
export const MotionFloat = ({ children, className, y = 6, duration = 3 }) => {
  const reduced = getReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// Export all for convenience
export const Motion = {
  Page: PageMotion,
  Container: StaggerContainer,
  Item: StaggerItem,
  Card: MotionCard,
  Button: MotionButton,
  Input: MotionInput,
  Modal: MotionModal,
  Toast: MotionToast,
  Navbar: NavbarMotion,
  IconButton: MotionIconButton,
  Skeleton: MotionSkeleton,
  Section: SectionMotion,
  Tab: MotionTab,
  Avatar: MotionAvatar,
  ListItem: MotionListItem,
  ProgressBar: MotionProgressBar,
  Float: MotionFloat,
};

export default Motion;