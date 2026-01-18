"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Types
export interface RevenueOverview {
    totalRevenue: number;
    thisMonthRevenue: number;
    thisWeekRevenue: number;
    todayRevenue: number;
    totalTransactions: number;
    paidCount: number;
    pendingCount: number;
    expiredCount: number;
    failedCount: number;
    pendingAmount: number;
}

export interface PaymentRecord {
    id: string;
    external_id: string;
    invoice_id: string | null;
    user_email: string;
    user_name: string;
    user_whatsapp: string | null;
    plan_type: 'basic' | 'premium';
    amount: number;
    status: 'pending' | 'paid' | 'expired' | 'failed';
    payment_method: string | null;
    payment_gateway: string | null;
    invoice_url: string | null;
    paid_at: string | null;
    expired_at: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface InvoiceFilters {
    status?: 'all' | 'paid' | 'pending' | 'expired' | 'failed';
    planType?: 'all' | 'basic' | 'premium';
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface IncomeByPeriod {
    period: string;
    basicAmount: number;
    premiumAmount: number;
    totalAmount: number;
    transactionCount: number;
}

export interface IncomeByMethod {
    method: string;
    amount: number;
    count: number;
    percentage: number;
}

// Get Revenue Overview
export async function getRevenueOverview(): Promise<RevenueOverview> {
    const supabase = createAdminClient();

    try {
        const now = new Date();

        // Today start
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // This week start (Monday)
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
        weekStart.setHours(0, 0, 0, 0);

        // This month start
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // Get all payments
        const { data: payments, count: totalTransactions } = await supabase
            .from("payments")
            .select("*", { count: "exact" });

        if (!payments) {
            return {
                totalRevenue: 0,
                thisMonthRevenue: 0,
                thisWeekRevenue: 0,
                todayRevenue: 0,
                totalTransactions: 0,
                paidCount: 0,
                pendingCount: 0,
                expiredCount: 0,
                failedCount: 0,
                pendingAmount: 0,
            };
        }

        // Calculate totals
        const paidPayments = payments.filter(p => p.status === 'paid');
        const pendingPayments = payments.filter(p => p.status === 'pending');
        const expiredPayments = payments.filter(p => p.status === 'expired');
        const failedPayments = payments.filter(p => p.status === 'failed');

        const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // This month revenue (paid only)
        const thisMonthPayments = paidPayments.filter(p =>
            p.paid_at && new Date(p.paid_at) >= monthStart
        );
        const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // This week revenue
        const thisWeekPayments = paidPayments.filter(p =>
            p.paid_at && new Date(p.paid_at) >= weekStart
        );
        const thisWeekRevenue = thisWeekPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // Today revenue
        const todayPayments = paidPayments.filter(p =>
            p.paid_at && new Date(p.paid_at) >= todayStart
        );
        const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        return {
            totalRevenue,
            thisMonthRevenue,
            thisWeekRevenue,
            todayRevenue,
            totalTransactions: totalTransactions || 0,
            paidCount: paidPayments.length,
            pendingCount: pendingPayments.length,
            expiredCount: expiredPayments.length,
            failedCount: failedPayments.length,
            pendingAmount,
        };
    } catch (error) {
        console.error("Error fetching revenue overview:", error);
        return {
            totalRevenue: 0,
            thisMonthRevenue: 0,
            thisWeekRevenue: 0,
            todayRevenue: 0,
            totalTransactions: 0,
            paidCount: 0,
            pendingCount: 0,
            expiredCount: 0,
            failedCount: 0,
            pendingAmount: 0,
        };
    }
}

// Get Recent Payments
export async function getRecentPayments(limit = 10): Promise<PaymentRecord[]> {
    const supabase = createAdminClient();

    try {
        const { data: payments, error } = await supabase
            .from("payments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching recent payments:", error);
            return [];
        }

        return payments || [];
    } catch (error) {
        console.error("Error fetching recent payments:", error);
        return [];
    }
}

// Get Invoices with Filters
export async function getInvoices(filters: InvoiceFilters = {}) {
    const supabase = createAdminClient();
    const {
        status = 'all',
        planType = 'all',
        search = '',
        startDate,
        endDate,
        page = 1,
        limit = 10
    } = filters;

    try {
        let query = supabase
            .from("payments")
            .select("*", { count: "exact" });

        // Apply status filter
        if (status !== 'all') {
            query = query.eq("status", status);
        }

        // Apply plan type filter
        if (planType !== 'all') {
            query = query.eq("plan_type", planType);
        }

        // Apply search filter
        if (search) {
            query = query.or(`user_email.ilike.%${search}%,user_name.ilike.%${search}%,external_id.ilike.%${search}%`);
        }

        // Apply date range
        if (startDate) {
            query = query.gte("created_at", startDate);
        }
        if (endDate) {
            query = query.lte("created_at", endDate);
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to).order("created_at", { ascending: false });

        const { data, count, error } = await query;

        if (error) {
            console.error("Error fetching invoices:", error);
            return { data: [], total: 0, page, limit };
        }

        return {
            data: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
        };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { data: [], total: 0, page, limit, totalPages: 0 };
    }
}

// Get Rekap by Status
export async function getRekapByStatus(status: 'paid' | 'pending' | 'expired' | 'failed') {
    const supabase = createAdminClient();

    try {
        const { data: payments, error } = await supabase
            .from("payments")
            .select("*")
            .eq("status", status)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(`Error fetching ${status} payments:`, error);
            return { data: [], totalAmount: 0, count: 0 };
        }

        const totalAmount = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        return {
            data: payments || [],
            totalAmount,
            count: payments?.length || 0,
        };
    } catch (error) {
        console.error(`Error fetching ${status} payments:`, error);
        return { data: [], totalAmount: 0, count: 0 };
    }
}

