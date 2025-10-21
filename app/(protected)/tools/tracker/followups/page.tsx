import { Suspense } from "react";
import { FollowUpsPageContent } from "./FollowUpsPageContent";

export const metadata = {
  title: "Follow-up Reminders - JobMate",
  description: "Manage your job application follow-ups",
};

export default function FollowUpsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <Suspense fallback={<FollowUpsPageSkeleton />}>
        <FollowUpsPageContent />
      </Suspense>
    </div>
  );
}

function FollowUpsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
