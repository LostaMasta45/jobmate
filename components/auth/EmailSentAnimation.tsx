"use client";

import { motion } from "framer-motion";

export const EmailSentAnimation = () => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
      {/* Background Circle Pulse */}
      <motion.div
        className="absolute inset-0 bg-brand/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-4 bg-brand/20 rounded-full"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />

      {/* Mail Icon Container */}
      <div className="relative z-10 bg-brand text-white p-5 rounded-2xl shadow-xl shadow-brand/30">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ y: 0 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <motion.path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.svg>

        {/* Flying Paper Plane */}
        <motion.div
          className="absolute -right-6 -top-6 text-brand-foreground bg-white p-2 rounded-full shadow-lg"
          initial={{ x: -20, y: 20, opacity: 0, scale: 0 }}
          animate={{ 
            x: [0, 10, 20, 40], 
            y: [0, -10, -20, -40], 
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 1,
            ease: "easeOut" 
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0066FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.8 11.3 2 22l10.7-3.79" />
            <path d="M4 6h16l-2.67 2.67" />
            <path d="M4 6 22 2" />
            <path d="m14.7 11.3-5.07 2.33" />
            <path d="m22 2-6.3 13.07" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
