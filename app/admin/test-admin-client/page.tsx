"use client";

import { useState } from "react";
import { testAdminClientConnection } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAdminClientPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await testAdminClientConnection();
      setResults(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Test Admin Client Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTest} disabled={loading}>
            {loading ? "Testing..." : "Run Test"}
          </Button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Error
              </h3>
              <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Environment Check */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Environment Check
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={results.env_check.hasServiceRoleKey ? "text-green-600" : "text-red-600"}>
                      {results.env_check.hasServiceRoleKey ? "✅" : "❌"}
                    </span>
                    <span>Service Role Key: {results.env_check.hasServiceRoleKey ? `Present (${results.env_check.keyLength} chars)` : "Missing"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={results.env_check.hasSupabaseUrl ? "text-green-600" : "text-red-600"}>
                      {results.env_check.hasSupabaseUrl ? "✅" : "❌"}
                    </span>
                    <span>Supabase URL: {results.env_check.supabaseUrl || "Missing"}</span>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="space-y-2">
                <h3 className="font-semibold">Test Results</h3>
                {results.tests.map((test: any, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      test.success
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={test.success ? "text-green-600" : "text-red-600"}>
                        {test.success ? "✅" : "❌"}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{test.name}</h4>
                        {test.userCount !== undefined && (
                          <p className="text-sm mt-1">Users found: {test.userCount}</p>
                        )}
                        {test.userId && (
                          <p className="text-sm mt-1">User ID: {test.userId}</p>
                        )}
                        {test.error && (
                          <div className="mt-2 text-sm">
                            <p className="font-semibold">Error:</p>
                            <pre className="mt-1 whitespace-pre-wrap">{test.error}</pre>
                            {test.errorCode && <p className="mt-1">Code: {test.errorCode}</p>}
                            {test.errorStatus && <p>Status: {test.errorStatus}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raw Results */}
              <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold">Raw Results (JSON)</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
