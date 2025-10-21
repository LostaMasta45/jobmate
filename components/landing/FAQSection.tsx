"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="faq" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            ❓ Ada Pertanyaan?
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Pertanyaan yang Sering Ditanya
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan lain? Chat admin kami lewat WhatsApp
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-muted/30 rounded-2xl px-6 border"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 text-base sm:text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 sm:p-8 border border-green-200 dark:border-green-900">
            <p className="text-lg mb-4">
              <strong>Masih ada pertanyaan?</strong> Tim support kami siap membantu!
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20tanya%20tentang%20Career%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
            >
              <span className="text-xl">💬</span>
              Chat Admin via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
