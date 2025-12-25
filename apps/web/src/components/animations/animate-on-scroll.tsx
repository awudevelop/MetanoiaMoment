'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Hook to detect reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

type AnimationType =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in'
  | 'scale-in-bounce'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'slide-in-left'
  | 'slide-in-right'

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  className?: string
}

export function AnimateOnScroll({
  children,
  animation = 'fade-in-up',
  delay = 0,
  duration,
  threshold = 0.1,
  once = true,
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, once, prefersReducedMotion])

  // For reduced motion, just show the content without animation classes
  const animationClass = prefersReducedMotion
    ? ''
    : isVisible
      ? `animate-${animation}`
      : 'opacity-0'

  return (
    <div
      ref={ref}
      className={cn(animationClass, className)}
      style={
        prefersReducedMotion
          ? undefined
          : {
              animationDelay: delay ? `${delay}ms` : undefined,
              animationDuration: duration ? `${duration}ms` : undefined,
            }
      }
    >
      {children}
    </div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  animation?: AnimationType
  staggerDelay?: number
  threshold?: number
  once?: boolean
  className?: string
}

export function StaggerChildren({
  children,
  animation = 'fade-in-up',
  staggerDelay = 100,
  threshold = 0.1,
  once = true,
  className,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, once, prefersReducedMotion])

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={
                prefersReducedMotion ? '' : isVisible ? `animate-${animation}` : 'opacity-0'
              }
              style={
                prefersReducedMotion ? undefined : { animationDelay: `${index * staggerDelay}ms` }
              }
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

// Export the hook for use in other components
export { usePrefersReducedMotion }
