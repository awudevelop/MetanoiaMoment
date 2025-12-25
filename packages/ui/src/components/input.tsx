import * as React from 'react'
import { cn } from '../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-warm-700 mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="text-warm-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'border-warm-300 text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:ring-primary-500/20 flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-base focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
