import React from "react";
import { motion } from "framer-motion";

export default function Seal({ cracked = false }: { cracked?: boolean }) {
  return (
    <motion.div
      className="seal"
      initial={{ scale: 1 }}
      animate={cracked ? { scale: [1, 1.05, 0.95, 1.2, 0.0], opacity: [1, 1, 0.8, 0.5, 0] } : { scale: 1 }}
      transition={{ duration: cracked ? 1.2 : 0.4 }}
      aria-hidden
    >
      <div className="seal-crest">❤</div>
      <svg className="seal-crack" width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M5 20 L20 18 L25 22 L35 17 L45 23 L55 19 L65 21 L75 20" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}
