"use client";

import * as React from "react";
import { Bell, Search, User, LogOut, FileText, Briefcase, Mail, MessageCircle, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { FollowUpNotificationPanel } from "@/components/followup/FollowUpNotificationPanel";
import { cn } from "@/lib/utils";

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
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
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
    <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center gap-4 border-b border-border/40 bg-background/60 dark:bg-black/90 backdrop-blur-xl px-4 md:px-6 transition-all duration-300">
      <div className="flex flex-1 items-center gap-4">
        {/* Search Bar - Glassy Pill Design */}
        <div className="relative max-w-md flex-1" ref={searchRef}>
          <div className={cn(
            "relative group transition-all duration-300",
            showSearchResults ? "shadow-lg ring-2 ring-primary/20 rounded-2xl" : ""
          )}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              id="global-search"
              type="search"
              placeholder="Search..."
              className="w-full rounded-2xl border border-border/50 bg-muted/30 pl-10 pr-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background/80 hover:bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
            {searchQuery ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 rounded-full hover:bg-background/80"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            ) : (
              <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none">
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">⌘ K</span>
              </div>
            )}

          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full max-w-2xl rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
              {isSearching ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span>Running search...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2 space-y-1">
                  {searchResults.map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={`${result.type}-${index}`}
                        onClick={() => handleSearchResultClick(result.href)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 hover:scale-[0.99] transition-all duration-200 text-left group"
                      >
                        <div className="flex-shrink-0 mt-0.5 p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 p-1 bg-muted/30 rounded">
                          {result.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <FollowUpNotificationPanel />

        <ThemeToggle />

        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 hover:bg-muted/50 transition-all border border-transparent hover:border-border/40"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10 shadow-inner">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || "User"}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
              <div className="px-3 py-3 border-b border-border/50 mb-1">
                <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-lg hover:bg-primary/5 hover:text-primary transition-colors h-9 px-3"
                  onClick={() => router.push("/settings")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
                <div className="my-1 border-t border-border/50 mx-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg h-9 px-3"
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
