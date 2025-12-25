"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    gradientFrom?: string;
    gradientTo?: string;
}

export function MagicCard({
    children,
    className,
    onClick,
    gradientFrom = "green-50/50",
    gradientTo = "transparent"
}: MagicCardProps) {
    return (
        <motion.div
            className={cn(
                "cursor-pointer relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-300 ease-out group",
                "hover:-translate-y-1",
                className
            )}
            onClick={onClick}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out",
                `from-${gradientFrom} to-${gradientTo}`
            )} />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
