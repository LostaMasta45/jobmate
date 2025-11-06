"use client";

import * as React from "react";
import { Bell, Search, User, LogOut, FileText, Briefcase, Mail, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { FollowUpNotificationPanel } from "@/components/followup/FollowUpNotificationPanel";

interface TopbarProps {
  user?: {
    name: string;
    email: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Perform search
  React.useEffect(() => {
    async function performSearch() {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) return;

        const query = debouncedSearch.toLowerCase();
        const results: any[] = [];

        // Search Applications
        const { data: apps } = await supabase
          .from("applications")
          .select("id, company, position, status, created_at")
          .eq("user_id", currentUser.id)
          .or(`company.ilike.%${query}%,position.ilike.%${query}%`)
          .limit(5);
        
        if (apps) {
          results.push(...apps.map(app => ({
            type: "application",
            icon: Briefcase,
            title: app.company,
            subtitle: app.position,
            href: `/tools/tracker#${app.id}`,
            date: new Date(app.created_at),
          })));
        }

        // Search Cover Letters (surat-lamaran-sederhana)
        const { data: coverLetters } = await supabase
          .from("surat_lamaran_sederhana")
          .select("id, nama_perusahaan, posisi_lowongan, created_at")
          .eq("user_id", currentUser.id)
          .or(`nama_perusahaan.ilike.%${query}%,posisi_lowongan.ilike.%${query}%`)
          .limit(5);
        
        if (coverLetters) {
          results.push(...coverLetters.map(cl => ({
            type: "cover_letter",
            icon: FileText,
            title: `Surat Lamaran - ${cl.nama_perusahaan}`,
            subtitle: cl.posisi_lowongan,
            href: `/surat-lamaran-sederhana/view?id=${cl.id}`,
            date: new Date(cl.created_at),
          })));
        }

        // Search Emails
        const { data: emails } = await supabase
          .from("email_history")
          .select("id, company, position, created_at")
          .eq("user_id", currentUser.id)
          .or(`company.ilike.%${query}%,position.ilike.%${query}%`)
          .limit(5);
        
        if (emails) {
          results.push(...emails.map(email => ({
            type: "email",
            icon: Mail,
            title: `Email - ${email.company}`,
            subtitle: email.position,
            href: `/tools/email-generator?id=${email.id}`,
            date: new Date(email.created_at),
          })));
        }

        // Search WhatsApp Messages
        const { data: waMessages } = await supabase
          .from("wa_messages")
          .select("id, company, position, created_at")
          .eq("user_id", currentUser.id)
          .or(`company.ilike.%${query}%,position.ilike.%${query}%`)
          .limit(5);
        
        if (waMessages) {
          results.push(...waMessages.map(wa => ({
            type: "whatsapp",
            icon: MessageCircle,
            title: `WhatsApp - ${wa.company}`,
            subtitle: wa.position,
            href: `/tools/wa-generator?id=${wa.id}`,
            date: new Date(wa.created_at),
          })));
        }

        // Sort by date (newest first)
        results.sort((a, b) => b.date.getTime() - a.date.getTime());

        setSearchResults(results.slice(0, 10));
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }

    performSearch();
  }, [debouncedSearch]);

  const handleSearchResultClick = (href: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(href);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // Clear client-side session FIRST
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Clear server-side session
      await signOut();
      
      // Small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a hard redirect to clear all state
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect anyway
      window.location.href = "/sign-in";
    }
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            id="global-search"
            type="search"
            placeholder="Search applications, documents... (Ctrl+K)"
            className="w-full rounded-lg border bg-background pl-8 pr-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full max-w-2xl rounded-lg border bg-card shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={`${result.type}-${index}`}
                        onClick={() => handleSearchResultClick(result.href)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {result.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FollowUpNotificationPanel />

        <ThemeToggle />

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-card p-2 shadow-lg">
              <div className="px-2 py-2 border-b">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/settings")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
