"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FloatingNavbar = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    // Check if scrolled down
    if (typeof current === "number") {
        if (current > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }

        // Hide on scroll down (optional, maybe annoying for some users, I'll keep it visible for now or just minimal change)
        // For now, let's just change style on scroll
    }
  });

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl transition-all duration-300 px-4",
        scrolled ? "top-4" : "top-8"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300",
          scrolled
            ? "bg-black/50 backdrop-blur-md border-white/10 shadow-lg"
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/lp" className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
                J
            </div>
            <span className={cn("text-white transition-opacity", scrolled ? "opacity-100" : "opacity-0 md:opacity-100")}>
                JobMate
            </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <Link href="#features" className="hover:text-white transition-colors">Fitur</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Harga</Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">Testimoni</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-neutral-300 hover:text-white hidden sm:block">
                Masuk
            </Link>
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-neutral-200">
                Mulai Gratis
            </Button>
        </div>
      </div>
    </motion.div>
  );
};
