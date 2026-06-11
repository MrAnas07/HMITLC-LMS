// ============================================
// HMITLC LMS - Premium Animation Variants
// Professional SaaS-style motion design
// ============================================

// Timing constants - consistent throughout app
export const TIMING = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  slowest: 0.5,
};

// Easing - smooth, professional curves
export const EASING = {
  gentle: [0.25, 0.1, 0.25, 1],
  smooth: [0.4, 0, 0.2, 1],
  crisp: [0.25, 0.25, 0.25, 1],
  elegant: [0.22, 1, 0.36, 1],
  premium: [0.16, 1, 0.3, 1],
};

// Base variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.normal, ease: EASING.elegant } },
};

export const scaleInPop = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.fast, ease: EASING.elegant } },
};

// Stagger container for lists/grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Stagger children variants
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
};

export const staggerItemFast = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASING.smooth } },
  exit: { opacity: 0, y: -8, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Card hover variants - subtle, premium
export const cardHover = {
  rest: { y: 0, transition: { duration: TIMING.fast, ease: EASING.smooth } },
  hover: { y: -2, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

export const cardHoverScale = {
  rest: { scale: 1, transition: { duration: TIMING.fast, ease: EASING.smooth } },
  hover: { scale: 1.01, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Button variants - subtle press effect
export const buttonTap = {
  rest: { scale: 1, transition: { duration: TIMING.instant } },
  tap: { scale: 0.98, transition: { duration: TIMING.instant } },
  hover: { scale: 1.02, transition: { duration: TIMING.fast, ease: EASING.gentle } },
};

// Input focus animation
export const inputFocus = {
  rest: { scale: 1, transition: { duration: TIMING.fast } },
  focus: { scale: 1.01, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Modal/dialog variants
export const modalIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.normal, ease: EASING.elegant } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

export const overlayIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: TIMING.fast, ease: EASING.smooth } },
  exit: { opacity: 0, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Navbar variants - slide down on load
export const navbarSlide = {
  hidden: { y: -60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: TIMING.slow, ease: EASING.smooth } },
};

// Loading skeleton shimmer
export const shimmer = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
};

// Toast notification slide
export const toastSlide = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: TIMING.fast, ease: EASING.elegant } },
  exit: { opacity: 0, x: 20, transition: { duration: TIMING.fast, ease: EASING.smooth } },
};

// Icon button hover
export const iconHover = {
  rest: { scale: 1, transition: { duration: TIMING.fast } },
  hover: { scale: 1.1, transition: { duration: TIMING.fast, ease: EASING.gentle } },
};

// Tab indicator slide
export const tabSlide = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: TIMING.normal, ease: EASING.elegant } },
};

// Avatar scale
export const avatarHover = {
  rest: { scale: 1, transition: { duration: TIMING.fast } },
  hover: { scale: 1.05, transition: { duration: TIMING.fast, ease: EASING.gentle } },
};

// List item enter from right (for sidebar items)
export const listItemEnter = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: TIMING.fast,
      ease: EASING.smooth,
    },
  }),
};

// Progress bar fill
export const progressFill = {
  hidden: { width: "0%" },
  visible: { width: "100%", transition: { duration: TIMING.slow, ease: EASING.smooth } },
};

// Reduced motion variants
export const reducedMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

// Combined variants for convenience
export const pageVariants = {
  initial: fadeInUp.hidden,
  animate: fadeInUp.visible,
  exit: { opacity: 0, transition: { duration: TIMING.fast } },
};

export const cardVariants = {
  ...fadeInUp,
  hover: cardHover.hover,
};

export const buttonVariants = {
  ...buttonTap,
};