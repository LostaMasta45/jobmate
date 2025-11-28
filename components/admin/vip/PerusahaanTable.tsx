"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ExternalLink,
  MoreVertical,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { verifyPerusahaan } from "@/actions/admin/perusahaan";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      toast.success(verified ? "Company verified successfully" : "Verification revoked");
    } else {
      toast.error("Failed to update verification status");
    }
  };

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Registered Companies</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLokasi} onValueChange={setFilterLokasi}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {lokasiList.map((lokasi) => (
                  <SelectItem key={lokasi} value={lokasi!}>
                    {lokasi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredData.length > 0 ? (
            filteredData.map((perusahaan) => (
              <div 
                key={perusahaan.id} 
                className="group flex flex-col sm:flex-row sm:items-start justify-between p-4 hover:bg-accent/40 transition-colors border-b border-border/40 last:border-0"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center border border-border/50">
                    <Building2 className="w-6 h-6 text-primary/70" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{perusahaan.name}</h3>
                      {perusahaan.verified && (
                        <Badge variant="secondary" className="bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-0">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {perusahaan.lokasi && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{perusahaan.lokasi}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="font-medium text-foreground">{perusahaan.loker_count}</span>
                        <span>active jobs</span>
                      </div>
                      {perusahaan.whatsapp && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{perusahaan.whatsapp}</span>
                        </div>
                      )}
                       {perusahaan.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{perusahaan.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="text-xs text-muted-foreground hidden sm:block mr-2">
                    Joined {new Date(perusahaan.created_at).toLocaleDateString("id-ID")}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {perusahaan.verified ? (
                        <DropdownMenuItem onClick={() => handleVerify(perusahaan.id, false)} className="text-amber-600 focus:text-amber-600">
                          <Ban className="w-4 h-4 mr-2" />
                          Revoke Verification
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleVerify(perusahaan.id, true)} className="text-green-600 focus:text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Verify Company
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem disabled>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No companies found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                {search || filterStatus !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Companies will appear here once they register."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
