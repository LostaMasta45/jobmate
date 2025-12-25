"use client";

import { motion } from "framer-motion";

interface BackgroundPatternProps {
    theme?: 'green' | 'blue' | 'red' | 'purple';
}

export function BackgroundPattern({ theme = 'green' }: BackgroundPatternProps) {
    const colors = {
        green: {
            gradient: "from-green-100/40",
            darkGradient: "dark:from-green-900/20",
            blob1: "bg-emerald-400/10",
            blob2: "bg-blue-400/10",
            bubble1: "bg-green-500/10 border-green-500/20",
            bubble2: "bg-blue-500/10 border-blue-500/20"
        },
        blue: {
            gradient: "from-blue-100/40",
            darkGradient: "dark:from-blue-900/20",
            blob1: "bg-blue-400/10",
            blob2: "bg-cyan-400/10",
            bubble1: "bg-blue-500/10 border-blue-500/20",
            bubble2: "bg-cyan-500/10 border-cyan-500/20"
        },
        red: {
            gradient: "from-red-100/40",
            darkGradient: "dark:from-red-900/20",
            blob1: "bg-red-400/10",
            blob2: "bg-orange-400/10",
            bubble1: "bg-red-500/10 border-red-500/20",
            bubble2: "bg-orange-500/10 border-orange-500/20"
        },
        purple: {
            gradient: "from-purple-100/40",
            darkGradient: "dark:from-purple-900/20",
            blob1: "bg-purple-400/10",
            blob2: "bg-fuchsia-400/10",
            bubble1: "bg-purple-500/10 border-purple-500/20",
            bubble2: "bg-fuchsia-500/10 border-fuchsia-500/20"
        }
    };

    const currentTheme = colors[theme];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${currentTheme.gradient} via-transparent to-transparent ${currentTheme.darkGradient}`} />
            <div className={`absolute right-0 top-1/4 w-96 h-96 ${currentTheme.blob1} rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal`} />
            <div className={`absolute left-0 bottom-1/4 w-96 h-96 ${currentTheme.blob2} rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal`} />

            {/* Floating Shapes/Bubbles */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-20 right-[10%] w-16 h-16 rounded-2xl rounded-tr-none ${currentTheme.bubble1} backdrop-blur-sm rotate-12`}
            />
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className={`absolute bottom-40 left-[10%] w-12 h-12 rounded-2xl rounded-tl-none ${currentTheme.bubble2} backdrop-blur-sm -rotate-12`}
            />
        </div>
    );
}
