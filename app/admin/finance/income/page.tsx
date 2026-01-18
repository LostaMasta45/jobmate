import { Suspense } from "react";
import Link from "next/link";
import { getIncomeReport } from "@/actions/admin/finance";
import { formatCurrency } from "@/lib/finance-utils";

// Income Card Component
function IncomeCard({
    title,
    amount,
    icon,
    subtitle,
    color = "purple"
}: {
    title: string;
    amount: number;
    icon: string;
    subtitle?: string;
    color?: "purple" | "blue" | "yellow";
}) {
    const colorStyles = {
        purple: "from-purple-500 to-purple-600",
        blue: "from-blue-500 to-blue-600",
        yellow: "from-yellow-500 to-yellow-600",
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles[color]} opacity-5`}></div>
            <div className="relative p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(amount)}
                        </p>
                        {subtitle && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                        )}
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white text-xl shadow-lg`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Progress Bar Component
function ProgressBar({
    label,
    value,
    total,
    color
}: {
    label: string;
    value: number;
    total: number;
    color: string;
}) {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                <span className="text-gray-500 dark:text-gray-400">{formatCurrency(value)} ({percentage}%)</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

// Mobile Income Card
function MobileIncomeCard({ item }: { item: any }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(item.period + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                    {item.transactionCount} Transaksi
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>VIP Basic</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.basicAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>VIP Premium</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.premiumAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.totalAmount)}</span>
                </div>
            </div>
        </div>
    );
}

// Content with data fetching
async function IncomeContent() {
    const incomeData = await getIncomeReport();

    return (
        <div className="space-y-6">
            {/* Income Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <IncomeCard
                    title="Total Income (All Time)"
                    amount={incomeData.totalIncome}
                    icon="💰"
                    subtitle={`${(incomeData.basicCount || 0) + (incomeData.premiumCount || 0)} transaksi sukses`}
                    color="purple"
                />
                <IncomeCard
                    title="VIP Basic Income"
                    amount={incomeData.basicIncome}
                    icon="⭐"
                    subtitle={`${incomeData.basicCount || 0} transaksi`}
                    color="blue"
                />
                <IncomeCard
                    title="VIP Premium Income"
                    amount={incomeData.premiumIncome}
                    icon="👑"
                    subtitle={`${incomeData.premiumCount || 0} transaksi`}
                    color="yellow"
                />
            </div>

            {/* Income Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Plan Type */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Income by Plan</h2>
                    <div className="space-y-4">
                        <ProgressBar
                            label="⭐ VIP Basic"
                            value={incomeData.basicIncome}
                            total={incomeData.totalIncome}
                            color="bg-blue-500"
                        />
                        <ProgressBar
                            label="👑 VIP Premium"
                            value={incomeData.premiumIncome}
                            total={incomeData.totalIncome}
                            color="bg-purple-500"
                        />
                    </div>
                </div>

                {/* By Payment Method */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💳 Income by Method</h2>
                    <div className="space-y-4">
                        {incomeData.byMethod.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                        ) : (
                            incomeData.byMethod.slice(0, 5).map((method, index) => (
                                <ProgressBar
                                    key={method.method}
                                    label={method.method.toUpperCase()}
                                    value={method.amount}
                                    total={incomeData.totalIncome}
                                    color={index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-gray-400"}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Monthly Income Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📅 Income by Month</h2>
                </div>

                {/* Mobile/Tablet/Laptop View */}
                <div className="2xl:hidden p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
                    {incomeData.byMonth.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            📭 Belum ada data income
                        </div>
                    ) : (
                        incomeData.byMonth.map((month) => (
                            <MobileIncomeCard key={month.period} item={month} />
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden 2xl:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">VIP Basic</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">VIP Premium</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {incomeData.byMonth.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <p className="text-lg">📭 Belum ada data income</p>
                                    </td>
                                </tr>
                            ) : (
                                incomeData.byMonth.map((month) => (
                                    <tr key={month.period} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {new Date(month.period + '-01').toLocaleDateString('id-ID', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {formatCurrency(month.basicAmount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {formatCurrency(month.premiumAmount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(month.totalAmount)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {month.transactionCount}x
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
    );
}

export default function IncomePage() {
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/finance" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            ← Finance
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">Income Report</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">📈 Income Report</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Laporan pendapatan masuk dari pembayaran VIP</p>
                </div>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <IncomeContent />
            </Suspense>
        </div>
    );
}
