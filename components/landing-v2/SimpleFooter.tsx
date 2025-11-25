import React from "react";
import Link from "next/link";

export const SimpleFooter = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-black text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-white font-bold text-xs">J</div>
             <span className="font-medium text-white">JobMate</span>
             <span>&copy; 2024</span>
        </div>
        
        <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
        </div>
      </div>
    </footer>
  );
};
