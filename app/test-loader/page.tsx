"use client";

import * as React from "react";
import { MobileSignInLoader } from "@/components/auth/MobileSignInLoader";
import { ScannerLoader } from "@/components/auth/ScannerLoader";
import { RocketLoader } from "@/components/auth/RocketLoader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TestLoaderPage() {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error' | null>(null);
  const [activeLoader, setActiveLoader] = React.useState<'walking' | 'scanner' | 'rocket'>('walking');

  const startTest = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 4000);
    }, 5000); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">Loader Animation Gallery</h1>
      <p className="text-slate-500 mb-8">Test different loading screen concepts</p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
        <Tabs defaultValue="walking" onValueChange={(v) => setActiveLoader(v as any)} className="w-full mb-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="walking">Walking</TabsTrigger>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="rocket">Rocket</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={startTest}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-lg"
          >
            ▶ Play Full Animation
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setStatus('loading')}
              variant="outline"
            >
              Loop Loading
            </Button>

            <Button 
              onClick={() => setStatus('success')}
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              Show Success
            </Button>
          </div>

          <Button 
            onClick={() => setStatus(null)}
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Reset / Close
          </Button>
        </div>
      </div>

      {status && (
        activeLoader === 'walking' ? (
            <MobileSignInLoader status={status} />
        ) : activeLoader === 'scanner' ? (
            <ScannerLoader status={status} />
        ) : (
            <RocketLoader status={status} />
        )
      )}
    </div>
  );
}
