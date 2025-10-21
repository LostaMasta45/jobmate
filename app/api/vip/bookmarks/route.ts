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

    const { loker_id } = await request.json()

    if (!loker_id) {
      return NextResponse.json({ error: 'loker_id is required' }, { status: 400 })
    }

    // Insert bookmark
    const { error } = await supabase.from('vip_member_bookmarks').insert({
      member_id: user.id,
      loker_id,
    })

    if (error) {
      console.error('Error creating bookmark:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/vip/bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { loker_id } = await request.json()

    if (!loker_id) {
      return NextResponse.json({ error: 'loker_id is required' }, { status: 400 })
    }

    // Delete bookmark
    const { error } = await supabase
      .from('vip_member_bookmarks')
      .delete()
      .eq('member_id', user.id)
      .eq('loker_id', loker_id)

    if (error) {
      console.error('Error deleting bookmark:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/vip/bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
