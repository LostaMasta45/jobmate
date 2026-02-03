'use client';

import { QRCard } from "@/components/mypg/QRCard";
import { QRCardGlass } from "@/components/mypg/QRCardGlass";
import { QRCardMinimal } from "@/components/mypg/QRCardMinimal";
import { QRCardVibrant } from "@/components/mypg/QRCardVibrant";
import { QRCardTicket } from "@/components/mypg/QRCardTicket";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DesainQRPage() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Mock Data
    const dummyPayment = {
        amount: 10000,
        orderId: 'MYPG-TEST-123456789',
        qrisImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', // Sample QR
        customerData: {
            plan: 'Pro VIP Lifetime',
            fullName: 'Ahmad User'
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0B0F19]' : 'bg-slate-50'} py-12 px-4 transition-colors duration-500`}>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Desain QR Preview</h1>
                        <p className="text-slate-500">Preview hasil desain QR dari PG klikqris.com</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            Toggle Theme
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start pb-20">

                    {/* Design 1: Standard */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Standard National</h3>
                            <p className="text-sm text-slate-500">Official Look & Feel</p>
                        </div>
                        <QRCard paymentData={dummyPayment} />
                    </div>

                    {/* Design 2: Glassmorphism */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Future Glass</h3>
                            <p className="text-sm text-slate-500">Premium & Modern</p>
                        </div>
                        <QRCardGlass paymentData={dummyPayment} />
                    </div>

                    {/* Design 3: Vibrant */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Electric Vibrant</h3>
                            <p className="text-sm text-slate-500">High Energy Gradient</p>
                        </div>
                        <QRCardVibrant paymentData={dummyPayment} />
                    </div>

                    {/* Design 4: Minimal */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pure Minimal</h3>
                            <p className="text-sm text-slate-500">Clean & Corporate</p>
                        </div>
                        <QRCardMinimal paymentData={dummyPayment} />
                    </div>

                    {/* Design 5: Ticket */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Retro Ticket</h3>
                            <p className="text-sm text-slate-500">Playful Receipt Style</p>
                        </div>
                        <QRCardTicket paymentData={dummyPayment} />
                    </div>

                </div>
            </div>
        </div>
    )
}
