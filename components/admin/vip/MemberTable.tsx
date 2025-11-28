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
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm px-2 py-0.5 text-xs">
          <Sparkles className="w-3 h-3 mr-1 fill-white/20" />
          Premium
        </Badge>
      );
    }
    if (membership === "vip_basic") {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm px-2 py-0.5 text-xs hover:bg-blue-200">
          <Crown className="w-3 h-3 mr-1" />
          Basic
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted/50 text-muted-foreground px-2 py-0.5 text-xs font-normal">
        Free
      </Badge>
    );
  };

  const getExpiryStatus = (expiry: string | null | undefined) => {
    if (!expiry) {
      return (
        <div className="flex items-center text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <span className="mr-1">♾️</span> Lifetime
        </div>
      );
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <Badge variant="destructive" className="text-[10px] px-2 py-0.5">Expired</Badge>;
    }

    if (daysLeft <= 7) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-2 py-0.5">
          {daysLeft}d left ⚠️
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-green-600 bg-green-100/50 dark:text-green-400 dark:bg-green-900/20 text-[10px] px-2 py-0.5">
        {daysLeft}d left
      </Badge>
    );
  };

  return (
    <Card className="border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b bg-muted/30 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background h-9 text-sm"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-36 bg-background h-9 text-sm">
              <div className="flex items-center gap-2">
                 <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                 <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="free">Free Users</SelectItem>
              <SelectItem value="vip_basic">VIP Basic</SelectItem>
              <SelectItem value="vip_premium">VIP Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        <div className="hidden sm:grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
           <div className="col-span-5 pl-2">User Info</div>
           <div className="col-span-3">Membership</div>
           <div className="col-span-3">Status</div>
           <div className="col-span-1 text-right pr-2">Action</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredData.length > 0 ? (
            filteredData.map((member) => (
              <div 
                key={member.id} 
                className="group relative flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-3 hover:bg-muted/30 transition-colors items-start sm:items-center"
              >
                {/* Mobile Layout: Top Row (User Info + Action) */}
                <div className="flex items-center justify-between w-full sm:hidden mb-2">
                   <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border bg-muted">
                        <AvatarFallback className="text-xs font-medium text-primary">
                          {(member.full_name || member.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm truncate max-w-[150px]">
                           {member.full_name || member.email?.split('@')[0] || "No Name"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                           {member.email}
                        </span>
                      </div>
                   </div>
                   
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {/* ... (Same Dropdown Content) ... */}
                       <DropdownMenuLabel>Manage User</DropdownMenuLabel>
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

                {/* Desktop: User Info col-span-5 */}
                <div className="hidden sm:flex col-span-5 items-center gap-3 pl-2 min-w-0">
                  <Avatar className="h-8 w-8 border bg-muted shrink-0">
                    <AvatarFallback className="text-xs font-medium text-primary">
                      {(member.full_name || member.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate block text-foreground">
                        {member.full_name || member.email?.split('@')[0] || "No Name"}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate max-w-[140px]">{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Shared: Membership col-span-3 */}
                <div className="col-span-3 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-0 pl-12 sm:pl-0">
                   <span className="text-xs text-muted-foreground sm:hidden">Plan:</span>
                   <div className="flex flex-col items-end sm:items-start">
                      {getMembershipBadge(member.membership || "free")}
                      <span className="text-[10px] text-muted-foreground mt-1 sm:hidden">
                         Since {new Date(member.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </div>

                {/* Shared: Status col-span-3 */}
                <div className="col-span-3 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-0 pl-12 sm:pl-0">
                   <span className="text-xs text-muted-foreground sm:hidden">Status:</span>
                   {getExpiryStatus(member.membership_expiry)}
                </div>

                 {/* Desktop: Action col-span-1 */}
                <div className="hidden sm:flex col-span-1 justify-end pr-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                       <DropdownMenuLabel>Manage User</DropdownMenuLabel>
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
              <h3 className="text-sm font-semibold">No members found</h3>
              <p className="text-muted-foreground text-xs max-w-xs mt-1">
                {search || filterType !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Users will appear here once they register."}
              </p>
            </div>
          )}
        </div>
      </div>

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
