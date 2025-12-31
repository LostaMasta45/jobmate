'use client'

import { NavigationPrefetcher } from "@/components/providers/NavigationPrefetcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth already handled by middleware, no need to check again here
  // This prevents infinite redirect loops
  return (
    <>
      {children}
      {/* Aggressive Route Prefetcher for Instant Navigation */}
      <NavigationPrefetcher />
    </>
  );
}
