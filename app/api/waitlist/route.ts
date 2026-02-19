import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone } = body;

        // Validate
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Nama lengkap harus diisi (minimal 2 karakter)" },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { error: "Nomor WhatsApp harus diisi" },
                { status: 400 }
            );
        }

        // Normalize phone: remove spaces, dashes
        const cleanPhone = phone.replace(/[\s\-()]/g, "");

        // Validate Indonesian phone number pattern
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { error: "Format nomor WhatsApp tidak valid. Contoh: 08123456789" },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        // Check if phone already registered
        const { data: existing } = await supabase
            .from("waitlist")
            .select("id")
            .eq("phone", cleanPhone)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({
                success: true,
                already_registered: true,
                message: "Nomor ini sudah terdaftar di waitlist!",
                wa_group_link: "https://chat.whatsapp.com/PLACEHOLDER_GROUP_LINK",
            });
        }

        // Insert new waitlist entry
        const { error } = await supabase.from("waitlist").insert({
            name: name.trim(),
            phone: cleanPhone,
        });

        if (error) {
            console.error("Waitlist insert error:", error);
            return NextResponse.json(
                { error: "Gagal mendaftar. Silakan coba lagi." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            already_registered: false,
            message: "Berhasil terdaftar di waitlist!",
            wa_group_link: "https://chat.whatsapp.com/PLACEHOLDER_GROUP_LINK",
        });
    } catch (error) {
        console.error("Waitlist API error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server." },
            { status: 500 }
        );
    }
}
