"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rani",
    location: "Mojowarno",
    role: "Staff Admin",
    quote: "Dulu susah cari kerja, sekarang tiap hari dapat info valid. Cuma seminggu gabung, langsung dapet panggilan interview!",
    rating: 5,
    avatar: "👩",
  },
  {
    name: "Bima",
    location: "Sumobito",
    role: "Marketing",
    quote: "Cuma 39 ribu dapet tools lengkap buat CV & interview! Ini investasi terbaik buat cari kerja. Worth it banget!",
    rating: 5,
    avatar: "👨",
  },
  {
    name: "Dina",
    location: "Peterongan",
    role: "Customer Service",
    quote: "Keterima kerja karena grup ini. Makasih InfoLokerJombang! Sekarang gaji naik 2x lipat dari sebelumnya.",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    name: "Aldi",
    location: "Jombang Kota",
    role: "IT Support",
    quote: "Tools JobMate-nya keren! CV generator bikin CV jadi profesional. HRD sampai bilang 'CV kamu bagus banget!'",
    rating: 5,
    avatar: "👨‍💻",
  },
  {
    name: "Siti",
    location: "Ploso",
    role: "Cashier",
    quote: "Sebagai ibu rumah tangga yang mau kerja lagi, grup ini bantu banget. Info loker part-time juga banyak!",
    rating: 5,
    avatar: "👩‍🦰",
  },
  {
    name: "Rendi",
    location: "Mojoagung",
    role: "Driver",
    quote: "Fresh graduate gak punya pengalaman? Tenang! Tools-nya ada yang khusus buat kita. Sekarang udah kerja di perusahaan bagus.",
    rating: 5,
    avatar: "🧑",
  },
];

export function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            💚 Kata Mereka
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ribuan Orang Sudah Dapat Kerja
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Baca cerita sukses dari member yang sudah bergabung dengan Career VIP
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-emerald-600/20 mb-3" />

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-600">203K+</div>
            <p className="text-sm text-muted-foreground">Follower Aktif</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">500+</div>
            <p className="text-sm text-muted-foreground">Loker Per Bulan</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">95%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-amber-600">4.9/5</div>
            <p className="text-sm text-muted-foreground">Rating Member</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
