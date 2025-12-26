'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { cn } from '@metanoia/ui'
import { SearchModal } from './search-modal'

interface SearchTriggerProps {
  variant?: 'button' | 'input'
  className?: string
}

export function SearchTrigger({ variant = 'button', className }: SearchTriggerProps) {
  const t = useTranslations('search')
  const [isOpen, setIsOpen] = useState(false)

  // Open with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (variant === 'input') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border border-warm-300 bg-white px-4 py-3 text-left transition-colors hover:border-warm-400',
            className
          )}
        >
          <Search className="h-5 w-5 text-warm-400" />
          <span className="flex-1 text-warm-400">{t('placeholder')}</span>
          <kbd className="hidden rounded bg-warm-100 px-2 py-0.5 text-xs text-warm-500 sm:inline-block">
            ⌘K
          </kbd>
        </button>
        <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700',
          className
        )}
        aria-label={t('open')}
      >
        <Search className="h-5 w-5" />
      </button>
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
