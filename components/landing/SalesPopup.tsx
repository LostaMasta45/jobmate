"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

// Types
type NotificationType = "premium" | "basic" | "upgrade";

interface Notification {
  type: NotificationType;
  name: string;
  location: string;
  timeAgo: string;
}

interface CopyTemplate {
  message: string;
  cta?: string;
  link?: string;
}

// Data fallback dengan distribusi sesuai bobot
const notifications: Notification[] = [
  // PREMIUM (70%) - 14 items
  { type: "premium", name: "Rani P.", location: "Mojowarno", timeAgo: "baru saja" },
  { type: "premium", name: "Bima A.", location: "Sumobito", timeAgo: "1 menit lalu" },
  { type: "premium", name: "Dina K.", location: "Peterongan", timeAgo: "3 menit lalu" },
  { type: "premium", name: "Fajar R.", location: "Jombang Kota", timeAgo: "5 menit lalu" },
  { type: "premium", name: "Nadia S.", location: "Mojoagung", timeAgo: "8 menit lalu" },
  { type: "premium", name: "Raka M.", location: "Diwek", timeAgo: "12 menit lalu" },
  { type: "premium", name: "Sari L.", location: "Tembelang", timeAgo: "15 menit lalu" },
  { type: "premium", name: "Bayu T.", location: "Ploso", timeAgo: "20 menit lalu" },
  { type: "premium", name: "Aldi W.", location: "Bareng", timeAgo: "22 menit lalu" },
  { type: "premium", name: "Lina M.", location: "Megaluh", timeAgo: "25 menit lalu" },
  { type: "premium", name: "Eko S.", location: "Ngusikan", timeAgo: "28 menit lalu" },
  { type: "premium", name: "Maya R.", location: "Sumobito", timeAgo: "32 menit lalu" },
  { type: "premium", name: "Rizki D.", location: "Mojowarno", timeAgo: "35 menit lalu" },
  { type: "premium", name: "Tina A.", location: "Jombang Kota", timeAgo: "38 menit lalu" },
  
  // BASIC (20%) - 4 items
  { type: "basic", name: "Dika H.", location: "Kertosono", timeAgo: "25 menit lalu" },
  { type: "basic", name: "Wulan E.", location: "Mojokerto", timeAgo: "30 menit lalu" },
  { type: "basic", name: "Putra J.", location: "Kediri", timeAgo: "35 menit lalu" },
  { type: "basic", name: "Ayu F.", location: "Ngoro", timeAgo: "40 menit lalu" },
  
  // UPGRADE (10%) - 2 items
  { type: "upgrade", name: "Yogi N.", location: "Bandarkedungmulyo", timeAgo: "45 menit lalu" },
  { type: "upgrade", name: "Lala Q.", location: "Kesamben", timeAgo: "50 menit lalu" },
];

// Copy templates per type
const premiumCopies = [
  "{name} baru saja berlangganan **VIP PREMIUM (Lifetime)** ✅",
  "{name} upgrade ke **VIP PREMIUM**, semua tools JobMate kebuka!",
  "{name} mengaktifkan **VIP PREMIUM** — akses selamanya 🎉",
  "{name} ambil **Premium**. CV ATS + Email Lamaran + Tracker aktif!",
  "{name} mengamankan **Premium (Lifetime)** — siap kerja tiap hari.",
  "{name} sukses **VIP PREMIUM**: Portal + Grup + Semua Tools ✅",
  "{name} memilih **Paket Rekomendasi Admin — PREMIUM** ⭐",
  "{name} Premium aktif. \"Sekali bayar, selamanya tenang.\"",
  "{name} mengaktifkan **VIP PREMIUM** — Interview Guide & Template siap!",
  "{name} Premium on! Simpan 5 loker favorit barusan.",
];

const basicCopies = [
  "{name} gabung **VIP BASIC** — Grup WA & Portal aktif.",
  "{name} berlangganan **BASIC (Bulanan)** — mulai pantau loker harian.",
  "{name} aktifkan **Basic** — cocok buat coba dulu.",
  "{name} masuk **VIP BASIC** — dapat Template CV ATS gratis.",
];

