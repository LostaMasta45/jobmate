"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const StickyBottomCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8; // Show after scrolling past hero
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <div className="bg-neutral-900/90 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-400 line-through">Rp 99.000</p>
              <p className="text-lg font-bold text-white">Rp 39.000 <span className="text-xs font-normal text-brand">Lifetime</span></p>
            </div>
            <Link href="/payment">
              <Button size="sm" className="bg-brand hover:bg-brand-600 text-white rounded-xl px-6 shadow-lg shadow-brand/20">
                Ambil Akses <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
