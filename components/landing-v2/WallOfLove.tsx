"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  { text: "Min makasih, akhirnya dapet kerja di pabrik sepatu. Info lokernya valid banget!", time: "10.42", type: "receive" },
  { text: "Sama-sama kak, sukses ya kerjanya! Semangat!", time: "10.45", type: "sent" },
  { text: "Tools CV nya ngebantu banget min, dulu pake word berantakan sekarang rapi.", time: "Kemarin", type: "receive" },
  { text: "Alhamdulillah interview lancar pake panduan dari mimin.", time: "Hari ini", type: "receive" },
  { text: "Worth it banget 39rb seumur hidup. Gak nyesel gabung.", time: "09.15", type: "receive" },
  { text: "Min, temenku mau gabung juga caranya gimana?", time: "09.20", type: "receive" },
];

export const WallOfLove = () => {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Bukti Nyata, <span className="text-green-500">Bukan Janji</span></h2>
          <p className="text-neutral-400">Ribuan member sudah merasakan manfaatnya. Sekarang giliran kamu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mockup Chat Column 1 */}
            <div className="space-y-4">
                <ChatBubble {...testimonials[0]} />
                <ChatBubble {...testimonials[1]} />
            </div>
             {/* Mockup Chat Column 2 */}
            <div className="space-y-4 hidden md:block">
                <ChatBubble {...testimonials[2]} />
                <ChatBubble {...testimonials[3]} />
            </div>
             {/* Mockup Chat Column 3 */}
            <div className="space-y-4 hidden lg:block">
                <ChatBubble {...testimonials[4]} />
                <ChatBubble {...testimonials[5]} />
            </div>
        </div>

        {/* Live Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-white/10 pt-12">
            <StatItem label="CV Digenerate" value="1,240+" color="text-brand" />
            <StatItem label="Loker Dishare" value="45+" color="text-purple-500" />
            <StatItem label="Member Baru" value="15" color="text-green-500" />
            <StatItem label="Rating" value="4.9/5" color="text-yellow-500" />
        </div>
      </div>
    </section>
  );
};

const ChatBubble = ({ text, time, type }: { text: string, time: string, type: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex flex-col ${type === 'sent' ? 'items-end' : 'items-start'}`}
    >
        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed relative ${
            type === 'sent' 
            ? 'bg-green-600 text-white rounded-tr-none' 
            : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-white/5'
        }`}>
            {text}
            <span className={`block text-[10px] mt-1 opacity-70 text-right`}>{time}</span>
        </div>
    </motion.div>
);

const StatItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="p-4">
        <div className={`text-3xl md:text-4xl font-bold mb-1 ${color}`}>{value}</div>
        <div className="text-sm text-neutral-500">{label}</div>
    </div>
);
