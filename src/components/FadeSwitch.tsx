import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeSwitch({ children, style }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={style}>
      {children}
    </motion.div>
  );
}
