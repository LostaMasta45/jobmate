"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb from path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/admin/dashboard" }
    ];

    // Map paths to readable labels
    const labelMap: Record<string, string> = {
      "vip-loker": "Kelola Loker",
      "tambah": "Tambah Loker",
      "edit": "Edit Loker",
      "perusahaan": "Perusahaan",
      "member": "Member VIP",
      "tools-ai": "Tools AI",
      "caption": "Caption Generator",
      "analytics": "Laporan",
      "applications": "Applications",
      "observability": "Observability",
    };

    let currentPath = "";
    paths.forEach((path, index) => {
      // Skip "admin" in breadcrumb
      if (path === "admin") return;
      
      currentPath += `/${path}`;
      const label = labelMap[path] || path;
      
      // Don't add if it's an ID (UUID pattern)
      if (path.length === 36 && path.includes("-")) return;
      
      breadcrumbs.push({
        label,
        href: currentPath.startsWith("/admin") ? currentPath : `/admin${currentPath}`,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        href="/admin/dashboard"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.slice(1).map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {index === breadcrumbs.length - 2 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
