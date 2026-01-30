"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FileText,
    History as HistoryIcon,
    Search,
    Eye,
    Trash2,
    Calendar,
    ArrowLeft
} from "lucide-react";
import { getSuratLamaranList } from "@/actions/surat-lamaran-sederhana/list";
import { deleteSuratLamaran } from "@/actions/surat-lamaran-sederhana/delete";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HistoryCard } from "@/components/tools/HistoryCard";

interface SuratLamaranHistoryListProps {
    onBack?: () => void;
}

export function SuratLamaranHistoryList({ onBack }: SuratLamaranHistoryListProps) {
    const [suratList, setSuratList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadSuratList();
    }, [filter]);

    const loadSuratList = async () => {
        setLoading(true);
        try {
            const result = await getSuratLamaranList({
                status: filter === "all" ? undefined : filter,
                limit: 50
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            setSuratList(result.data || []);
        } catch (error: any) {
            console.error('Error loading surat lamaran:', error);
            toast.error('Gagal memuat history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Yakin ingin menghapus surat lamaran ini?')) return;

        try {
            const result = await deleteSuratLamaran(id);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Surat lamaran berhasil dihapus');
            loadSuratList();
        } catch (error: any) {
            console.error('Error deleting surat:', error);
            toast.error('Gagal menghapus surat lamaran');
        }
    };

    const filteredSurat = suratList.filter(surat => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            surat.nama_perusahaan?.toLowerCase().includes(search) ||
            surat.posisi_lowongan?.toLowerCase().includes(search) ||
            surat.nama_lengkap?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    {onBack && (
                        <Button
                            variant="ghost"
                            className="mb-4 pl-0 hover:pl-2 transition-all -ml-2"
                            onClick={onBack}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Menu Utama
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <HistoryIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Riwayat Surat</h2>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        Kelola semua surat lamaran yang pernah Anda buat
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari perusahaan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white dark:bg-black/50 border-slate-200 dark:border-zinc-800"
                        />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full md:w-[140px] bg-white dark:bg-black/50 border-slate-200 dark:border-zinc-800">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-zinc-900 animate-pulse" />
                    ))}
                </div>
            ) : filteredSurat.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                    <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1 text-slate-900 dark:text-slate-100">Tidak ada surat ditemukan</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                        {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : "Belum ada riwayat surat lamaran yang dibuat."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSurat.map((surat, index) => (
                        <motion.div
                            key={surat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <HistoryCard
                                title={surat.nama_perusahaan}
                                description={surat.posisi_lowongan || "Posisi tidak tertera"}
                                icon={FileText}
                                date={new Date(surat.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                                gradientColors="group-hover:text-emerald-500 text-emerald-500/20"
                                onClick={() => window.location.href = `/surat-lamaran-sederhana/view?id=${surat.id}`}
                                onDelete={(e) => handleDelete(surat.id, e)}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
