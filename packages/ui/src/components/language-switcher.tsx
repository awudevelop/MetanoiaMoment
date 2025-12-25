'use client'

import * as React from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export interface Language {
  code: string
  name: string
  nativeName: string
  dir?: 'ltr' | 'rtl'
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
]

export interface LanguageSwitcherProps {
  currentLocale: string
  onLocaleChange: (locale: string) => void
  className?: string
}

export function LanguageSwitcher({
  currentLocale,
  onLocaleChange,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === currentLocale) || SUPPORTED_LANGUAGES[0]

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-warm-700 transition-colors hover:bg-warm-100"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.nativeName}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-warm-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLocaleChange(language.code)
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-warm-50',
                language.code === currentLocale && 'bg-primary-50 text-primary-600'
              )}
              role="option"
              aria-selected={language.code === currentLocale}
            >
              <span>{language.nativeName}</span>
              <span className="text-warm-400">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
