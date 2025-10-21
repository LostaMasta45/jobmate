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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Crown,
  Users,
  Star,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { updateMembership, deactivateMember, extendMembership } from "@/actions/admin/member";
import { toast } from "sonner";

interface Member {
  id: string;
  email: string;
  full_name?: string | null;
  name?: string | null;
  membership?: string | null;
  membership_expiry?: string | null;
  membership_status?: string | null;
  created_at: string;
}

export function MemberTable({ memberList }: { memberList: Member[] }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all"); // all, free, vip_basic, vip_premium
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [extendDays, setExtendDays] = useState<string>("30");

  // Filter data
  const filteredData = memberList.filter((m) => {
    // Add null checks for all fields
    const displayName = m.full_name || m.name || m.email || "No Name";
    const email = m.email || "";
    
    const matchSearch =
      email.toLowerCase().includes(search.toLowerCase()) ||
      displayName.toLowerCase().includes(search.toLowerCase());
    
    const membershipType = m.membership || "free";
    const matchType =
      filterType === "all" ||
      (filterType === "free" && (membershipType === "free" || !m.membership)) ||
      (filterType === "vip_basic" && membershipType === "vip_basic") ||
      (filterType === "vip_premium" && membershipType === "vip_premium");

    return matchSearch && matchType;
  });

  const handleDeactivate = async (userId: string) => {
    if (!confirm("Yakin ingin menonaktifkan member ini?")) return;

    const result = await deactivateMember(userId);
    if (result.success) {
      toast.success("Member berhasil dinonaktifkan");
    } else {
      toast.error("Gagal menonaktifkan member");
    }
  };

  const handleExtend = async () => {
    if (!selectedMember) return;

    const days = parseInt(extendDays);
    if (isNaN(days) || days <= 0) {
      toast.error("Jumlah hari tidak valid");
      return;
    }

    const result = await extendMembership(selectedMember.id, days);
    if (result.success) {
      toast.success(`Membership diperpanjang ${days} hari`);
      setSelectedMember(null);
    } else {
      toast.error("Gagal memperpanjang membership");
    }
  };

  const handleUpgrade = async (userId: string, newType: string) => {
    console.log('[MEMBER_TABLE] Upgrading user:', userId, 'to', newType);
    
    const expiry = newType === "vip_basic" 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null; // Lifetime for premium

    const result = await updateMembership(userId, newType, expiry);
    
    console.log('[MEMBER_TABLE] Upgrade result:', result);
    
    if (result.success) {
      toast.success("Membership berhasil diupdate! Refresh halaman jika perlu.");
      // Force refresh page to show updated data
      window.location.reload();
    } else {
      console.error('[MEMBER_TABLE] Upgrade failed:', result.error);
      const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error 
        ? String(result.error.message) 
        : 'Unknown error';
      toast.error(`Gagal mengupdate membership: ${errorMessage}`);
    }
  };

  const getMembershipBadge = (membership: string) => {
    if (membership === "vip_premium") {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <Star className="w-3 h-3 mr-1" />
          VIP Premium
        </Badge>
      );
    }
    if (membership === "vip_basic") {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
          <Crown className="w-3 h-3 mr-1" />
          VIP Basic
        </Badge>
      );
    }
    // Free user
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300">
        <Users className="w-3 h-3 mr-1" />
        Free User
      </Badge>
    );
  };

  const getExpiryStatus = (expiry: string | null | undefined) => {
    if (!expiry) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          Lifetime ♾️
        </Badge>
      );
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    if (daysLeft <= 7) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          {daysLeft} hari lagi ⚠️
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        {daysLeft} hari lagi
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Filter & Pencarian</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari email atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Jenis Membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🔍 Semua Users</SelectItem>
              <SelectItem value="free">👤 Free Users</SelectItem>
              <SelectItem value="vip_basic">👑 VIP Basic</SelectItem>
              <SelectItem value="vip_premium">⭐ VIP Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredData.length} dari {memberList.length} member
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((member) => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">
                          {member.full_name || member.email || "No Name"}
                        </h3>
                        {getMembershipBadge(member.membership || "free")}
                      </div>
                      {member.full_name && member.email && (
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-13">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Bergabung: {new Date(member.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    {getExpiryStatus(member.membership_expiry)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Show different actions based on membership */}
                  {(member.membership === "free" || !member.membership) ? (
                    // Free User - Show Upgrade Options
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpgrade(member.id, "vip_basic")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade ke Basic
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpgrade(member.id, "vip_premium")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Upgrade ke Premium
                      </Button>
                    </div>
                  ) : (
                    // VIP User - Show Management Options
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMember(member)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Perpanjang
                          </Button>
                        </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Perpanjang Membership</DialogTitle>
                        <DialogDescription>
                          Perpanjang membership untuk {member.full_name || member.email || "User"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Jumlah Hari</Label>
                          <Input
                            type="number"
                            value={extendDays}
                            onChange={(e) => setExtendDays(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setExtendDays("30")} variant="outline" size="sm">
                            30 Hari
                          </Button>
                          <Button onClick={() => setExtendDays("90")} variant="outline" size="sm">
                            90 Hari
                          </Button>
                          <Button onClick={() => setExtendDays("365")} variant="outline" size="sm">
                            1 Tahun
                          </Button>
                        </div>
                        <Button onClick={handleExtend} className="w-full">
                          Perpanjang
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {member.membership === "vip_basic" ? (
                    <Button
                      size="sm"
                      onClick={() => handleUpgrade(member.id, "vip_premium")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Upgrade Premium
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpgrade(member.id, "vip_basic")}
                    >
                      Downgrade ke Basic
                    </Button>
                  )}

                      {member.membership === "vip_basic" ? (
                        <Button
                          size="sm"
                          onClick={() => handleUpgrade(member.id, "vip_premium")}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Upgrade Premium
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpgrade(member.id, "vip_basic")}
                        >
                          Downgrade ke Basic
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeactivate(member.id)}
                        className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {member.membership !== "free" ? "Turunkan ke Free" : "Nonaktifkan"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Tidak Ada Member</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || filterType !== "all"
                ? "Tidak ditemukan member dengan filter yang dipilih"
                : "Belum ada member VIP yang terdaftar"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
