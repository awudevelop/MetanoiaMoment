'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'tilt' | 'none'
  onClick?: () => void
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = 'lift',
  onClick,
}: AnimatedCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect !== 'tilt' || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setTilt({
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const effectClasses = {
    lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
    scale: 'transition-all duration-300 hover:scale-[1.02]',
    glow: 'transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20',
    tilt: 'transition-transform duration-150',
    none: '',
  }

  return (
    <div
      ref={cardRef}
      className={cn(effectClasses[hoverEffect], className)}
      style={
        hoverEffect === 'tilt'
          ? {
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  effect?: 'pulse' | 'bounce' | 'wiggle' | 'ripple'
  onClick?: () => void
  disabled?: boolean
}

export function AnimatedButton({
  children,
  className,
  effect = 'ripple',
  onClick,
  disabled,
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (effect === 'ripple' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }

    onClick?.()
  }

  const effectClasses = {
    pulse: 'active:animate-pulse-soft',
    bounce: 'active:animate-bounce-soft',
    wiggle: 'active:animate-wiggle',
    ripple: 'relative overflow-hidden',
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        'transition-all duration-200',
        effectClasses[effect],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      {effect === 'ripple' &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-scale-in pointer-events-none"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              animationDuration: '600ms',
            }}
          />
        ))}
    </button>
  )
}

interface AnimatedIconProps {
  children: React.ReactNode
  className?: string
  animation?: 'spin' | 'pulse' | 'bounce' | 'wiggle' | 'none'
  hover?: boolean
}

export function AnimatedIcon({
  children,
  className,
  animation = 'none',
  hover = false,
}: AnimatedIconProps) {
  const animationClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse-soft',
    bounce: 'animate-bounce-soft',
    wiggle: 'animate-wiggle',
    none: '',
  }

  const hoverAnimationClasses = {
    spin: 'group-hover:animate-spin',
    pulse: 'group-hover:animate-pulse-soft',
    bounce: 'group-hover:animate-bounce-soft',
    wiggle: 'group-hover:animate-wiggle',
    none: '',
  }

  return (
    <span
      className={cn(
        'inline-flex transition-transform duration-200',
        hover ? hoverAnimationClasses[animation] : animationClasses[animation],
        className
      )}
    >
      {children}
    </span>
  )
}

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  separator?: string
  decimals?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  separator = ',',
  decimals = 0,
  className,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now()
    const diff = end - start

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + diff * eased

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [hasStarted, start, end, duration])

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return parts.join('.')
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

interface TypeWriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  cursor?: boolean
  onComplete?: () => void
}

export function TypeWriter({
  text,
  speed = 50,
  delay = 0,
  className,
  cursor = true,
  onComplete,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(cursor)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, index + 1))
        index++

        if (index >= text.length) {
          clearInterval(interval)
          if (cursor) {
            setTimeout(() => setShowCursor(false), 1000)
          }
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [hasStarted, text, speed, delay, cursor, onComplete])

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-pulse-soft ml-0.5 inline-block w-0.5 h-[1em] bg-current align-middle" />
      )}
    </span>
  )
}
