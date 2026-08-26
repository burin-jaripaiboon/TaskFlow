import { motion } from 'framer-motion';
import type { ReactNode } from 'react';


export default function SlideUp({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut', delay: delay }}
    >
      {children}
    </motion.div>
  );
}