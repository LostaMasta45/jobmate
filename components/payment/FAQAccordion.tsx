"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQAccordion({ gatewayName = "Xendit" }: { gatewayName?: string }) {
  const faqs = [
    {
      question: "Apakah pembayaran aman?",
      answer: `Ya, sangat aman! Kami menggunakan ${gatewayName} sebagai payment gateway yang sudah terdaftar dan diawasi oleh Bank Indonesia. Semua transaksi dienkripsi dengan SSL 256-bit. Data kartu kredit Anda tidak pernah tersimpan di server kami.`
    },
    {
      question: "Kapan akses VIP aktif setelah pembayaran?",
      answer: "Akses VIP Anda akan aktif otomatis dalam 1-5 menit setelah pembayaran berhasil dikonfirmasi. Anda akan menerima email konfirmasi berisi link akses dan panduan lengkap. Jika lebih dari 10 menit belum aktif, hubungi support kami."
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima berbagai metode pembayaran: QRIS (semua e-wallet), Virtual Account (BCA, Mandiri, BNI, BRI, Permata), E-Wallet (GoPay, OVO, Dana, ShopeePay, LinkAja), Credit/Debit Card (Visa, Mastercard, JCB), dan Retail (Alfamart, Indomaret)."
    },
    {
      question: "Apakah ada biaya tersembunyi?",
      answer: "Tidak ada! Harga yang tertera adalah harga final. Tidak ada biaya admin, biaya tambahan, atau biaya tersembunyi lainnya. What you see is what you pay."
    },
    {
      question: "Bagaimana cara join grup WhatsApp VIP?",
      answer: "Setelah pembayaran berhasil, Anda akan menerima email yang berisi link invite ke grup WhatsApp VIP. Anda juga bisa klik tombol 'Join WhatsApp Group' di halaman konfirmasi pembayaran. Link invite berlaku 24 jam."
    },
    {
      question: "Apakah bisa refund jika tidak puas?",
      answer: "Kami memberikan garansi 7 hari uang kembali. Jika dalam 7 hari pertama Anda tidak puas dengan layanan kami, hubungi support dan kami akan proses refund 100% tanpa pertanyaan."
    },
    {
      question: "Berapa lama akses VIP Basic berlaku?",
      answer: "VIP Basic berlaku selama 1 bulan sejak tanggal pembayaran. Anda akan menerima reminder 3 hari sebelum expired dan bisa perpanjang dengan mudah melalui dashboard."
    },
    {
      question: "Apakah VIP Premium benar-benar lifetime?",
      answer: "Ya, benar! VIP Premium adalah pembayaran 1 kali untuk akses selamanya. Termasuk semua update fitur baru di masa depan tanpa biaya tambahan. Investasi terbaik untuk karir Anda."
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Pertanyaan yang Sering Ditanyakan (FAQ)</h3>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline py-4 text-left">
              <span className="font-semibold text-sm sm:text-base">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-center">
          <span className="font-semibold">Masih ada pertanyaan?</span>{" "}
          <a
            href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ada%20pertanyaan%20tentang%20VIP%20membership"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            Chat WhatsApp Support
          </a>
          {" "}kami (response dalam 5 menit)
        </p>
      </div>
    </motion.div>
  );
}
