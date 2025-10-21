'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  lokerId: string
  initialBookmarked: boolean
  iconOnly?: boolean
}

export function BookmarkButton({
  lokerId,
  initialBookmarked,
  iconOnly = false,
}: BookmarkButtonProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    try {
      const response = await fetch('/api/vip/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loker_id: lokerId }),
      })

      if (response.ok) {
        setIsBookmarked(!isBookmarked)
        router.refresh()
      } else {
        console.error('Failed to toggle bookmark')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (iconOnly) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={isBookmarked ? 'bg-blue-50 border-blue-300' : ''}
      >
        <Bookmark
          className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
        />
      </Button>
    )
  }

  return (
    <Button
      variant={isBookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="gap-2"
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
      {isBookmarked ? 'Tersimpan' : 'Simpan'}
    </Button>
  )
}
