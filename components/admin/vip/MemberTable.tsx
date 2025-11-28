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
  MoreVertical,
  ShieldAlert,
  Sparkles,
  Clock,
  Mail,
} from "lucide-react";
import { updateMembership, deactivateMember, extendMembership } from "@/actions/admin/member";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);

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
    if (!confirm("Are you sure you want to deactivate this member?")) return;

    const result = await deactivateMember(userId);
    if (result.success) {
      toast.success("Member deactivated successfully");
    } else {
      toast.error("Failed to deactivate member");
    }
  };

  const handleExtend = async () => {
    if (!selectedMember) return;

    const days = parseInt(extendDays);
    if (isNaN(days) || days <= 0) {
      toast.error("Invalid days");
      return;
    }

    const result = await extendMembership(selectedMember.id, days);
    if (result.success) {
      toast.success(`Membership extended for ${days} days`);
      setSelectedMember(null);
      setIsExtendDialogOpen(false);
    } else {
      toast.error("Failed to extend membership");
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
      toast.success("Membership updated successfully! Refreshing...");
      window.location.reload();
    } else {
      console.error('[MEMBER_TABLE] Upgrade failed:', result.error);
      const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error 
        ? String(result.error.message) 
        : 'Unknown error';
      toast.error(`Failed to update membership: ${errorMessage}`);
    }
  };

  const getMembershipBadge = (membership: string) => {
    if (membership === "vip_premium") {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
          <Star className="w-3 h-3 mr-1 fill-current" />
          VIP Premium
        </Badge>
      );
    }
    if (membership === "vip_basic") {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm">
          <Crown className="w-3 h-3 mr-1" />
          VIP Basic
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
        <Users className="w-3 h-3 mr-1" />
        Free User
      </Badge>
    );
  };

  const getExpiryStatus = (expiry: string | null | undefined) => {
    if (!expiry) {
      return (
        <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/20 px-2 py-1 rounded-md">
          Lifetime Access ♾️
        </div>
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
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
          {daysLeft} days left ⚠️
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-green-600 bg-green-100/50 dark:text-green-400 dark:bg-green-900/20">
        {daysLeft} days left
      </Badge>
    );
  };

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">User Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="free">Free Users</SelectItem>
                <SelectItem value="vip_basic">VIP Basic</SelectItem>
                <SelectItem value="vip_premium">VIP Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredData.length > 0 ? (
            filteredData.map((member) => (
              <div 
                key={member.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-accent/40 transition-colors border-b border-border/40 last:border-0"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <Avatar className="h-10 w-10 border bg-muted">
                    <AvatarFallback className="font-semibold text-primary">
                      {(member.full_name || member.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">
                        {member.full_name || member.email || "No Name"}
                      </h3>
                      {getMembershipBadge(member.membership || "free")}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {new Date(member.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="block">
                    {getExpiryStatus(member.membership_expiry)}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {member.membership === "free" || !member.membership ? (
                        <>
                          <DropdownMenuItem onClick={() => handleUpgrade(member.id, "vip_basic")}>
                            <Crown className="w-4 h-4 mr-2 text-blue-500" />
                            Upgrade to Basic
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpgrade(member.id, "vip_premium")}>
                            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                            Upgrade to Premium
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => {
                            setSelectedMember(member);
                            setIsExtendDialogOpen(true);
                          }}>
                            <Clock className="w-4 h-4 mr-2" />
                            Extend Access
                          </DropdownMenuItem>
                          
                          {member.membership === "vip_basic" ? (
                            <DropdownMenuItem onClick={() => handleUpgrade(member.id, "vip_premium")}>
                              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                              Upgrade to Premium
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUpgrade(member.id, "vip_basic")}>
                              <Crown className="w-4 h-4 mr-2" />
                              Downgrade to Basic
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeactivate(member.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No members found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                {search || filterType !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Users will appear here once they register."}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Extend Membership Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Membership</DialogTitle>
            <DialogDescription>
              Add days to membership for <span className="font-medium text-foreground">{selectedMember?.full_name || selectedMember?.email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                min="1"
                placeholder="e.g. 30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setExtendDays("7")} className="flex-1">
                +7 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => setExtendDays("30")} className="flex-1">
                +30 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => setExtendDays("90")} className="flex-1">
                +90 Days
              </Button>
            </div>
            <Button onClick={handleExtend} className="w-full mt-4">
              Confirm Extension
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
