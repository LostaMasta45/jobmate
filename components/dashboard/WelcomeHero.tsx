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

  useEffect(() => {
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

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
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
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 blur-3xl" />

                <div className="relative space-y-6 text-center">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center"
                  >
                    <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                      <AvatarImage src={avatarUrl || undefined} alt={userName} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
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
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {getTimeGreeting()}! 👋
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
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-lg">
              <AvatarImage src={avatarUrl || undefined} alt={userName} />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            {/* Text content */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {getTimeGreeting()}, {userName.split(' ')[0]}!
                </h1>
                <motion.div
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  👋
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <GreetingIcon className="h-3.5 w-3.5 text-primary" />
                {greeting.text}
              </p>
            </div>
          </div>

          {/* Stats badge */}
          {totalApplications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl px-5 py-3 border border-primary/20"
            >
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{totalApplications}</span>
                <p className="text-xs text-muted-foreground">Total Lamaran</p>
              </div>
              <div className="h-8 w-px bg-primary/20" />
              <GreetingIcon className="h-6 w-6 text-primary" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
