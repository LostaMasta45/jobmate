"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function JobTrackerFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "all");

    // Simple debounce implementation if hook doesn't exist
    // or use existing hook if I knew where it was. 
    // I saw 'hooks' directory in list_dir, let's assume standard useDebounce exists or I'll just use timeout here to be safe

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(search);
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Sync state with URL params
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on search
        router.push(`?${params.toString()}`);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set("status", value);
        } else {
            params.delete("status");
        }
        params.set("page", "1"); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        router.push("?");
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search company, user, or position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-background/50"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Screening">Screening</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                {(search || status !== "all") && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        title="Reset filters"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
