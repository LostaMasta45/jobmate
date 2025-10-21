import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('vip_job_alerts')
      .select('*')
      .eq('member_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/vip/alerts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nama_alert, kategori, lokasi, tipe_kerja, gaji_min, notif_email, notif_browser } =
      body

    if (!nama_alert) {
      return NextResponse.json({ error: 'nama_alert is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('vip_job_alerts')
      .insert({
        member_id: user.id,
        nama_alert,
        kategori: kategori || [],
        lokasi: lokasi || [],
        tipe_kerja: tipe_kerja || [],
        gaji_min,
        notif_email: notif_email !== undefined ? notif_email : true,
        notif_browser: notif_browser !== undefined ? notif_browser : true,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating alert:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/vip/alerts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
