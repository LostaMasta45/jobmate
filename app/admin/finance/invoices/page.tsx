"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getInvoices, PaymentRecord } from "@/actions/admin/finance";
import { formatCurrency } from "@/lib/finance-utils";

// Status badge component
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const icons: Record<string, string> = {
        paid: "✅",
        pending: "⏳",
        expired: "⌛",
        failed: "❌",
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
            {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// Plan badge component
function PlanBadge({ plan }: { plan: string }) {
    const isPremium = plan === 'premium';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${isPremium
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
            {isPremium ? '👑' : '⭐'} VIP {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </span>
    );
}

// Mobile Invoice Card
function MobileInvoiceCard({ invoice }: { invoice: PaymentRecord }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                        {invoice.external_id?.substring(0, 15)}...
                    </code>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mt-2">{invoice.user_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{invoice.user_email}</p>
                </div>
                <StatusBadge status={invoice.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm border-t border-gray-50 dark:border-gray-700/50 pt-3">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(invoice.amount)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <PlanBadge plan={invoice.plan_type} />
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    {invoice.payment_method || 'Unknown Method'}
                </span>
                <span>
                    {new Date(invoice.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<PaymentRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filters
    const [status, setStatus] = useState<'all' | 'paid' | 'pending' | 'expired' | 'failed'>('all');
    const [planType, setPlanType] = useState<'all' | 'basic' | 'premium'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getInvoices({
                status,
                planType,
                search,
                page,
                limit,
            });
            setInvoices(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages || 0);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    }, [status, planType, search, page]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInvoices();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchInvoices]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [status, planType, search]);

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/finance" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            ← Finance
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">Invoices</span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3 mt-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📋 All Invoices</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            {total.toLocaleString('id-ID')} total
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">🔍</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari email, nama, atau Order ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">✅ Paid</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="expired">⌛ Expired</option>
                        <option value="failed">❌ Failed</option>
                    </select>

                    {/* Plan Filter */}
                    <select
                        value={planType}
                        onChange={(e) => setPlanType(e.target.value as any)}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Plans</option>
                        <option value="basic">⭐ VIP Basic</option>
                        <option value="premium">👑 VIP Premium</option>
                    </select>
                </div>
            </div>

            {/* Mobile/Tablet/Laptop List View */}
            <div className="2xl:hidden space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-lg text-gray-500">📭 Tidak ada invoice</p>
                    </div>
                ) : (
                    invoices.map((invoice) => (
                        <MobileInvoiceCard key={invoice.id} invoice={invoice} />
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden 2xl:block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-500 dark:text-gray-400">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-4xl opacity-50">🔍</span>
                                            <p className="text-lg font-medium">Tidak ada invoice ditemukan</p>
                                            <p className="text-sm">Coba ubah kata kunci atau filter pencarian</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 px-2 py-1 rounded font-mono group-hover:bg-white dark:group-hover:bg-black transition-colors border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700">
                                                {invoice.external_id?.substring(0, 8)}...
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                                    {invoice.user_name || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {invoice.user_email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PlanBadge plan={invoice.plan_type} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                                                {formatCurrency(invoice.amount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                                                {invoice.payment_method || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(invoice.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{((page - 1) * limit) + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * limit, total)}</span> of <span className="font-medium text-gray-900 dark:text-white">{total}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center">
                                Page {page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
