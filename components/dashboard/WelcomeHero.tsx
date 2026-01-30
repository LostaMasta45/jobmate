"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Zap } from "lucide-react";

interface WelcomeHeroProps {
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
  totalApplications: number;
}

const typewriterTexts = [
  "Mulai karir impianmu hari ini! 🚀",
  "Satu langkah lebih dekat menuju sukses. ✨",
  "Kamu luar biasa, jangan menyerah! 💪",
  "Rezeki gak bakal ketuker, gas terus! 🔥",
  "Hari ini penuh peluang, ambil semuanya! 🌟",
  "Percaya pada proses, hasilnya akan manis. 🍬",
  "Fokus, konsisten, dan berdoa. 🙏"
];

function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Typewriter effect
  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500); // Wait before deleting
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length); // Next quote
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 50); // Typing speed vs Deleting speed

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="inline-flex items-center">
      {texts[index].substring(0, subIndex)}
      <span className={`ml-1 w-[2px] h-4 bg-primary ${blink ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}

export function WelcomeHero({ userName, userEmail, avatarUrl, totalApplications }: WelcomeHeroProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [timeGreeting, setTimeGreeting] = useState("Selamat Siang");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate time-based greeting on client only
    const hour = new Date().getHours();
    let greeting = "Selamat Siang";
    if (hour < 4) greeting = "Selamat Malam";
    else if (hour < 11) greeting = "Selamat Pagi";
    else if (hour < 15) greeting = "Selamat Siang";
    else if (hour < 18) greeting = "Selamat Sore";
    else greeting = "Selamat Malam";

    setTimeGreeting(greeting);
    setMounted(true);

    // Check if welcome was shown in this session
    const welcomed = sessionStorage.getItem("welcomed");
    if (welcomed) {
      setShowWelcome(false);
    } else {
      sessionStorage.setItem("welcomed", "true");
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Welcome Popup - Shows once per session */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="relative px-4 w-full flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative w-full max-w-md overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-8 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8e68fd]/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00d1dc]/20 rounded-full -ml-16 -mb-16 blur-3xl" />

                <div className="relative space-y-6 text-center">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center"
                  >
                    <Avatar className="h-20 w-20 ring-4 ring-[#8e68fd]/30">
                      <AvatarImage src={avatarUrl || undefined} alt={userName} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#8e68fd] to-[#5547d0] text-white">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Greeting */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8e68fd] to-[#00d1dc] bg-clip-text text-transparent">
                      {timeGreeting}! 👋
                    </h2>
                    <p className="text-2xl font-semibold">{userName}</p>
                    {/* Dynamic Typewriter Text in Popup */}
                    <div className="h-6 flex items-center justify-center text-sm font-medium text-primary/80">
                      <TypewriterText texts={typewriterTexts} />
                    </div>
                  </motion.div>

                  {totalApplications > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-primary/10 rounded-lg p-3"
                    >
                      <p className="text-sm text-muted-foreground">
                        Kamu sudah melamar ke{" "}
                        <span className="font-bold text-primary">{totalApplications}</span> perusahaan
                      </p>
                    </motion.div>
                  )}

                  {/* Close hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    Klik di mana saja untuk menutup
                  </motion.p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Header - Always visible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <Avatar className="h-12 w-12 ring-2 ring-[#8e68fd]/30 shadow-md flex-shrink-0">
              <AvatarImage src={avatarUrl || undefined} alt={userName} />
              <AvatarFallback className="text-base font-bold bg-gradient-to-br from-[#8e68fd] to-[#5547d0] text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words">
                  {timeGreeting}, {userName.split(' ')[0]}!
                </h1>
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg flex-shrink-0"
                >
                  👋
                </motion.span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 h-5">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0" />
                <TypewriterText texts={typewriterTexts} />
              </p>
            </div>
          </div>

          {/* Stats badge */}
          {totalApplications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="hidden md:flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#8e68fd]/10 to-[#5547d0]/5 rounded-lg px-3 sm:px-4 py-2 border border-[#8e68fd]/20"
            >
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-primary">{totalApplications}</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Lamaran</p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
