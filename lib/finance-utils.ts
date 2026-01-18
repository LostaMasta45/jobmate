// Finance utility functions (non-server actions)

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        paid: "green",
        pending: "yellow",
        expired: "gray",
        failed: "red",
    };
    return colors[status] || "gray";
}

export function getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
        paid: "✅",
        pending: "⏳",
        expired: "⌛",
        failed: "❌",
    };
    return icons[status] || "❓";
}
