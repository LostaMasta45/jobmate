'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(lokerId: string, pathname: string) {
    const supabase = await createClient()

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    try {
        // 2. Check if already bookmarked
        const { data: existingBookmark } = await supabase
            .from('vip_member_bookmarks')
            .select('id')
            .eq('member_id', user.id)
            .eq('loker_id', lokerId)
            .single()

        if (existingBookmark) {
            // 3. Remove bookmark
            await supabase
                .from('vip_member_bookmarks')
                .delete()
                .eq('id', existingBookmark.id)

            revalidatePath(pathname)
            return { isBookmarked: false }
        } else {
            // 4. Add bookmark
            await supabase
                .from('vip_member_bookmarks')
                .insert({
                    member_id: user.id,
                    loker_id: lokerId,
                })

            revalidatePath(pathname)
            return { isBookmarked: true }
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error)
        return { error: 'Failed to toggle bookmark' }
    }
}
