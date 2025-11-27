"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const companyLogos = [
    '3SECOND JOMBANG_20251126_163410.png',
    'ABATA HOMESCHOOLING_20251126_163428.png',
    'AKBAR JAYA GROUP_20251126_163448.png',
    'AMAZON LAPTOP_20251126_163507.png',
    'ANEKA MEDIA ID_20251126_163541.png',
    'ARIES PUTRA_20251126_163608.png',
    'AURA BEAUTY CARE_20251126_163624.png',
    'AYUCITRA HIJAB_20251126_163646.png',
    'BABA GYOZA_20251126_163707.png',
    'BEAUTY STORE_20251126_163727.png',
    'BIMBEL GENIUS_20251126_163741.png',
    'CHURROCU JOMBANG_20251126_163803.png',
    'CLARICE BEAUTY CLINIC_20251126_163833.png',
    'COMU CAFFE_20251126_163850.png',
    'CV ALIANSYAH_20251126_163908.png',
    'CV HANEY ALAM SEJAHTERAH_20251126_163923.png',
    'CWIMEI SROJA_20251126_164004.png',
    'DELI GROUP_20251126_164027.png',
    'DHUHA SERVICE_20251126_164050.png',
    'DR ANANG WIB JOMBANG_20251126_164104.png',
    'EIGERINDO_20251126_164117.png',
    'ESTEH PRESIDEN_20251126_164130.png',
    'ESTEH SOLO INDONESIA_20251126_164144.png',
    'HAYDAN HEALTHY_20251126_164159.png',
    'ITS MONROE_20251126_164214.png',
    'KAUKABA STORE_20251126_164231.png',
    'KLINIK SAKINAH 74_20251126_164250.png',
    'LANTIKYA STORE_20251126_164306.png',
    'LOGO ABSHFRAGRANCE_20251126_165646.png',
    'LOGO AFINDO INFORMATIKA JOMBANG_20251126_165658.png',
    'LOGO ANEKA DROPSHIP_20251126_164331.png',
    'LOGO AP STORE JOMBANG_20251126_165711.png',
    'LOGO APOTEK SAMBONG DUKUH_20251126_165724.png',
    'LOGO ARTABOGA OFFICIAL_20251126_165736.png',
    'LOGO BBJ JOMBANG_20251126_165748.png',
    'LOGO CHICKROLL JOMBANG_20251126_165802.png',
    'LOGO CV. NR HERBAL CARE_20251126_165839.png',
    'LOGO CV. WAHANA SEJAHTERA FOODS_20251126_163052.png',
    'LOGO DJITOE COFFE_20251126_165910.png',
    'LOGO EAZYCOFFEE_20251126_165925.png',
    'LOGO GURU  IMBEL AHE ( KEDUNGPAPAR SUMOBITO )_20251126_170031.png',
    'LOGO HAKUI KOPI_20251126_170112.png',
    'LOGO INDOMARCO PRISMATAMA JOMBANG_20251126_163108.png',
    'LOGO J&T JOMBANG_20251126_170124.png',
    'LOGO JOMBANG POLOSAN_20251126_170137.png',
    'LOGO KEZIASPOT_20251126_163123.png',
    'LOGO LIBMIEDU_20251126_170203.png',
    'LOGO MAMA MEA JOMBANG_20251126_170223.png',
    'LOGO MITRA INDOTANI ABADI_20251126_163140.png',
    'LOGO MJM BATTERY_20251126_170235.png',
    'LOGO MRAYA OPTIK_20251126_170249.png',
    'LOGO MS GLOW BEAUTY JOMBANG_20251126_164346.png',
    'LOGO NARA GLAM_20251126_170329.png',
    'LOGO OIA STEAK_20251126_170356.png',
    'LOGO PAPAK AUTOCARE_20251126_170409.png',
    'LOGO PRIMA ACCOUNTING_20251126_170424.png',
    'LOGO PT PEIHAI_20251126_164403.png',
    'LOGO PT PESTAPORA ABADI_20251126_164421.png',
    'LOGO PT PHALOSARI UNGGUL JAYA_20251126_164436.png',
    'LOGO PT SALIM BROTHERS_20251126_164452.png',
    'LOGO PT SHOEI INDONESIA_20251126_164506.png',
    'LOGO PT. ALAM BAGA SHAKTI_20251126_163158.png',
    'LOGO PT. ANUGERAH MANDIRI SUKSESINDO_20251126_163219.png',
    'LOGO PT. FIRNANDO TEAM INDONESIA_20251126_163239.png',
    'LOGO PT. INDONESIA PRIORITAS SERVIS_20251126_170442.png',
    'LOGO PT. MATA ELANG PRIMA_20251126_163256.png',
    'LOGO PT. YAFIRA DIGITAL TECHNOLOGY_20251126_163311.png',
    'LOGO RASALOKA_20251126_170455.png',
    'LOGO RENA FACTORY_20251126_170508.png',
    'LOGO RUNCELL PATTIMURA_20251126_170522.png',
    'LOGO SBC GROUP_20251126_170534.png',
    'LOGO SCIENCE SOCIATY_20251126_170612.png',
    'LOGO SELLY SALON_20251126_164524.png',
    'LOGO SHICHI JAPANESE EATERY_20251126_170634.png',
    'LOGO SOMETHINC_20251126_164541.png',
    'LOGO SOSO GROUP_20251126_164556.png',
    'LOGO SPPG JOMBANG_20251126_163336.png',
    'LOGO SUMBERWANGI GRUP_20251126_170648.png',
    'LOGO SUZUKI AMM JOMBANG_20251126_170700.png',
    'LOGO TOPSELL_20251126_170732.png',
    'LOGO YAMAHA SEMPURNA MOTOR ( PETERONGAN)_20251126_163354.png',
    'MAJESTIC POOL N CAFE_20251126_164612.png',
    'MARINA COSMETIC_20251126_164627.png',
    'MASTER CHICKEN_20251126_164650.png',
    'MELLEBE BEAUTY STORE_20251126_164715.png',
    'MILENIAL MANDIRI CAREER_20251126_164730.png',
    'MISS CIMORY_20251126_164744.png',
    'MK SKIN_20251126_164758.png',
    'MODERN FASHION STORE_20251126_164813.png',
    'MOMOYO_20251126_164831.png',
    'MOOI DONAT_20251126_164847.png',
    'MULIA TRAVEL_20251126_164900.png',
    'NARA GLAM_20251126_164912.png',
    'NASI KEBULI ARAFH_20251126_164927.png',
    'NIBRAS HOUSE_20251126_164945.png',
    'NINETY HERO_20251126_165009.png',
    'OFERO INDONESIA_20251126_165029.png',
    'ORKA SHOES CARE_20251126_165041.png',
    'OT GROUP_20251126_165059.png',
    'OXY PARFUME_20251126_165113.png',
    'PANDALOVELY_20251126_165127.png',
    'PAUD AISYIYAH_20251126_165146.png',
    'PIZZA TARIK_20251126_165207.png',
    'POSKOPI ZIO_20251126_165227.png',
    'PT AIDAI INDONESIA_20251126_165239.png',
    'PT CHEIL JEDANG INDONESIA_20251126_165252.png',
    'PT KALLAZ INDONESIA_20251126_165306.png',
    'PT SAPTA KARYA MEGAH_20251126_165318.png',
    'PT SOLID ALODIA WIYJAYA_20251126_165332.png',
    'PT VENEZIA FOOT WEAR_20251126_165352.png',
    'PT XUILONG OUTDOOR_20251126_165412.png',
    'RESIK REK LAUNDRY_20251126_165428.png',
    'RGS APPAREL_20251126_165442.png',
    'ROCKET CHIKEN_20251126_165456.png',
    'SMAGROW_20251126_165514.png',
    'TARUNA CENDEKIA_20251126_165531.png',
    'TOKO EMAS GADJAH_20251126_165550.png',
    'TUNAS HONDA JOMBANG_20251126_165603.png',
    'VINASTKEI BEAUTY_20251126_165618.png',
    'WULING INDONESIA_20251126_165633.png'
];

