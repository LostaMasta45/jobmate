"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const NavbarDynamic = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-full px-4 sm:px-0",
        scrolled ? "max-w-xl top-4" : "max-w-6xl top-6",
         "opacity-100 translate-y-0" 
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-full border transition-all duration-500 backdrop-blur-xl",
          scrolled
            ? "bg-black/80 border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] pl-6 pr-3"
            : "bg-transparent border-transparent pl-4 pr-4"
        )}
      >
        {/* Logo */}
        <Link href="/lp" className="flex items-center gap-3 group">
             <div className="relative h-8 w-32 overflow-hidden">
                <Image 
                    src="/Logo/logopanjang.png" 
                    alt="JobMate Logo" 
                    fill
                    className="object-contain object-left"
                    priority
                />
             </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className={cn(
            "hidden md:flex items-center gap-1 transition-all duration-500",
            scrolled ? "opacity-100 translate-x-0" : "opacity-100"
        )}>
            {navLinks.map((link) => (
                <Link 
                    key={link.href} 
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-full transition-colors relative group"
                >
                    {link.label}
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <Link href="/login" className={cn(
                "text-sm font-medium text-white hover:text-brand transition-colors px-4 hidden md:block",
                scrolled ? "hidden" : "block"
            )}>
                Masuk
            </Link>
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-neutral-200 font-medium px-5 h-9">
                Mulai
            </Button>
             
             {/* Mobile Menu Toggle */}
             <button 
                className="md:hidden p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
                 {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
        <div
            className="fixed inset-x-4 top-24 z-40 p-4 rounded-3xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 md:hidden shadow-2xl animate-in slide-in-from-top-2 fade-in duration-300"
        >
            <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-neutral-300 hover:text-white transition-colors"
                >
                    Masuk
                </Link>
            </div>
        </div>
    )}
    </>
  );
};

const navLinks = [
    { label: "Fitur", href: "#features" },
    { label: "Harga", href: "#pricing" },
    { label: "Testimoni", href: "#testimonials" },
];
