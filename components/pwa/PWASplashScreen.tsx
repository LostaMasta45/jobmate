"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PWASplashScreenProps {
    /**
     * Whether the splash screen is visible
     */
    isVisible: boolean;
    /**
     * Optional message to display
     */
    message?: string;
}

export function PWASplashScreen({ isVisible, message = "Loading..." }: PWASplashScreenProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#3c3c3c]"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Cyan glow top-right */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#00d1dc] blur-[100px]"
                />
                {/* Purple glow bottom-left */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#8e68fd] blur-[100px]"
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo with pulse animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative"
                >
                    {/* Outer ring pulse */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-4 border-[#00d1dc]"
                        style={{ margin: "-12px" }}
                    />

                    {/* Second ring pulse with delay */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 rounded-full border-2 border-[#8e68fd]"
                        style={{ margin: "-20px" }}
                    />

                    {/* Logo */}
                    <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                        <Image
                            src="/icons/splash-logo.png"
                            alt="JobMate"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </motion.div>

                {/* App name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-2xl font-bold text-white sm:text-3xl"
                >
                    JobMate
                </motion.h1>

                {/* Loading indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col items-center gap-3"
                >
                    {/* Animated dots loader */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -8, 0],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                }}
                                className="h-2.5 w-2.5 rounded-full bg-[#00d1dc]"
                            />
                        ))}
                    </div>

                    {/* Message */}
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm text-white/60"
                    >
                        {message}
                    </motion.p>
                </motion.div>
            </div>

            {/* Bottom branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 text-center"
            >
                <p className="text-xs text-white/40">AI-Powered Career Assistant</p>
            </motion.div>
        </motion.div>
    );
}
