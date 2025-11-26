"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadPreview } from "@/components/ui/file-upload-preview";
import { 
  ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, 
  CheckCircle2, AlertCircle, UploadCloud, Shield
} from "lucide-react";

export default function MobileAjukanAkunView() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false);
  
  // Form State
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [proofFile, setProofFile] = React.useState<File | null>(null);

  // Validation Logic
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUsername = (username: string) => /^[a-z0-9_]{3,20}$/.test(username);
  const isValidWhatsApp = (phone: string) => /^8[0-9]{8,11}$/.test(phone);
  
  const isFormValid = 
    formData.fullName.length > 0 &&
    isValidUsername(formData.username) &&
    isValidEmail(formData.email) &&
    isValidWhatsApp(formData.whatsapp) &&
    formData.password.length >= 6 &&
    proofFile !== null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Mohon lengkapi semua data dengan benar.");
      return;
    }

    setLoading(true);
    
    try {
      const apiFormData = new FormData();
      apiFormData.append("fullName", formData.fullName);
      apiFormData.append("username", formData.username);
      apiFormData.append("email", formData.email);
      apiFormData.append("whatsapp", formData.whatsapp);
      apiFormData.append("password", formData.password);
      if (proofFile) apiFormData.append("proofFile", proofFile);

      const response = await fetch("/api/ajukan-akun", {
        method: "POST",
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Terjadi kesalahan.");
        setLoading(false);
        return;
      }

      setShowLoadingScreen(true);
      // Simulate loading for UX then redirect
      setTimeout(() => {
         router.push(`/ajukan-akun/terima-kasih?code=${result.telegramLinkCode}&email=${encodeURIComponent(formData.email)}`);
      }, 1500);

    } catch (err) {
      setError("Gagal menghubungi server.");
      setLoading(false);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen message="Memproses Pengajuan..." />}
      
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900 selection:bg-[#00acc7] selection:text-white">
        
        {/* === BACKGROUND (Same as Mobile Sign In) === */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#00acc7] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(142,104,253,0.5),transparent_50%)] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,209,220,0.4),transparent_50%)] mix-blend-soft-light" />
          <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#00d1dc] rounded-full blur-[100px] opacity-40 mix-blend-overlay"
          />
        </div>

        {/* === CONTENT === */}
        <div className="absolute inset-0 flex flex-col">
          
          {/* Header - Fixed at Top */}
          <div className="relative z-10 pt-6 px-6 pb-4 flex-none">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              
              {/* Centered Logo - Increased Size */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                 <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                 >
                    {/* Matched size w-64 h-64 as requested */}
                    <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain drop-shadow-2xl" />
                 </motion.div>
              </div>
              
              <div className="w-10" /> {/* Spacer for balance */}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide relative z-20">
             
             {/* Illustration Section - Now scrolls with content */}
             <div className="px-6 pt-2 pb-6 text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="relative w-[280px] h-[180px] mx-auto mb-6 flex items-center justify-center"
                >
                   {/* Background Glow */}
                   <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-[50px]" />
                   
                   {/* 3D Card Illustration - Larger & More Dynamic */}
                   <motion.div 
                     animate={{ y: [-8, 8, -8] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     className="relative z-10"
                   >
                      <div className="w-32 h-44 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-2xl flex flex-col items-center pt-6 transform -rotate-6 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                         <div className="w-16 h-16 bg-gradient-to-tr from-[#00acc7] to-[#00d1dc] rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-white/10">
                            <User className="w-8 h-8 text-white" />
                         </div>
                         <div className="w-20 h-2 bg-white/30 rounded-full mb-2" />
                         <div className="w-14 h-2 bg-white/20 rounded-full" />
                         
                         {/* Floating Badge */}
                         <motion.div 
                           animate={{ scale: [1, 1.1, 1], rotate: [12, 15, 12] }}
                           transition={{ duration: 3, repeat: Infinity }}
                           className="absolute -right-4 top-10 w-12 h-12 bg-[#8e68fd] rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                         >
                            <Shield className="w-6 h-6 text-white" />
                         </motion.div>
                      </div>
                   </motion.div>
                </motion.div>

                <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Bergabung Sekarang</h1>
                <p className="text-white/90 text-sm font-medium max-w-[260px] mx-auto leading-relaxed">
                  Dapatkan akses eksklusif ke ribuan lowongan kerja VIP & fitur premium JobMate.
                </p>
             </div>

             {/* Form Sheet - Now part of scroll flow */}
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
               className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] min-h-[60vh] pb-8"
             >
                <div className="px-8 pt-8">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 opacity-50" />
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Form fields remain the same... */}
                
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Nama Lengkap</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Nama Sesuai KTP"
                      className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Username</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                      <span className="text-lg font-bold">@</span>
                    </div>
                    <Input
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="username_unik"
                      className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium"
                    />
                    {formData.username && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isValidUsername(formData.username) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 ml-1">Huruf kecil, angka, underscore (3-20 karakter)</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Email Aktif</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="nama@email.com"
                      className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">WhatsApp</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-bold text-slate-500">+62</span>
                    </div>
                    <Input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="8123456789"
                      className="h-14 pl-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
                      className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Proof of Payment */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Bukti Transfer</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setProofFile(e.target.files[0]);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2 py-2">
                       <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                         {proofFile ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <UploadCloud className="w-6 h-6 text-[#00acc7]" />}
                       </div>
                       <div className="text-sm text-slate-600 font-medium">
                         {proofFile ? (
                           <span className="text-green-600">{proofFile.name}</span>
                         ) : (
                           <span>Tap untuk upload bukti</span>
                         )}
                       </div>
                       <div className="text-xs text-slate-400">Format: JPG, PNG, PDF (Max 2MB)</div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50/80 border border-red-100 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="pt-4 pb-8">
                  <Button 
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full h-14 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[#00acc7] to-[#009eb5] hover:from-[#00bed1] hover:to-[#00acc7] shadow-lg shadow-[#00acc7]/25 active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
                  >
                    {loading ? "Mengirim..." : "Kirim Pengajuan"}
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500">
                      Sudah punya akun?{" "}
                      <Link href="/auth/sign-in" className="text-[#00acc7] font-bold hover:text-[#8e68fd] transition-colors">
                        Masuk Disini
                      </Link>
                    </p>
                  </div>
                </div>

              </form>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
