"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Loader2,
    RefreshCw,
    ExternalLink,
    Copy,
    CheckCircle2,
    Clock,
    XCircle,
    Settings,
    Database,
    Webhook,
} from "lucide-react";

interface Transaction {
    id: string;
    order_id: string;
    amount: number;
    total_amount: number;
    status: string;
    email: string;
    full_name: string;
    plan_type: string;
    created_at: string;
    paid_at: string | null;
}

interface Stats {
    total: number;
    pending: number;
    paid: number;
    expired: number;
    totalRevenue: number;
}

export default function TestMYPGAdminPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/mypg/transactions?limit=50');
            const data = await response.json();

            if (data.success) {
                setTransactions(data.transactions);
                setStats(data.stats);
            } else {
                setError(data.error || 'Failed to fetch transactions');
            }
        } catch (err: any) {
            console.error('Error fetching transactions:', err);
            setError(err.message || 'Error fetching transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'SUCCESS':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
            case 'PENDING':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'EXPIRED':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/mypg/webhook`
        : 'https://yourdomain.com/api/mypg/webhook';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
            {/* Admin Banner */}
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center py-2 font-bold z-50">
                📊 MY PG ADMIN DASHBOARD - Transaction Overview
            </div>

            <div className="container max-w-6xl mx-auto mt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MY PG Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Lihat semua transaksi pembayaran via MY PG (klikqris.com)</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={fetchTransactions} disabled={loading} variant="outline">
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button onClick={() => window.open('/test-mypg?plan=test', '_blank')} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                            + Buat Payment Baru
                        </Button>
                    </div>
                </div>

                {/* Webhook Info Card */}
                <Card className="mb-6 border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Webhook className="w-5 h-5 text-orange-600" />
                            Webhook Configuration
                        </CardTitle>
                        <CardDescription>Set URL ini di aplikasi Android KlikQRIS untuk menerima notifikasi pembayaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border">
                            <code className="flex-1 text-sm text-orange-600 dark:text-orange-400 font-mono truncate">
                                {webhookUrl}
                            </code>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                            >
                                {copied === 'webhook' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                                <p className="text-sm text-slate-500">Total Transaksi</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                                <p className="text-sm text-slate-500">Pending</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
                                <p className="text-sm text-slate-500">Paid</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                                <p className="text-sm text-slate-500">Expired</p>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2 md:col-span-1">
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</div>
                                <p className="text-sm text-slate-500">Total Revenue</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Daftar Transaksi
                        </CardTitle>
                        <CardDescription>Semua transaksi yang tersimpan di database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada transaksi</p>
                                <Button onClick={() => window.open('/test-mypg?plan=test', '_blank')} variant="link" className="text-orange-600">
                                    Buat payment pertama →
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800">
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Order ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Customer</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Plan</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Amount</th>
                                            <th className="text-center py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                <td className="py-3 px-4">
                                                    <code className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                        {tx.order_id}
                                                    </code>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{tx.full_name || '-'}</div>
                                                    <div className="text-xs text-slate-500">{tx.email || '-'}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className="capitalize">{tx.plan_type || '-'}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">
                                                    {formatCurrency(tx.total_amount || tx.amount)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {getStatusBadge(tx.status)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-500">
                                                    {formatDate(tx.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Info */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            MY PG API Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Merchant ID</p>
                                <code className="text-sm font-mono text-slate-900 dark:text-white">176930678538</code>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Base URL</p>
                                <code className="text-sm font-mono text-slate-900 dark:text-white">https://klikqris.com/api/qrisv2/</code>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>📱 Penting:</strong> Set Webhook URL di aplikasi Android <strong>KlikQRIS</strong> untuk menerima notifikasi pembayaran otomatis.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="mt-6 flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => window.open('/test-mypg', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test Payment Page
                    </Button>
                    <Button variant="outline" onClick={() => window.open('https://klikqris.com/pg/dokumentasi', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        MY PG Docs
                    </Button>
                </div>
            </div>
        </div>
    );
}
