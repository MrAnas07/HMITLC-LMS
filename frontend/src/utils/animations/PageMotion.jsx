// ============================================
// HMITLC LMS - Page Motion Component
// Standalone for route transitions
// ============================================

import { motion } from "framer-motion";

// Premium page transition - subtle, professional
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransitionOptions = {
  initial: pageTransition.initial,
  animate: pageTransition.animate,
  exit: pageTransition.exit,
  transition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
};

const PageMotion = ({ children }) => {
  return (
    <motion.div {...pageTransitionOptions}>
      {children}
    </motion.div>
  );
};

export default PageMotion;