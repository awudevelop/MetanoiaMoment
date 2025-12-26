'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@metanoia/ui'
import { debounce } from '@/lib/validation'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  isLoading?: boolean
  showClear?: boolean
  autoFocus?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-base',
  lg: 'h-14 text-lg',
}

const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function SearchInput({
  placeholder,
  value: controlledValue,
  onChange,
  onSearch,
  isLoading = false,
  showClear = true,
  autoFocus = false,
  className,
  size = 'md',
}: SearchInputProps) {
  const t = useTranslations('search')
  const [internalValue, setInternalValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue ?? internalValue
  const hasValue = value.length > 0

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch?.(query)
    }, 300),
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && hasValue) {
      handleClear()
    }
    if (e.key === 'Enter') {
      onSearch?.(value)
    }
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isLoading ? (
          <Loader2 className={cn('animate-spin text-warm-400', ICON_SIZES[size])} />
        ) : (
          <Search className={cn('text-warm-400', ICON_SIZES[size])} />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('placeholder')}
        className={cn(
          'w-full rounded-xl border border-warm-300 bg-white pl-10 pr-10 text-warm-900 placeholder:text-warm-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          'transition-colors duration-150',
          SIZES[size]
        )}
        aria-label={t('label')}
      />

      {/* Clear Button */}
      {showClear && hasValue && !isLoading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-warm-400 hover:text-warm-600"
          aria-label={t('clear')}
        >
          <X className={ICON_SIZES[size]} />
        </button>
      )}
    </div>
  )
}
