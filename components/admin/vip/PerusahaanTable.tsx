"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Briefcase,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  Search,
  Filter,
} from "lucide-react";
import { verifyPerusahaan } from "@/actions/admin/perusahaan";
import { toast } from "sonner";

interface Perusahaan {
  id: string;
  name: string;
  lokasi: string | null;
  kontak: string | null;
  email: string | null;
  whatsapp: string | null;
  verified: boolean;
  loker_count: number;
  created_at: string;
}

export function PerusahaanTable({ perusahaanList }: { perusahaanList: Perusahaan[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLokasi, setFilterLokasi] = useState<string>("all");

  // Get unique lokasi
  const lokasiList = Array.from(new Set(perusahaanList.map((p) => p.lokasi).filter(Boolean)));

  // Filter data
  const filteredData = perusahaanList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && p.verified) ||
      (filterStatus === "unverified" && !p.verified);
    const matchLokasi = filterLokasi === "all" || p.lokasi === filterLokasi;

    return matchSearch && matchStatus && matchLokasi;
  });

  const handleVerify = async (id: string, verified: boolean) => {
    const result = await verifyPerusahaan(id, verified);
    if (result.success) {
      toast.success(verified ? "Perusahaan diverifikasi" : "Verifikasi dibatalkan");
    } else {
      toast.error("Gagal mengupdate verifikasi");
    }
  };

  return (
    <Card className="p-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Filter & Pencarian</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status Verifikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="verified">Terverifikasi</SelectItem>
              <SelectItem value="unverified">Belum Verifikasi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLokasi} onValueChange={setFilterLokasi}>
            <SelectTrigger>
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lokasi</SelectItem>
              {lokasiList.map((lokasi) => (
                <SelectItem key={lokasi} value={lokasi!}>
                  {lokasi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredData.length} dari {perusahaanList.length} perusahaan
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((perusahaan) => (
            <Card key={perusahaan.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{perusahaan.name}</h3>
                        {perusahaan.verified && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 ml-13">
                    {perusahaan.lokasi && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{perusahaan.lokasi}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{perusahaan.loker_count} loker</span>
                    </div>
                    {perusahaan.whatsapp && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{perusahaan.whatsapp}</span>
                      </div>
                    )}
                  </div>

                  {perusahaan.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                      <Mail className="w-4 h-4" />
                      <span>{perusahaan.email}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2 ml-13">
                    Terdaftar: {new Date(perusahaan.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {perusahaan.verified ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerify(perusahaan.id, false)}
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Batalkan Verifikasi
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleVerify(perusahaan.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Verifikasi
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Tidak Ada Perusahaan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || filterStatus !== "all" || filterLokasi !== "all"
                ? "Tidak ditemukan perusahaan dengan filter yang dipilih"
                : "Belum ada perusahaan yang terdaftar"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
