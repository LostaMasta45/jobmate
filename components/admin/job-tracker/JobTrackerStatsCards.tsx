"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStats } from "@/actions/admin/admin-applications";
import {
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    UserCheck,
    XCircle
} from "lucide-react";

interface JobTrackerStatsCardsProps {
    stats: ApplicationStats;
}

export function JobTrackerStatsCards({ stats }: JobTrackerStatsCardsProps) {
    const cards = [
        {
            title: "Total Applications",
            value: stats.total,
            icon: FileText,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-200 dark:border-blue-900",
        },
        {
            title: "Applied",
            value: stats.applied,
            icon: Briefcase,
            color: "text-sky-500",
            bgColor: "bg-sky-500/10",
            borderColor: "border-sky-200 dark:border-sky-900",
        },
        {
            title: "Screening",
            value: stats.screening,
            icon: UserCheck, // Or Search
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-200 dark:border-purple-900",
        },
        {
            title: "Interview",
            value: stats.interview,
            icon: Clock,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-200 dark:border-yellow-900",
        },
        {
            title: "Hired",
            value: stats.hired,
            icon: CheckCircle2,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-200 dark:border-green-900",
        },
        {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-200 dark:border-red-900",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index} className={`border-l-4 ${card.borderColor} shadow-sm overflow-hidden`}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className={`p-2 rounded-full mb-3 ${card.bgColor} ${card.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                                {card.title}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
