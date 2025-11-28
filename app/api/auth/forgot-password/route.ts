// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import React from 'react';
import { resend } from '@/lib/resend';
import { render } from '@react-email/render';
import { ResetPasswordEmail, ResetPasswordEmailText } from '@/emails/ResetPasswordEmail';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email diperlukan' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Processing reset request for:', normalizedEmail);

    // Find user in profiles table (case-insensitive email search)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .ilike('email', normalizedEmail)
      .single();
    
    if (profileError || !profile) {
      console.log('⚠️ Profile lookup failed:', profileError?.message);
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { success: true, message: 'Jika email terdaftar, link reset akan dikirim' },
        { status: 200 }
      );
    }

    const userId = profile.id;
    const userName = profile.full_name;
    console.log('✅ Found user in profiles:', { userId, userName });

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Invalidate any existing tokens for this email
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('used', false);

    // Store new token
    const { error: insertError } = await supabaseAdmin
      .from('password_reset_tokens')
      .insert({
        email: normalizedEmail,
        token,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error('Error storing token:', insertError);
      return NextResponse.json(
        { error: 'Gagal memproses permintaan' },
        { status: 500 }
      );
    }

    const displayName = userName || normalizedEmail.split('@')[0];

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    // Send email via Resend
    console.log('📤 Sending email to:', normalizedEmail, 'with name:', displayName);
    
    const emailHtml = await render(
      React.createElement(ResetPasswordEmail, {
        userName: displayName,
        email: normalizedEmail,
        resetUrl,
        expiresIn: '1 jam',
      })
    );

    const emailText = ResetPasswordEmailText({
      userName: displayName,
      email: normalizedEmail,
      resetUrl,
      expiresIn: '1 jam',
    });

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: 'JOBMATE <admin@jobmate.web.id>',
      to: normalizedEmail,
      subject: '🔐 Reset Password - JOBMATE',
      html: String(emailHtml),
      text: emailText,
      tags: [
        { name: 'category', value: 'password-reset' },
      ],
    });

    if (sendError) {
      console.error('Error sending email:', sendError);
      return NextResponse.json(
        { error: 'Gagal mengirim email' },
        { status: 500 }
      );
    }

    console.log('✅ Reset password email sent:', sendData);

    return NextResponse.json({
      success: true,
      message: 'Link reset password telah dikirim ke email Anda',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
