"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah bayarnya cuma sekali?",
    answer: "Ya, untuk paket VIP Premium kamu cukup bayar sekali (Rp 39.000) dan dapat akses selamanya (Lifetime). Tidak ada biaya bulanan tersembunyi.",
  },
  {
    question: "Apakah cocok untuk Fresh Graduate?",
    answer: "Sangat cocok! Tools kami dirancang untuk membantu pemula, mulai dari CV Generator yang otomatis rapi, sampai panduan interview dasar.",
  },
  {
    question: "Loker-nya dari daerah mana aja?",
    answer: "Saat ini kami fokus memvalidasi loker untuk area Jombang, Mojokerto, Kediri, dan sekitarnya. Namun tools (CV, Email) bisa dipakai untuk melamar kemana saja.",
  },
  {
    question: "Gimana cara akses tools-nya?",
    answer: "Setelah pembayaran dikonfirmasi, akun kamu otomatis aktif. Kamu bisa login di website ini dan langsung pakai semua fitur di dashboard.",
  },
];

export const FAQModern = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sering Ditanyakan</h2>
            <p className="text-neutral-400">Masih bingung? Cek jawaban di bawah ini.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 font-medium text-lg hover:text-brand transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
