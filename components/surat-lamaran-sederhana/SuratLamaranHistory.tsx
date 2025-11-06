"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Trash2,
  Download,
  Eye,
  Calendar,
  Building2,
  Search,
  Filter,
  Loader2,
  FileDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getSuratLamaranList } from "@/actions/surat-lamaran-sederhana/list";
import { deleteSuratLamaran } from "@/actions/surat-lamaran-sederhana/delete";

interface SuratLamaran {
  id: string;
  nama_perusahaan: string;
  posisi_lowongan: string;
  template_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  initialData: SuratLamaran[];
}

export function SuratLamaranHistory({ initialData }: Props) {
  const [suratList, setSuratList] = useState<SuratLamaran[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSuratLamaranList({
        search: searchQuery || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      if (result.data) {
        setSuratList(result.data);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh on filter/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus surat lamaran ini?")) return;

    try {
      const result = await deleteSuratLamaran(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus");
    }
  };

  // Render thumbnail
  const renderThumbnail = (surat: SuratLamaran) => {
    const templateNumber = surat.template_id.replace("template-", "");
    const isATS = parseInt(templateNumber) <= 10;

    return (
      <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`}>
        <div
          className="group/thumb relative w-full cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          style={{
            paddingBottom: "141.4%", // A4 aspect ratio
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#ffffff",
              fontSize: "5px",
              lineHeight: "1.4",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "6%",
                fontFamily: isATS ? "Times New Roman, serif" : "Arial, sans-serif",
                color: "#1e293b",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: "4px" }}>
                <div style={{ textAlign: isATS ? "left" : "right", fontSize: "4px", color: "#64748b" }}>
                  Jakarta, {new Date(surat.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: "4px" }}>
                <div style={{ fontSize: "4px", marginBottom: "1px" }}>Kepada Yth.</div>
                <div style={{ fontWeight: "bold", fontSize: "5px" }}>HRD Manager</div>
                <div style={{ fontSize: "4px" }}>{surat.nama_perusahaan}</div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "3px", fontSize: "4.5px" }}>
                <strong>Perihal:</strong> Lamaran - {surat.posisi_lowongan}
              </div>

              {/* Body preview */}
              <div style={{ fontSize: "4px", lineHeight: 1.3, textAlign: "justify" }}>
                Dengan hormat, Saya yang bertanda tangan di bawah ini ingin mengajukan permohonan untuk dapat bergabung dengan perusahaan yang Bapak/Ibu pimpin pada posisi {surat.posisi_lowongan}.
              </div>

              {/* Data box */}
              <div
                style={{
                  marginTop: "3px",
                  padding: "3px",
                  backgroundColor: isATS ? "#F8FAFC" : "#F0F9FF",
                  border: `1px solid ${isATS ? "#E2E8F0" : "#BFDBFE"}`,
                  borderRadius: "2px",
                }}
              >
                <div style={{ fontSize: "5px", fontWeight: "bold", marginBottom: "2px" }}>
                  DATA PRIBADI
                </div>
                <div style={{ fontSize: "3.5px", lineHeight: 1.4 }}>
                  <div>Nama: [Nama Lengkap]</div>
                  <div>Email: [Email]</div>
                  <div>No. HP: [Nomor HP]</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover/thumb:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/thumb:opacity-100">
            <div className="rounded-full bg-white/95 p-2 sm:p-3 shadow-lg backdrop-blur-sm">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity group-hover/thumb:opacity-100">
            <p className="truncate text-[10px] sm:text-xs font-semibold drop-shadow-md">
              Template {templateNumber}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari perusahaan atau posisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 sm:h-11"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10 sm:h-11 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter Status</span>
              <span className="sm:hidden">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>
              Semua
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("final")}>
              Final
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && suratList.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
            <FileText className="mb-4 h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-base sm:text-lg font-semibold">Belum Ada Surat Lamaran</h3>
            <p className="mb-4 sm:mb-6 text-center text-sm text-muted-foreground px-4">
              Mulai buat surat lamaran pertama Anda sekarang!
            </p>
            <Link href="/surat-lamaran-sederhana/buat">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Buat Surat Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Grid List */}
      {!loading && suratList.length > 0 && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {suratList.map((surat) => (
            <Card key={surat.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-1 text-sm sm:text-base">
                      {surat.nama_perusahaan}
                    </CardTitle>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {surat.posisi_lowongan}
                    </p>
                  </div>
                  <Badge
                    variant={surat.status === "final" ? "default" : "secondary"}
                    className="text-[10px] sm:text-xs shrink-0"
                  >
                    {surat.status === "final" ? "Final" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3 p-3 sm:pb-4 sm:p-4">
                {/* Thumbnail */}
                {renderThumbnail(surat)}

                {/* Info */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {formatDistanceToNow(new Date(surat.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full h-8 sm:h-9 text-xs gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">Lihat</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(surat.id)}
                    className="h-8 sm:h-9 text-xs gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="hidden sm:inline">Hapus</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
