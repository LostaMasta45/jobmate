import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { loker_id, method } = await request.json()

    if (!loker_id || !method) {
      return NextResponse.json(
        { error: 'loker_id and method are required' },
        { status: 400 }
      )
    }

    if (!['whatsapp', 'email'].includes(method)) {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    }

    // Insert application tracking
    const { error } = await supabase.from('vip_loker_applications').insert({
      loker_id,
      member_id: user.id,
      method,
    })

    if (error) {
      console.error('Error tracking application:', error)
      // Don't fail the request if tracking fails
      return NextResponse.json({ success: true, tracked: false })
    }

    return NextResponse.json({ success: true, tracked: true })
  } catch (error) {
    console.error('Error in POST /api/vip/loker/apply:', error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: true, tracked: false })
  }
}
