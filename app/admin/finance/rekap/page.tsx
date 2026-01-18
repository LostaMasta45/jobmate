import { Suspense } from "react";
import Link from "next/link";
import { getRekapByStatus } from "@/actions/admin/finance";
import { formatCurrency } from "@/lib/finance-utils";

// Status tabs data
const statusTabs = [
    { id: 'paid', label: 'Sudah Bayar', icon: '✅', color: 'green' },
    { id: 'pending', label: 'Belum Bayar', icon: '⏳', color: 'yellow' },
    { id: 'expired', label: 'Expired', icon: '⌛', color: 'gray' },
    { id: 'failed', label: 'Failed', icon: '❌', color: 'red' },
] as const;

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

// Rekap Card
function RekapCard({
    status,
    label,
    icon,
    count,
    totalAmount,
    isSelected,
    color
}: {
    status: string;
    label: string;
    icon: string;
    count: number;
    totalAmount: number;
    isSelected: boolean;
    color: string;
}) {
    const colorStyles: Record<string, string> = {
        green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
        yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
        gray: 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
        red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    };

    return (
        <Link
            href={`/admin/finance/rekap?status=${status}`}
            className={`block p-4 rounded-xl border-2 transition-all hover:shadow-md ${isSelected ? colorStyles[color] : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{count.toLocaleString('id-ID')} transaksi</p>
                    {status === 'paid' && (
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(totalAmount)}</p>
                    )}
                    {status === 'pending' && (
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{formatCurrency(totalAmount)} potential</p>
                    )}
                </div>
            </div>
        </Link>
    );
}

// Mobile Rekap Item
function MobileRekapItem({ item, status }: { item: any, status: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                        👤
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.user_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{item.user_email}</p>
                    </div>
                </div>
                <PlanBadge plan={item.plan_type} />
            </div>

            <div className="flex justify-between items-center py-2 border-t border-b border-gray-50 dark:border-gray-700/50 my-2">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.amount)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    {item.payment_method || 'Unknown Method'}
                </span>
                <span>
                    {new Date(item.paid_at || item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
}

// Content with data fetching
async function RekapContent({ selectedStatus }: { selectedStatus: string }) {
    // Fetch all rekap data
    const [paidData, pendingData, expiredData, failedData] = await Promise.all([
        getRekapByStatus('paid'),
        getRekapByStatus('pending'),
        getRekapByStatus('expired'),
        getRekapByStatus('failed'),
    ]);

    const rekapData: Record<string, { count: number; totalAmount: number; data: any[] }> = {
        paid: paidData,
        pending: pendingData,
        expired: expiredData,
        failed: failedData,
    };

    const currentData = rekapData[selectedStatus] || rekapData.paid;

    return (
        <div className="space-y-6">
            {/* Rekap Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                {statusTabs.map((tab) => (
                    <RekapCard
                        key={tab.id}
                        status={tab.id}
                        label={tab.label}
                        icon={tab.icon}
                        count={rekapData[tab.id].count}
                        totalAmount={rekapData[tab.id].totalAmount}
                        isSelected={selectedStatus === tab.id}
                        color={tab.color}
                    />
                ))}
            </div>

            {/* Selected Status Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {statusTabs.find(t => t.id === selectedStatus)?.icon}
                        {statusTabs.find(t => t.id === selectedStatus)?.label || 'Rekap'}
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {currentData.count} transaksi
                        </span>
                    </h2>
                </div>

                {/* Mobile/Tablet/Laptop List View */}
                <div className="2xl:hidden p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
                    {currentData.data.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            📭 Tidak ada data
                        </div>
                    ) : (
                        currentData.data.slice(0, 10).map((item: any) => (
                            <MobileRekapItem key={item.id} item={item} status={selectedStatus} />
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden 2xl:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {selectedStatus === 'paid' ? 'Paid At' : 'Created'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {currentData.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-4xl opacity-50">📭</span>
                                            <p className="text-lg font-medium">Tidak ada data transaksi</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentData.data.slice(0, 20).map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center text-xs">
                                                    👤
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {item.user_name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.user_email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PlanBadge plan={item.plan_type} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                                                {formatCurrency(item.amount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {item.payment_method || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.paid_at || item.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {currentData.data.length > 20 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 text-center">
                        <Link
                            href={`/admin/finance/invoices?status=${selectedStatus}`}
                            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                            Lihat semua {currentData.count} transaksi →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Loading skeleton
function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
    );
}

export default async function RekapPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const selectedStatus = params.status || 'paid';

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/finance" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            ← Finance
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">Rekap</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">📊 Rekap Data</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rekap transaksi berdasarkan status</p>
                </div>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <RekapContent selectedStatus={selectedStatus} />
            </Suspense>
        </div>
    );
}