const upgradeCopies = [
  "{name} barusan **upgrade dari BASIC ke PREMIUM** 🎯",
  "{name} naik kelas ke **VIP PREMIUM (Lifetime)** — hemat jangka panjang!",
  "{name} upgrade sukses → **semua tools JobMate** sekarang terbuka.",
];

// Mask name for privacy (R***i)
const maskName = (name: string): string => {
  const [first, last] = name.split(" ");
  if (first.length <= 2) return first + (last ? " " + last[0] + "." : "");
  return first[0] + "***" + first[first.length - 1] + (last ? " " + last[0] + "." : "");
};

// Get random item from array
const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Get CTA config based on type
const getCTA = (type: NotificationType): { text: string; link: string } | null => {
  switch (type) {
    case "premium":
      return { text: "Ambil Premium", link: "/vip?plan=premium" };
    case "basic":
      return { text: "Upgrade Sekarang", link: "/vip?plan=premium&from=basic" };
    case "upgrade":
      return { text: "Lihat Detail", link: "/vip?plan=premium" };
    default:
      return null;
  }
};

export function SalesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState<Notification | null>(null);
  const [message, setMessage] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastShownName, setLastShownName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user dismissed popup in this session
    const dismissed = sessionStorage.getItem("sales-popup-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Function to show next notification
    const showNextNotification = () => {
      // Filter to not show same name consecutively
      const availableNotifs = notifications.filter(n => n.name !== lastShownName);
      
      // Get random notification (already weighted by array distribution)
      const notif = random(availableNotifs);
      setLastShownName(notif.name);

      // Get random copy template based on type
      let template = "";
      switch (notif.type) {
        case "premium":
          template = random(premiumCopies);
          break;
        case "basic":
          template = random(basicCopies);
          break;
        case "upgrade":
          template = random(upgradeCopies);
          break;
      }

      // Replace placeholders
      const maskedName = maskName(notif.name);
      const msg = template.replace("{name}", maskedName);

      setMessage(msg);
      setCurrentNotif(notif);
      setIsVisible(true);

      // Hide after 5-7 seconds (random)
      const hideDelay = 5000 + Math.random() * 2000; // 5-7 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Show first notification after 5-10 seconds
    const initialDelay = 5000 + Math.random() * 5000; // 5-10 seconds
    const initialTimer = setTimeout(showNextNotification, initialDelay);

    // Setup rotation (every 2 minutes = 120000ms)
    const rotationInterval = setInterval(() => {
      if (!isDismissed) {
        showNextNotification();
      }
    }, 120000); // Every 2 minutes

    return () => {
      clearTimeout(initialTimer);
      clearInterval(rotationInterval);
    };
  }, [isDismissed, lastShownName]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("sales-popup-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && currentNotif && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 z-[100] max-w-xs sm:max-w-sm"
          role="status"
          aria-live="polite"
          onMouseEnter={(e) => {
            // Pause animation on hover (prevent auto-hide)
            e.currentTarget.style.animationPlayState = "paused";
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 relative overflow-hidden">
            {/* Accent bar based on type */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                currentNotif.type === "premium"
                  ? "bg-gradient-to-r from-amber-400 to-orange-400"
                  : currentNotif.type === "upgrade"
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-emerald-400 to-green-400"
              }`}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                {currentNotif.name[0]}
              </div>

              {/* Message */}
              <div className="flex-1 pr-6">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug mb-1">
                  {message}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {currentNotif.timeAgo} • {currentNotif.location}
                </p>

                {/* CTA Button (optional) */}
                {getCTA(currentNotif.type) && (
                  <Link
                    href={getCTA(currentNotif.type)!.link}
                    className={`inline-block mt-2 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all hover:scale-105 ${
                      currentNotif.type === "premium"
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 hover:from-amber-500 hover:to-orange-500"
                        : currentNotif.type === "upgrade"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {getCTA(currentNotif.type)!.text} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
