"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, AlertTriangle, Search, Frown } from "lucide-react";

export const PainPointsV2Simple = () => {
  return (
    <section className="py-20 bg-neutral-950 text-white relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                  Masih Berjuang Sendirian? <br />
                  <span className="text-neutral-500">Kami Paham Rasanya.</span>
              </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                  <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-200">Capek Scroll Loker</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                      Tiap malam scroll grup WhatsApp/Telegram tapi isinya loker hoax atau expired.
                  </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                  <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <XCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-200">Gak Pernah Dipanggil</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                      Kirim lamaran puluhan kali tapi gak ada balasan. CV mungkin gak lolos ATS.
                  </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                  <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-200">Bingung Mulai Darimana</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                      Fresh graduate, gak punya pengalaman, dan bingung bikin CV yang menarik.
                  </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                  <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Frown className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-200">Stress & Insecure</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                      Lihat teman udah pada kerja, sedangkan kamu masih nganggur. Mental breakdown.
                  </p>
              </motion.div>
          </div>
       </div>
    </section>
  );
};
