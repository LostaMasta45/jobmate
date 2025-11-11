"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { LandingThemeToggle } from "./LandingThemeToggle";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Paket", href: "#pricing" },
    { label: "VIP Career", href: "/vip" },
    { label: "Tools JobMate", href: "#tools" },
    { label: "Kenapa Kami", href: "#why-infoloker" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative z-50">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 transition-transform group-hover:scale-105">
              <Image
                src="/logoinfolokerjombang.png"
                alt="InfoLokerJombang Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, 48px"
                priority
              />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground">InfoLokerJombang</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">VIP Career JobMate</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 relative z-50">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative z-50"
              >
                {item.label}
              </a>
            ))}
            <LandingThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold relative z-50"
            >
              <a href="#pricing">Gabung Sekarang</a>
            </Button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2 relative z-50">
            <LandingThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - SIMPLE CSS */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t relative z-50">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button
              asChild
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
                Gabung Sekarang
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