// Get Income Report
export async function getIncomeReport() {
    const supabase = createAdminClient();

    try {
        // Get all paid payments
        const { data: paidPayments, error } = await supabase
            .from("payments")
            .select("*")
            .eq("status", "paid")
            .order("paid_at", { ascending: false });

        if (error || !paidPayments) {
            console.error("Error fetching income report:", error);
            return {
                totalIncome: 0,
                basicIncome: 0,
                premiumIncome: 0,
                byMethod: [],
                byMonth: [],
            };
        }

        // Calculate totals
        const totalIncome = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const basicPayments = paidPayments.filter(p => p.plan_type === 'basic');
        const premiumPayments = paidPayments.filter(p => p.plan_type === 'premium');
        const basicIncome = basicPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const premiumIncome = premiumPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // Group by payment method
        const methodCounts: { [key: string]: { amount: number; count: number } } = {};
        paidPayments.forEach(p => {
            const method = p.payment_method || 'unknown';
            if (!methodCounts[method]) {
                methodCounts[method] = { amount: 0, count: 0 };
            }
            methodCounts[method].amount += p.amount || 0;
            methodCounts[method].count += 1;
        });

        const byMethod: IncomeByMethod[] = Object.entries(methodCounts)
            .map(([method, data]) => ({
                method,
                amount: data.amount,
                count: data.count,
                percentage: totalIncome > 0 ? Math.round((data.amount / totalIncome) * 100) : 0,
            }))
            .sort((a, b) => b.amount - a.amount);

        // Group by month
        const monthCounts: { [key: string]: IncomeByPeriod } = {};
        paidPayments.forEach(p => {
            if (!p.paid_at) return;
            const date = new Date(p.paid_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthCounts[monthKey]) {
                monthCounts[monthKey] = {
                    period: monthKey,
                    basicAmount: 0,
                    premiumAmount: 0,
                    totalAmount: 0,
                    transactionCount: 0,
                };
            }

            if (p.plan_type === 'basic') {
                monthCounts[monthKey].basicAmount += p.amount || 0;
            } else {
                monthCounts[monthKey].premiumAmount += p.amount || 0;
            }
            monthCounts[monthKey].totalAmount += p.amount || 0;
            monthCounts[monthKey].transactionCount += 1;
        });

        const byMonth = Object.values(monthCounts)
            .sort((a, b) => b.period.localeCompare(a.period))
            .slice(0, 12);

        return {
            totalIncome,
            basicIncome,
            premiumIncome,
            basicCount: basicPayments.length,
            premiumCount: premiumPayments.length,
            byMethod,
            byMonth,
        };
    } catch (error) {
        console.error("Error fetching income report:", error);
        return {
            totalIncome: 0,
            basicIncome: 0,
            premiumIncome: 0,
            byMethod: [],
            byMonth: [],
        };
    }
}