const LogoItem = ({ logo, className }: { logo: string, className?: string }) => {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={`/Logo/LogoPerusahaan/${logo}`}
        alt={logo.replace(/_\d+\.png$/, "").replace(/_/g, " ")}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 120px, 160px"
        quality={40}
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const CompanyLogoMarquee = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Split logos into 3 rows
  const chunkSize = Math.ceil(companyLogos.length / 3);
  const row1 = companyLogos.slice(0, chunkSize);
  const row2 = companyLogos.slice(chunkSize, chunkSize * 2);
  const row3 = companyLogos.slice(chunkSize * 2);

  return (
    <section className="py-24 bg-neutral-900 overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.2),rgba(0,0,0,0))]" />
      
      <div className="container mx-auto px-4 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Dipercaya oleh <span className="text-brand text-yellow-500">100+ Perusahaan</span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-6">
          Kami telah bekerjasama dan menayangkan lowongan dari berbagai instansi ternama, PT, dan UMKM di Jombang.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Conversion Element: CTA for Employers */}
          <a 
            href="/pasang-loker" 
            className="inline-flex items-center gap-2 text-brand hover:text-brand-light transition-colors text-sm font-medium bg-brand/10 px-4 py-2 rounded-full hover:bg-brand/20"
          >
            <span>Apakah Anda pemilik bisnis? Pasang Loker Sekarang</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>

          {/* Show All Button (Verification) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-full border border-neutral-800 hover:border-neutral-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            <span>Lihat Semua Partner</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:gap-8 relative z-10">
        {/* Row 1: Left to Right (Visible on all) */}
        <LogoRow logos={row1} direction="left" speed={50} />
        
        {/* Row 2: Right to Left (Visible on all) */}
        <LogoRow logos={row2} direction="right" speed={45} />
        
        {/* Row 3: Left to Right (Hidden on Mobile for Performance) */}
        <LogoRow logos={row3} direction="left" speed={55} className="hidden md:flex" />
      </div>
      
      {/* Side Fades */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-neutral-900 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-neutral-900 to-transparent z-20 pointer-events-none" />

      {/* Full Grid Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-neutral-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-white">Partner Kami</h3>
                <p className="text-neutral-400 text-sm">Menampilkan {companyLogos.length} perusahaan yang telah bekerjasama</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {companyLogos.map((logo, idx) => (
                <div
                  key={`grid-${logo}-${idx}`}
                  className="aspect-[3/2] bg-white rounded-xl p-4 flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-sm"
                >
                   <LogoItem logo={logo} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

const LogoRow = ({ logos, direction, speed, className = "" }: { logos: string[], direction: "left" | "right", speed: number, className?: string }) => {
  return (
    <div className={`flex overflow-hidden group ${className}`}>
      <div 
        className={`flex gap-6 py-2 min-w-full ${direction === "left" ? "animate-marquee" : "animate-marquee-reverse"} hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {[...logos, ...logos].map((logo, idx) => (
          <div
            key={`${logo}-${idx}`}
            className="flex-shrink-0 w-40 h-24 bg-white rounded-xl p-4 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <LogoItem logo={logo} />
          </div>
        ))}
      </div>
    </div>
  );
};
