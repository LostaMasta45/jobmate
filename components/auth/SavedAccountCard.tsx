"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, User } from "lucide-react";
import { SavedAccount } from "@/types/saved-account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SavedAccountCardProps {
    account: SavedAccount;
    onSelect: (account: SavedAccount) => void;
    onRemove: (id: string) => void;
    variant?: "default" | "mobile";
}

export function SavedAccountCard({
    account,
    onSelect,
    onRemove,
    variant = "default",
}: SavedAccountCardProps) {
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(account.id);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (variant === "mobile") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(account)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-white/15 transition-all active:scale-[0.98] shadow-lg"
            >
                <Avatar className="h-14 w-14 ring-2 ring-white/20">
                    <AvatarImage src={account.avatar_url} alt={account.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#6e52e0] to-[#00acc7] text-white font-bold text-lg">
                        {getInitials(account.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{account.name}</p>
                    <p className="text-sm text-white/70 truncate">{account.email}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="shrink-0 h-8 w-8 rounded-full bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                >
                    <X className="h-4 w-4" />
                </Button>
            </motion.div>
        );
    }

    // Default (desktop) variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(account)}
            className="group flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-all border border-transparent hover:border-brand/20 hover:shadow-md"
        >
            <Avatar className="h-12 w-12 ring-2 ring-brand/10 group-hover:ring-brand/30 transition-all">
                <AvatarImage src={account.avatar_url} alt={account.name} />
                <AvatarFallback className="bg-gradient-to-br from-brand to-brand/70 text-white font-semibold">
                    {getInitials(account.name)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{account.name}</p>
                <p className="text-sm text-muted-foreground truncate">{account.email}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="shrink-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
                <X className="h-4 w-4" />
            </Button>
        </motion.div>
    );
}

// Add new account card (for switching to standard login)
interface AddAccountCardProps {
    onClick: () => void;
    variant?: "default" | "mobile";
}

export function AddAccountCard({ onClick, variant = "default" }: AddAccountCardProps) {
    if (variant === "mobile") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-dashed border-white/30 cursor-pointer hover:bg-white/10 transition-all"
            >
                <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-white/70" />
                </div>
                <div className="flex-1">
                    <p className="font-medium text-white/90">Gunakan akun lain</p>
                    <p className="text-sm text-white/60">Login dengan email berbeda</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-xl bg-background border border-dashed border-border hover:border-brand/50 cursor-pointer transition-all hover:shadow-sm"
        >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="font-medium text-foreground">Gunakan akun lain</p>
                <p className="text-sm text-muted-foreground">Login dengan email berbeda</p>
            </div>
        </motion.div>
    );
}
