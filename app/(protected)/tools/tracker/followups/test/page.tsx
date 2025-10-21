"use client";

import { useEffect, useState } from "react";
import { testFetchFollowUps } from "@/actions/followup/test-fetch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestFollowUpsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    const res = await testFetchFollowUps();
    setResult(res);
    setLoading(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Follow-up Fetch Test</h1>
      
      <Button onClick={runTest} disabled={loading} className="mb-4">
        {loading ? "Testing..." : "Run Test Again"}
      </Button>

      <Card className="p-6">
        <pre className="text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </Card>

      <div className="mt-4 text-sm">
        <p><strong>Expected:</strong></p>
        <ul className="list-disc ml-6">
          <li>user.email: demo1@jobmate.com</li>
          <li>simpleQuery.count: 6</li>
          <li>joinQuery.count: 6</li>
          <li>No errors</li>
        </ul>
      </div>
    </div>
  );
}
