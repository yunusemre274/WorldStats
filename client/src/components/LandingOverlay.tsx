import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingOverlay({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Allow exit animation to finish
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(157,78,221,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(157,78,221,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-white to-neon-pink tracking-tighter text-center"
        >
          WORLD DATA
          <br />
          MATRIX
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-1 bg-neon-pink mt-4 shadow-[0_0_15px_#ff1b6b]"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 font-mono text-neon-purple/70 text-sm tracking-[0.5em] animate-pulse"
        >
          INITIALIZING SYSTEM...
        </motion.div>
      </div>
    </motion.div>
  );
}
