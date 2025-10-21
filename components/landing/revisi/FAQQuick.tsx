"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FAQQuick() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apa bedanya VIP Basic dan VIP Premium?",
      answer:
        "VIP Basic (15K/bulan) dapat grup WA + portal loker + 1 template CV. VIP Premium (50K lifetime) dapat SEMUA itu + 10+ tools JobMate (CV Generator, Email Lamaran, Tracker, dll) selamanya!",
    },
    {
      question: "Lokernya khusus Jombang aja atau seluruh Indonesia?",
      answer:
        "Mayoritas loker area Jombang dan sekitarnya (Mojokerto, Kediri, Surabaya). Tapi ada juga loker remote dan dari kota lain yang cocok buat fresh graduate.",
    },
    {
      question: "Kalau saya ambil Premium, langsung bisa pakai semua tools?",
      answer:
        "Ya! Begitu payment dikonfirmasi, kamu langsung dapat akses ke dashboard JobMate dengan semua tools. Gak ada setup ribet, tinggal login dan pakai.",
    },
    {
      question: "Apakah ada garansi uang kembali?",
      answer:
        "Untuk Basic (bulanan), bisa refund dalam 3 hari pertama jika tidak puas. Premium (lifetime) refund 7 hari pertama. Kami yakin kamu akan puas!",
    },
    {
      question: "Gimana cara bayarnya?",
      answer:
        "Transfer bank (BCA, Mandiri, BRI), QRIS, atau e-wallet (GoPay, OVO, Dana). Otomatis dikirim link grup setelah payment dikonfirmasi (maks 30 menit).",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Masih Ada</span>{" "}
            <span className="text-emerald-600">Pertanyaan?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ini 5 pertanyaan paling sering ditanyakan. Kalau masih bingung, chat admin aja!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 sm:px-6 pb-4 sm:pb-6"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Masih ada pertanyaan lain? Atau mau konsultasi paket mana yang cocok?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <a href="#pricing">Pilih Paket Sekarang →</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 font-semibold"
            >
              <a
                href="https://wa.me/6285155559945?text=Halo%20Admin%2C%20saya%20mau%20tanya%20tentang%20VIP%20Career"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Chat Admin
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
