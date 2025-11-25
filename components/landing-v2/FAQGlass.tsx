"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Apa bedanya VIP Basic dan VIP Premium?",
    answer: "VIP Basic (Rp 10k/bulan) dapat akses grup WhatsApp Career VIP dan web job portal. VIP Premium (Rp 39k lifetime) dapat semua fitur Basic PLUS akses ke semua tools JobMate (CV generator, tracker, email templates, dll) selamanya.",
  },
  {
    question: "Apakah benar Rp 39.000 untuk selamanya?",
    answer: "Ya, benar! VIP Premium adalah one-time payment (sekali bayar) dan kamu dapat akses seumur hidup. Tidak ada biaya bulanan atau perpanjangan. Bayar sekali, pakai selamanya!",
  },
  {
    question: "Bagaimana cara pembayarannya?",
    answer: "Pembayaran bisa via transfer bank, e-wallet (OVO, GoPay, DANA), atau QRIS. Setelah pembayaran dikonfirmasi, akun kamu langsung aktif dalam 5-10 menit.",
  },
  {
    question: "Loker yang dibagikan dari mana saja?",
    answer: "Loker berasal dari berbagai sumber terpercaya: perusahaan langsung, job portal resmi, dan verifikasi tim kami. Fokus untuk wilayah Jombang dan sekitarnya (Mojokerto, Kediri, Surabaya).",
  },
  {
    question: "Apakah cocok untuk freshgraduate?",
    answer: "Sangat cocok! Justru banyak member kami adalah freshgraduate. Tools JobMate punya fitur khusus 'Skill-Based Resume' yang cocok untuk yang belum punya pengalaman kerja.",
  },
  {
    question: "Kalau sudah dapat kerja, apakah bisa tetap di grup?",
    answer: "Tentu! Akses kamu tetap aktif. Siapa tahu di masa depan butuh info loker lagi, atau bisa bantu teman/keluarga yang lagi cari kerja.",
  },
  {
    question: "Apakah ada garansi uang kembali?",
    answer: "Ya, kami berikan garansi 7 hari. Kalau dalam 7 hari pertama kamu merasa tidak cocok, hubungi admin dan uang akan dikembalikan 100%.",
  },
  {
    question: "Tools JobMate bisa diakses di HP?",
    answer: "Ya, 100% mobile-friendly! Semua tools bisa diakses lewat browser HP. Jadi kamu bisa bikin CV atau kirim lamaran kapan saja, di mana saja.",
  },
];

export const FAQGlass = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
       <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sering Ditanyakan</h2>
            <p className="text-neutral-400">Jawaban untuk keraguanmu.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/10 last:border-none"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-brand transition-colors group"
              >
                <span className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">
                    {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0 p-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-all">
                    {activeIndex === index ? (
                        <Minus className="w-4 h-4 text-brand" />
                    ) : (
                        <Plus className="w-4 h-4 text-neutral-400" />
                    )}
                </span>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-neutral-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
