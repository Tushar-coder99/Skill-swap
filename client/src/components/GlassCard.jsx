import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", stack = false }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card p-6 ${stack ? 'shadow-2xl relative z-20' : 'shadow-xl'} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
