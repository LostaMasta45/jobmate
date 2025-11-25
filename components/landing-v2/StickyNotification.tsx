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

// Data fallback with distribution
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
      return { text: "Ambil Premium", link: "#pricing" };
    case "basic":
      return { text: "Upgrade Sekarang", link: "#pricing" };
    case "upgrade":
      return { text: "Lihat Detail", link: "#pricing" };
    default:
      return null;
  }
};

// Parse bold markdown (**text**) to JSX
const parseMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export const StickyNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState<Notification | null>(null);
  const [message, setMessage] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastShownName, setLastShownName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user dismissed popup in this session
    const dismissed = sessionStorage.getItem("lp-sales-popup-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Function to show next notification
    const showNextNotification = () => {
      const availableNotifs = notifications.filter(n => n.name !== lastShownName);
      const notif = random(availableNotifs);
      setLastShownName(notif.name);

      let template = "";
      switch (notif.type) {
        case "premium": template = random(premiumCopies); break;
        case "basic": template = random(basicCopies); break;
        case "upgrade": template = random(upgradeCopies); break;
      }

      const maskedName = maskName(notif.name);
      const msg = template.replace("{name}", maskedName);

      setMessage(msg);
      setCurrentNotif(notif);
      setIsVisible(true);

      // Hide after 6-8 seconds
      const hideDelay = 6000 + Math.random() * 2000;
      setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Show first notification after 3-6 seconds
    const initialDelay = 3000 + Math.random() * 3000;
    const initialTimer = setTimeout(showNextNotification, initialDelay);

    // Setup rotation (every 45-90 seconds for LP urgency)
    const rotationInterval = setInterval(() => {
      if (!isDismissed) {
        showNextNotification();
      }
    }, 45000 + Math.random() * 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(rotationInterval);
    };
  }, [isDismissed, lastShownName]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("lp-sales-popup-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && currentNotif && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-24 md:bottom-4 left-4 z-[100] max-w-[calc(100vw-2rem)] sm:max-w-sm w-full sm:w-auto"
        >
          <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 relative overflow-hidden">
            {/* Accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                currentNotif.type === "premium"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : currentNotif.type === "upgrade"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : "bg-gradient-to-r from-emerald-400 to-green-500"
              }`}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors group"
            >
              <X className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
            </button>

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${
                  currentNotif.type === "premium"
                  ? "bg-gradient-to-br from-amber-500 to-orange-600"
                  : currentNotif.type === "upgrade"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-emerald-500 to-green-600"
              }`}>
                {currentNotif.name[0]}
              </div>

              <div className="flex-1 pr-4">
                <p className="text-sm text-neutral-300 leading-snug mb-1.5">
                  {parseMarkdown(message)}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium mb-2">
                  {currentNotif.timeAgo} • {currentNotif.location}
                </p>

                {/* CTA */}
                {getCTA(currentNotif.type) && (
                  <Link
                    href={getCTA(currentNotif.type)!.link}
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 ${
                      currentNotif.type === "premium"
                        ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {getCTA(currentNotif.type)!.text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
