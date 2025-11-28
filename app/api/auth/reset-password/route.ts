// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token dan password diperlukan' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Verify token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah digunakan' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token sudah kedaluwarsa. Silakan request reset password baru.' },
        { status: 400 }
      );
    }

    // Get user ID from profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', tokenData.email.toLowerCase())
      .single();
    
    if (profileError || !profile) {
      console.error('Error getting user profile:', profileError);
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update password using the user ID from profiles
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.id,
      { password }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Gagal mengupdate password' },
        { status: 500 }
      );
    }

    // Mark token as used
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    console.log('✅ Password updated successfully for:', tokenData.email);

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// Verify token validity (GET)
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token diperlukan' },
        { status: 400 }
      );
    }

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('email, expires_at, used')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { valid: false, error: 'Token tidak ditemukan' },
        { status: 404 }
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        { valid: false, error: 'Token sudah digunakan' },
        { status: 400 }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Token sudah kedaluwarsa' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: tokenData.email,
    });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { valid: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
