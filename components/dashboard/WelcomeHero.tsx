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

const greetings = [
  { icon: Sparkles, text: "Semangat hari ini!" },
  { icon: Target, text: "Raih impianmu!" },
  { icon: TrendingUp, text: "Keep going!" },
  { icon: Zap, text: "You got this!" },
];

export function WelcomeHero({ userName, userEmail, avatarUrl, totalApplications }: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState(greetings[0]);
  const [showWelcome, setShowWelcome] = useState(true);
  // Fix hydration: time greeting generated on client only
  const [timeGreeting, setTimeGreeting] = useState("Selamat Siang"); // Default fallback
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate time-based greeting on client only
    const hour = new Date().getHours();
    let greeting = "Selamat Siang";
    if (hour < 12) greeting = "Selamat Pagi";
    else if (hour < 15) greeting = "Selamat Siang";
    else if (hour < 18) greeting = "Selamat Sore";
    else greeting = "Selamat Malam";
    setTimeGreeting(greeting);
    setMounted(true);
    
    // Random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);

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

  const GreetingIcon = greeting.icon;

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
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-8 shadow-2xl max-w-md">
                {/* Decorative elements - Purple/Cyan */}
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
                    <p className="text-muted-foreground text-sm">{userEmail}</p>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <GreetingIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{greeting.text}</span>
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
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <GreetingIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{greeting.text}</span>
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
              <GreetingIcon className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
