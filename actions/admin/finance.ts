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

// Get Revenue Overview (includes both payments and mypg_transactions)
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

        // Get all payments from "payments" table
        const { data: payments, count: paymentsCount } = await supabase
            .from("payments")
            .select("*", { count: "exact" });

        // Get all payments from "mypg_transactions" table
        const { data: mypgPayments, count: mypgCount } = await supabase
            .from("mypg_transactions")
            .select("*", { count: "exact" });

        // Normalize mypg_transactions to match format
        const normalizedMypg = (mypgPayments || []).map((tx: any) => ({
            status: (tx.status || 'PENDING').toLowerCase(),
            amount: parseInt(tx.amount) || 0,
            paid_at: tx.paid_at,
        }));

        // Combine all payments
        const allPayments = [...(payments || []), ...normalizedMypg];

        if (allPayments.length === 0) {
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
        const paidPayments = allPayments.filter(p => p.status === 'paid');
        const pendingPayments = allPayments.filter(p => p.status === 'pending');
        const expiredPayments = allPayments.filter(p => p.status === 'expired');
        const failedPayments = allPayments.filter(p => p.status === 'failed');

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
            totalTransactions: (paymentsCount || 0) + (mypgCount || 0),
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

// Get Invoices with Filters (includes both payments and mypg_transactions)
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
        // Query 1: Regular payments table
        let paymentsQuery = supabase
            .from("payments")
            .select("*", { count: "exact" });

        if (status !== 'all') paymentsQuery = paymentsQuery.eq("status", status);
        if (planType !== 'all') paymentsQuery = paymentsQuery.eq("plan_type", planType);
        if (search) paymentsQuery = paymentsQuery.or(`user_email.ilike.%${search}%,user_name.ilike.%${search}%,external_id.ilike.%${search}%`);
        if (startDate) paymentsQuery = paymentsQuery.gte("created_at", startDate);
        if (endDate) paymentsQuery = paymentsQuery.lte("created_at", endDate);

        const { data: paymentsData, count: paymentsCount } = await paymentsQuery.order("created_at", { ascending: false });

        // Query 2: MY PG transactions table
        let mypgQuery = supabase
            .from("mypg_transactions")
            .select("*", { count: "exact" });

        // Map status for mypg (uses PAID/PENDING/EXPIRED instead of paid/pending/expired)
        if (status !== 'all') {
            const mypgStatus = status.toUpperCase();
            mypgQuery = mypgQuery.eq("status", mypgStatus);
        }
        if (planType !== 'all') mypgQuery = mypgQuery.eq("plan_type", planType);
        if (search) mypgQuery = mypgQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,order_id.ilike.%${search}%`);
        if (startDate) mypgQuery = mypgQuery.gte("created_at", startDate);
        if (endDate) mypgQuery = mypgQuery.lte("created_at", endDate);

        const { data: mypgData, count: mypgCount } = await mypgQuery.order("created_at", { ascending: false });

        // Normalize mypg_transactions to match PaymentRecord format
        const normalizedMypg: PaymentRecord[] = (mypgData || []).map((tx: any) => ({
            id: tx.id,
            external_id: tx.order_id,
            invoice_id: null,
            user_email: tx.email || '',
            user_name: tx.full_name || '',
            user_whatsapp: tx.whatsapp || null,
            plan_type: tx.plan_type || 'basic',
            amount: parseInt(tx.amount) || 0,
            status: (tx.status || 'PENDING').toLowerCase() as any,
            payment_method: 'QRIS (MY PG)',
            payment_gateway: 'mypg-klikqris',
            invoice_url: tx.qris_url || null,
            paid_at: tx.paid_at || null,
            expired_at: tx.expired_at || null,
            created_at: tx.created_at,
            updated_at: tx.updated_at || null,
        }));

        // Merge and sort by created_at descending
        const allData = [...(paymentsData || []), ...normalizedMypg]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const totalCount = (paymentsCount || 0) + (mypgCount || 0);

        // Apply pagination to merged results
        const from = (page - 1) * limit;
        const paginatedData = allData.slice(from, from + limit);

        return {
            data: paginatedData,
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
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
