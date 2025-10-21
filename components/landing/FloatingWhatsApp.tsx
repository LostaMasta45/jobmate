"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip for 3 seconds
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp admin
  const message = "Halo Admin, saya mau tanya tentang Career VIP dan JobMate!";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-full right-0 mb-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 max-w-xs border"
              >
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close tooltip"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-sm font-semibold mb-1">
                  💬 Butuh bantuan?
                </p>
                <p className="text-xs text-muted-foreground">
                  Chat admin kami untuk info lebih lanjut tentang paket Career VIP!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl transition-colors group"
            aria-label="Chat Admin via WhatsApp"
          >
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            
            {/* Ping Animation */}
            <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-20" />
          </motion.a>

          {/* Badge Notification */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg"
          >
            1
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
