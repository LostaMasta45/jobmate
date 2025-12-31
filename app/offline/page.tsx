"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30"
                >
                    <WifiOff className="w-12 h-12 text-indigo-400" />
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Anda Sedang Offline
                </h1>

                {/* Description */}
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Sepertinya koneksi internet Anda terputus. Silakan periksa koneksi
                    internet Anda dan coba lagi.
                </p>

                {/* Retry Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25"
                >
                    <RefreshCw className="w-5 h-5" />
                    Coba Lagi
                </motion.button>

                {/* Tips */}
                <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-500">
                        💡 <span className="text-gray-400">Tips:</span> Beberapa halaman
                        yang sudah Anda kunjungi mungkin masih tersedia dalam mode offline.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
