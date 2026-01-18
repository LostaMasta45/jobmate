import { Suspense } from "react";
import Link from "next/link";
import {
    getRevenueOverview,
    getRecentPayments,
} from "@/actions/admin/finance";
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

// Revenue Card Component
// Revenue Card Component
function RevenueCard({
    title,
    amount,
    icon,
    subtitle,
    trend,
    color = "purple"
}: {
    title: string;
    amount: number;
    icon: string;
    subtitle?: string;
    trend?: string;
    color?: "purple" | "blue" | "green" | "yellow";
}) {
    const colorStyles = {
        purple: "from-purple-600 to-indigo-600",
        blue: "from-blue-600 to-cyan-600",
        green: "from-emerald-600 to-teal-600",
        yellow: "from-amber-500 to-orange-500",
    };

    const bgStyles = {
        purple: "bg-purple-50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100",
        blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100",
        green: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-100",
        yellow: "bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100",
    };

    return (
        <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <div className={`text-8xl bg-gradient-to-br ${colorStyles[color]} bg-clip-text text-transparent select-none`}>
                    {icon}
                </div>
            </div>

            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${bgStyles[color]} shadow-inner`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    {trend && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {trend}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {formatCurrency(amount)}
                    </p>
                    {subtitle && (
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-500 opacity-80">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className={`h-1.5 w-full bg-gradient-to-r ${colorStyles[color]} opacity-80`}></div>
        </div>
    );
}

// Stats Card Component
// Stats Card Component
function StatsCard({
    title,
    count,
    amount,
    icon,
    color
}: {
    title: string;
    count: number;
    amount?: number;
    icon: string;
    color: string;
}) {
    return (
        <div className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-xl shadow-sm`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count.toLocaleString('id-ID')}</p>
                    {amount !== undefined && (
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{formatCurrency(amount)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mobile Transaction Card
function MobileTransactionCard({ payment }: { payment: any }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                        👤
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{payment.user_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{payment.user_email}</p>
                    </div>
                </div>
                <StatusBadge status={payment.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <PlanBadge plan={payment.plan_type} />
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>{payment.payment_method || 'Unknown Method'}</span>
                <span>
                    {new Date(payment.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
}

// Main Dashboard Content
async function FinanceDashboardContent() {
    const [overview, recentPayments] = await Promise.all([
        getRevenueOverview(),
        getRecentPayments(8),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Finance Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview keuangan dan transaksi pembayaran</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    <Link
                        href="/admin/finance/invoices"
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        📋 All Invoices
                    </Link>
                    <Link
                        href="/admin/finance/rekap"
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        📊 Rekap
                    </Link>
                    <Link
                        href="/admin/finance/income"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        📈 Income Report
                    </Link>
                </div>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                <RevenueCard
                    title="Total Revenue"
                    amount={overview.totalRevenue}
                    icon="💰"
                    subtitle={`${overview.paidCount} transaksi sukses`}
                    color="purple"
                    trend="+12%"
                />
                <RevenueCard
                    title="Bulan Ini"
                    amount={overview.thisMonthRevenue}
                    icon="📈"
                    color="blue"
                    trend="+5%"
                />
                <RevenueCard
                    title="Minggu Ini"
                    amount={overview.thisWeekRevenue}
                    icon="📊"
                    color="green"
                />
                <RevenueCard
                    title="Hari Ini"
                    amount={overview.todayRevenue}
                    icon="📅"
                    color="yellow"
                />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Paid"
                    count={overview.paidCount}
                    amount={overview.totalRevenue}
                    icon="✅"
                    color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                />
                <StatsCard
                    title="Pending"
                    count={overview.pendingCount}
                    amount={overview.pendingAmount}
                    icon="⏳"
                    color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                />
                <StatsCard
                    title="Expired"
                    count={overview.expiredCount}
                    icon="⌛"
                    color="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                />
                <StatsCard
                    title="Failed"
                    count={overview.failedCount}
                    icon="❌"
                    color="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            📋 Transaksi Terbaru
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Daftar transaksi pembayaran terakhir</p>
                    </div>
                    <Link
                        href="/admin/finance/invoices"
                        className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 group"
                    >
                        Lihat Semua
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                </div>

                {/* Mobile/Tablet/Laptop List View */}
                <div className="2xl:hidden p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
                    {recentPayments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
                    ) : (
                        recentPayments.map((payment) => (
                            <MobileTransactionCard key={payment.id} payment={payment} />
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-4xl">📭</div>
                                            <p className="text-lg font-medium">Belum ada transaksi</p>
                                            <p className="text-sm">Transaksi pembayaran akan muncul di sini</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs">
                                                    👤
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                                        {payment.user_name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                        {payment.user_email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PlanBadge plan={payment.plan_type} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {payment.payment_method || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(payment.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
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
            </div>
        </div>
    );
}

// Loading skeleton
function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
    );
}

export default function AdminFinancePage() {
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Suspense fallback={<LoadingSkeleton />}>
                <FinanceDashboardContent />
            </Suspense>
        </div>
    );
}
